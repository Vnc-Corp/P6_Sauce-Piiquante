const express = require('express');
const router = express.Router();

//controller pour associer les fonctions aux différentes routes
const userCtrl = require('../controller/user');

// routes post car le front-end va également envoyer des informations (mail/MDP)
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;