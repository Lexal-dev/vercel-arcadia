import sequelizeInstance from '@/lib/sequelize';

const initDb = async () => {
    try {
        await sequelizeInstance.authenticate();
        console.log('Connexion à la base de données PostgreSQL établie avec succès.');
        // Ajoutez ici d'autres initialisations si nécessaire, comme la synchronisation des modèles.
    } catch (error) {
        console.error('Erreur de connexion à la base de données :', error);
        throw error; // ou gérer l'erreur de manière appropriée
    }
};

export default initDb;