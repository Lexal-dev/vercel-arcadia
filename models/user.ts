import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/sequelize'; // Assurez-vous que votre configuration de base de données est correctement importée

interface UserAttributes {
  id?: number; // Rendre id optionnel
  email: string;
  password: string;
  role: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: string;

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
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);

export default User;