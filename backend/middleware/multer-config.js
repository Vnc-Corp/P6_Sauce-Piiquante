// facilite la gestion de fichier envoyé depuis http vers l'api
const multer = require('multer');

// dictionnaire d'extension
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// création objet de configuration (destination + nom de fichier) -------------------------------------- destination
// création de nom de fichier unique pour notre back avec fonction "enregistrement sur disque" --------- filename
const storage = multer.diskStorage({
  destination: (req, file, callback) => { // explique à multer dans quel dossier enregistrer un fichier
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype]; // fichier env du frontend
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');