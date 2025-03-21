const fs = require('fs');
const path = require('path');

/**
 * Fonction pour lire et parser un fichier JSON
 * @param {string} filename - Nom du fichier JSON
 * @returns {Object|null} - Données parsées ou null en cas d'erreur
 */
const readJsonFile = (filename) => {
  try {
    const filePath = path.join(__dirname, './data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filename}:`, error);
    return null;
  }
};

module.exports = {
  readJsonFile
};