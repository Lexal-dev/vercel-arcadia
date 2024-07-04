import { DataTypes, Model } from 'sequelize';
import sequelizeInstance from '@/lib/sequelize';
import Role from './role'; // Importer le modèle Role

interface UserAttributes {
    id: number;
    email: string;
    password: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
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
    },
    {
        sequelize: sequelizeInstance,
        tableName: 'users',
        timestamps: false,
    }
);

// Définir la relation
User.belongsToMany(Role, {
    through: 'UserRole', // Nom de la table de liaison
    foreignKey: 'userId',
    otherKey: 'roleId',
});

export default User;