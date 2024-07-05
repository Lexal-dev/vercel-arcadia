import { DataTypes, Model } from 'sequelize';
import sequelizeInstance from '@/lib/sequelize';

interface UserAttributes {
    id: number;
    email: string;
    password: string;
    role: string; // Ajoutez la propriété role ici
}

class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public role!: string; // Déclarez la propriété role ici
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'USER', // Valeur par défaut
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: 'users',
        timestamps: false,
    }
);

export default User;