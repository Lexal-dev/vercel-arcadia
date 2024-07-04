import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeInstance from '../sequelize';

interface AnimalAttributes {
    id: number;
    name: string;
    etat: string;
}

// Rendre l'attribut 'id' optionnel lors de la création
interface AnimalCreationAttributes extends Optional<AnimalAttributes, 'id'> {}

class Animal extends Model<AnimalAttributes, AnimalCreationAttributes> implements AnimalAttributes {
    public id!: number;
    public name!: string;
    public etat!: string;
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
        },
        etat: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: 'animals', // Nom de la table dans la base de données
        timestamps: false, // Désactive les timestamps automatiques
    }
);

export default Animal;