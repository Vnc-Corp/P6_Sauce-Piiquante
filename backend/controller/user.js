const bcrypt = require('bcrypt'); //hachâge mdp

//ajout json web token pour authentification user sur site (anciennement cookie de session sur serveur)
const jwt = require('jsonwebtoken');

// const { json } = require('stream/consumers'); apparu soudain sur cette page ? D'où ça vient ???
const User = require('../models/User'); //récupération model usuer

// validateur d'email/password
const emailValidator = require("email-validator");
const passwordValidator = require('../middleware/passwordValidator');

//  ---------------------------------------------------------------------------------
//  Hachâge du MDP (fc async, puis enregistrer le user dans la BDD)
//  ---------------------------------------------------------------------------------
/* 
    Info:   Va crypter le mot de passe et récupérer l'email et mdp'hash'
            Puis va enregistrer le nouvel utilisateur dans la BDD avec ses informations.
*/
//  ---------------------------------------------------------------------------------
//  Signup
//  ---------------------------------------------------------------------------------
exports.signup = (req, res, next) => {
    // test log/info -----------------
    console.info('signup');
    console.log(req.body);
    // -------------------------------
    // vérification de la pertinence des mots de passe suivant un schema prédéfini + vérification email
    if (!emailValidator.validate(req.body.email) || !passwordValidator.validate(req.body.password)) {
        console.info('je suis dans le if, email et mdp a revoir');
        return res.status(400).json({ message: "Email or Password must be verified" + req.body.email});
    
    } else if (emailValidator.validate(req.body.email) || passwordValidator.validate(req.body.password)) {
        // lancement du hachâge du MDP
        bcrypt.hash(req.body.password, 10)
            // récupération du hash mdp/email
            .then(hash => {
                
                // console.info('hash me', req.body);
                // nouveau utilisateur avec le model mongoose
                const user = new User({ 
                    email: req.body.email, // récupération de l'email fournie dans le corps de la requête
                    password: hash, // transmission du MDP version 'hash'
                });
                // console.log('jai passé const user');
                // pour enregistrer un nouvel utilisateur dans la BDD
                user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // code 201 = création de ressource

                .catch(error => res.status(400).json({ error })); // code 400 pour différencier avec le catch 'hash (500)' 
                // console.log(error + 'erreur daccès'); l'erreur vient de ces log's ! ! ! ! 
            })
            .catch(error => res.status(500).json({ error: 'message erreur de then hash' })); // code 500 = erreur serveur
            // console.log(error + 'erreur serveur');
    }
};

//  ---------------------------------------------------------------------------------
//  Vérification login
//  ---------------------------------------------------------------------------------
/* 
    Info:
*/
//  ---------------------------------------------------------------------------------
exports.login = (req, res) => {
    
    // cherche un seul utilisateur dans la BDD
    User.findOne({ email: req.body.email}) // objet de comparaison email = email envoyé dans la requpete

        // vérification si récupération user ok
        .then(user => {
            if (!user) {
                return res.status(401).json({ error : 'Utilisateur non trouvé !'}) // 401 = non authorisé
            }

            // lancement méthode compare pour vérifier le mdp user et celui présent dans la BDD si User trouvé
            bcrypt.compare(req.body.password, user.password)
                // la promess recoit un booléann pour savoir si le mdp est valide ou non
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error : 'Mot de passe incorrecte !'})
                    }
                    // si trouvé renvois status + token de connection (une chaine pour l'instant, à changer)
                    res.status(200).json({
                        userId: user._id,
                        //appel de la fonction sign avec trois arguments 
                            //  -   donnée à encoder dit 'payload'
                            //  -   clé secrète pour l'encodage
                            //  -   argument de configuration (ici, une expiration pour le token)
                        token: jwt.sign(
                            { userId : user._id }, // encode de l'id de l'utilisateur
                            (process.env.RANDOM_TOKEN_SECRET), // clé plus longue et aléatoire à mettre ici /!\
                            { expiresIn: '24h'} // argument de configuration
                        )
                    });
                    // log de contrôle ------------------------------
                    // console.info(process.env.RANDOM_TOKEN_SECRET);
                    // console.info(jwt);
                    // ----------------------------------------------
                })
                .catch(error => res.status(500).json({ error })); // problème de connection
        })
        .catch(error => res.status(500).json({ error})); // problème de connection
};