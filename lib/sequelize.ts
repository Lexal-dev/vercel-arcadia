import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';

// Charger les variables d'environnement
dotenv.config();

const database = process.env.PGDATABASE;
const username = process.env.PGUSER;
const password = process.env.PGPASSWORD;
const host = process.env.PGHOST;
const port = Number(process.env.PGPORT) || 5432;

if (!database || !username || !password || !host) {
    throw new Error('Missing required environment variables for database connection');
}

const sequelizeInstance = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Utilisé pour contourner les erreurs d'authentification SSL
        }
    }
});

// Tester la connexion
sequelizeInstance.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

export default sequelizeInstance;