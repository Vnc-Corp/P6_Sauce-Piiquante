const express =require('express');
const router  = express.Router();

const sauceCtrl = require('../controller/sauce'); // importation controller sauce
const auth = require('../middleware/auth'); // authentification gestion JWT
const multer = require('../middleware/multer-config'); // importation gestion de fichier image

// fichier de "routing"
// nregistre dans la base
router.post('/', auth, multer, sauceCtrl.createSauce);
// modification
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// suppression
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// one sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
// lecture all base (sauces)
router.get('/', auth, sauceCtrl.getAllSauce);

router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);

module.exports = router;