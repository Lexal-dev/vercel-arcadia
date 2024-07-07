import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeInstance from '@/lib/sequelize';
import Animal from './animal'; // Importer le modèle Animal

interface ReportAttributes {
    id: number;
    food: string;
    quantity: number;
    createdAt: Date;
    animalId: number;
}


interface ReportCreationAttributes extends Optional<ReportAttributes, 'id'> {}

class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
    public id!: number;
    public food!: string;
    public quantity!: number;
    public createdAt!: Date;
    public animalId!: number;
}

Report.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        food: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Le champ food ne peut pas être vide.',
                },
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Le champ quantity doit être un entier.',
                },
                min: {
                    args: [1],
                    msg: 'Le champ quantity doit être supérieur à zéro.',
                },
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
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
        timestamps: false, // Désactiver les timestamps automatiques
    }
);

// Définir les relations
Report.belongsTo(Animal, { foreignKey: 'animalId' });

export default Report;