//  ---------------------------------------------------------------------------------
/*
    Application EXPRESS
*/
//  ---------------------------------------------------------------------------------
const express = require('express');

//  ---------------------------------------------------------------------------------
// HELMET - protection OWASP (n°3) contre certaines vulnérabilités avec configuration des en-têtes HTTP
// CORS - protection anti cross-origin connection
// RATE-LIMIT - protection contre les attaques de type 'requête' (limitation de débit)
//  ---------------------------------------------------------------------------------
const helmet = require('helmet'); 
const cors = require('cors'); 
const rateLimit = require('express-rate-limit');

//  ---------------------------------------------------------------------------------
// Routes (sauce et users)
//  ---------------------------------------------------------------------------------
const sauceRoutes = require('./routes/sauce'); 
const userRoutes = require('./routes/user'); 

//  ---------------------------------------------------------------------------------
const path = require('path'); // chemin pour image multer
const app = express(); // application express

//  ---------------------------------------------------------------------------------
// Mongoose
// Dotenv (pour les variables d'environnement)
// Assénétiser mongo DB (anti injection x)
//  ---------------------------------------------------------------------------------
const mongoose = require('mongoose');
const dotenv =  require('dotenv');//--------------------------------------------
require('dotenv').config();
const mogodbSanitize = require('mongodb-sanitize');
const mongodbSanitize = require('mongodb-sanitize');

//  ---------------------------------------------------------------------------------
// connection mongoose (+var env.)
//  ---------------------------------------------------------------------------------
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.krnte.mongodb.net`,
  { useNewUrlParser: true,
    useUnifiedTopology: true,
 })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !' + err));

//  ---------------------------------------------------------------------------------
//  CORS - Protection OWASP (N°2) anti cross-origin connection 
//  ---------------------------------------------------------------------------------
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // accès depuis x origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//  ---------------------------------------------------------------------------------
//  Rate limit - Limitation d'instance / IP (15min/20 req + msg)
//  ---------------------------------------------------------------------------------
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes par fenêtre de connection
  max: 150, // Limite les requêtes à (150) pour maximum 15 minutes par fenêtre de connection
  message: `ATTENTION ! Trop de tentatives de connexion depuis cette adresse IP !`
}));

//  ---------------------------------------------------------------------------------
//  Application 
//  ---------------------------------------------------------------------------------
app.use(express.json()); // equivalent ancien body.parser et permet utilisation(analyse) req.body
app.use(helmet({crossOriginResourcePolicy: false,}));//  protection en-tête et autorisation chargement des images sauces
app.use(cors());
app.use(mongodbSanitize());  // package nettoyant (req.body, req.params, req.query)

// gestion pour multer, on passe à static 'nom du dossier' (dirname) puis vers l'image
app.use('/images', express.static(path.join(__dirname, 'images')));

//-------------------------------------------------------------------------------------------------------------------------------
// anciennement crud route ici (maintenant dans fichier routes/controller)
app.use('/api/sauces', sauceRoutes); // initialise le début des routes + route du CRUD
app.use('/api/auth', userRoutes);
//-------------------------------------------------------------------------------------------------------------------------------


module.exports = app;




//  ---------------------------------------------------------------------------------
// // test first middleware pour vérification accès postman
//  ---------------------------------------------------------------------------------
// méthode : utilise cette fonction pour toute requête 
// Envoie réponse JSON et execution
// app.use((req, res, next) => {
//     res.json({ message: 'Votre requête a bien été reçue !'});
//     next();
// });
// //dernière requête Mware, pas besoin de next
// app.use((req, res, next) => {
//     console.log("La réponse a été envoyé avec succès !");
//     next();
// });
//  ---------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------