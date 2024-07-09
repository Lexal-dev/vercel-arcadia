import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeInstance from '@/lib/sequelize';
import Race from './race';
import Habitat from './habitat';

interface AnimalAttributes {
    id: number;
    name: string;
    etat: string;
    raceId: number;
    habitatId: number;
    imageUrl?: string[] | null; 
}

interface AnimalCreationAttributes extends Optional<AnimalAttributes, 'id'> {
    imageUrl?: string[] | null; 
}

class Animal extends Model<AnimalAttributes, AnimalCreationAttributes> implements AnimalAttributes {
    public id!: number;
    public name!: string;
    public etat!: string;
    public raceId!: number;
    public habitatId!: number;
    public imageUrl!: string[] | null; 
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
                    msg: "Le nom doit être compris entre 3 et 30 caractères",
                },
            },
        },
        etat: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 100],
                    msg: "Le message d'état doit être compris entre 3 et 100 caractères",
                },
            },
        },
        raceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'races',
                key: 'id',
            },
        },
        habitatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'habitats', 
                key: 'id',
            },
        },
        imageUrl: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: 'animals',
        timestamps: false,
    }
);

// Fonction d'association des modèles
export function associateModels() {
    // Associations
    Animal.belongsTo(Race, { foreignKey: 'raceId' });
    Animal.belongsTo(Habitat, { foreignKey: 'habitatId' });
}

export default Animal;