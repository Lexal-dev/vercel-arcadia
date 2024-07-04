import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeInstance from '@/lib/sequelize';

interface HabitatAttributes {
    id: number;
    name: string;
    description: string;
    comment: string;
}

interface HabitatCreationAttributes extends Optional<HabitatAttributes, 'id'> {}

class Habitat extends Model<HabitatAttributes, HabitatCreationAttributes> implements HabitatAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public comment!: string;
}

Habitat.init(
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
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 200],
                    msg: "La description doit être comprise entre 3 et 200 caractères",
                },
            },
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [3, 100],
                    msg: "La description doit être comprise entre 3 et 100 caractères",
                },
            },
        },
        
    },
    {
        sequelize: sequelizeInstance,
        tableName: 'habitats',
        timestamps: false,
    }
);

export default Habitat;