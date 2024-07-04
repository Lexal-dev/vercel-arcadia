import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeInstance from '@/lib/sequelize';
// Retirez l'importation directe de Race pour éviter la dépendance circulaire

interface AnimalAttributes {
    id: number;
    name: string;
    etat: string;
    raceId: number;
}

interface AnimalCreationAttributes extends Optional<AnimalAttributes, 'id'> {}

class Animal extends Model<AnimalAttributes, AnimalCreationAttributes> implements AnimalAttributes {
    public id!: number;
    public name!: string;
    public etat!: string;
    public raceId!: number;
}

Animal.init(
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
                    args: [3, 30],
                    msg: "le nom doit être compris entre [3 - 30] caractères",
                },
            },
        },
        etat: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 100],
                    msg: "le message d'etat doit être compris entre [3 - 100] caractères",
                },
            },
        },
        raceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'races', // Nom de la table races
                key: 'id',
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: 'animals',
        timestamps: false,
    }
);

// Déplacer la relation vers une fonction pour éviter les problèmes de dépendance circulaire
export function associateModels() {
    const Race = require('./race').default;
    Animal.belongsTo(Race, { foreignKey: 'raceId' });
}

export default Animal;