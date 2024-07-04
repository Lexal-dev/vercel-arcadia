import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeInstance from '@/lib/sequelize';
// Retirez l'importation directe d'Animal pour éviter la dépendance circulaire

interface RaceAttributes {
    id: number;
    name: string;
}

interface RaceCreationAttributes extends Optional<RaceAttributes, 'id'> {}

class Race extends Model<RaceAttributes, RaceCreationAttributes> implements RaceAttributes {
    public id!: number;
    public name!: string;
}

Race.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [3, 50],
                    msg: "Le nom doit être compris entre 3 et 50 caractères",
                },
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: 'races',
        timestamps: false,
    }
);

// Déplacer la relation vers une fonction pour éviter les problèmes de dépendance circulaire
export function associateModels() {
    const Animal = require('./animal').default;
    Race.hasMany(Animal, { foreignKey: 'raceId' });
}

export default Race;