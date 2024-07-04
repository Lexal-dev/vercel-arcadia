import { DataTypes, Model } from 'sequelize';
import sequelizeInstance from '@/lib/sequelize';
import User from './user'; // Importer le modèle User
import Animal from './animal'; // Importer le modèle Animal

interface ReportAttributes {
    id: number;
    details: string;
    userId: number;
    animalId: number;
}

class Report extends Model<ReportAttributes> implements ReportAttributes {
    public id!: number;
    public details!: string;
    public userId!: number;
    public animalId!: number;
}

Report.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        details: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 500],
                    msg: 'Les détails du rapport doivent contenir entre 3 et 500 caractères.',
                },
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Nom de la table users
                key: 'id',
            },
        },
        animalId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'animals', // Nom de la table animals
                key: 'id',
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: 'reports',
        timestamps: false,
    }
);

// Définir les relations
Report.belongsTo(User, { foreignKey: 'userId' });
Report.belongsTo(Animal, { foreignKey: 'animalId' });

export default Report;