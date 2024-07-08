import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeInstance from '@/lib/sequelize';

export interface HabitatAttributes {
    id: number;
    name: string;
    description: string;
    comment: string;
    imageUrl?: string[] | null; // Définir comme un tableau de chaînes de caractères ou null
}

interface HabitatCreationAttributes extends Optional<HabitatAttributes, 'id'> {
    imageUrl?: string[] | null; // Ajuster la définition pour accepter null
}

class Habitat extends Model<HabitatAttributes, HabitatCreationAttributes> implements HabitatAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public comment!: string;
    public imageUrl!: string[] | null; 
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
                    msg: "Le commentaire doit être compris entre 3 et 100 caractères",
                },
            },
        },
        imageUrl: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: 'habitats',
        timestamps: false,
    }
);

export default Habitat;