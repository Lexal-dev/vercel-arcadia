const bcrypt = require('bcryptjs'); // Importez bcryptjs avec require si vous utilisez JavaScript

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

// Exemple : Hasher un mot de passe "admin"
const passwordToHash = 'admin';

hashPassword(passwordToHash)
  .then((hashedPassword) => {
    console.log('Mot de passe hashé :', hashedPassword); // Affiche le mot de passe hashé
  })
  .catch((error) => {
    console.error('Erreur lors du hachage du mot de passe :', error); // Affiche une erreur s'il y en a une
  });