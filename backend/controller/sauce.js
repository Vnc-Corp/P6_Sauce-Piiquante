// ----------------------------------------------------------------------------------
// CONTROLLER SAUCE & LIKE ET DISLIKE
/* 
    -CRUD-
    Create: création d'une nouvelle sauce (POST)
    Read: lecture des array sauces (affiche all/one sauce - GET)
    Update: Met à jour les données modifiées (PUT)
    Delete: Suprimmer une sauce (sur autorisation/client - DELETE)
*/
// ----------------------------------------------------------------------------------
const Sauce = require('../models/Sauce'); 
const fs = require('fs'); // accès aux différentes informations du système de fichier

// ----------------------------------------------------------------------------------
// Création d'une nouvelle sauce
// ----------------------------------------------------------------------------------
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // extraire pour multer
  delete sauceObject._id;
  const sauce = new Sauce({...sauceObject,
    userId: req.auth.userId, 
    //génération url image : protole + nom d'hôte + /images/ + nom du fichier
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    // Si on ne met pas ce qui suit, impossible de récupérer les informations pour Sauce
    likes: 0,
    dislikes: 0,
    usersLiked: [''],
    usersDisliked: [''],

  });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };

// ----------------------------------------------------------------------------------
// Modification d'une sauce (client)
// ----------------------------------------------------------------------------------
  exports.modifySauce = (req, res, next) => {
    // terner pour savoir si il y a une nouvelle image
    const sauceObject = req.file ?
    {
      // si on trouve un fichier, même logique que pour create
      ...JSON.parse(req.body.sauce),                                                // récupération chaine de caractère puis <= parse en objet
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // modification image url
    } : { ...req.body};                                                           // prendre le corps de la requête pour modification en paramamètre en update
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

// ----------------------------------------------------------------------------------
// Suppression d'une sauce (avec autorisation)
// ----------------------------------------------------------------------------------
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
          if (!sauce) {
              return res.status(404).json({ message: " Sauce non trouvée" })
          };
          if (sauce.userId !== req.auth.userId) {
              return res.status(401).json({ message: "Requête non autorisée" })
          }
          // récupération non du fichier précisément 
          const filename = sauce.imageUrl.split('/images/')[1];
          // function du FileSytem pour supprimer l'image sélectionnée puis suprrimer l'objet sauce dans BDD
          fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({ _id: req.params.id })
                  .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                  .catch(error => res.status(400).json({ message: error }));
          });
      })
      .catch(error => res.status(500).json({ message: error }));
};

// ----------------------------------------------------------------------------------
// Affiche une sauce
// ----------------------------------------------------------------------------------
exports.getOneSauce = (req, res) => {
  console.info('jaffiche une sauce');
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

// ----------------------------------------------------------------------------------
// Affiche toute les sauces disponible
// ----------------------------------------------------------------------------------
exports.getAllSauce = (req, res) => {
  console.info('jaffiche les sauces');
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };


// ----------------------------------------------------------------------------------
// Intégration like et dislike / et inversement  
// ----------------------------------------------------------------------------------
exports.likeDislikeSauce = (req, res) => {
  // 1 si utilisateur aime la sauce + mise à jour array likes/usersLiked ------------
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: 1 }, //incrémentation variable
        $push: { usersLiked: req.body.userId }  // mise à jour array
      })
    .then(() => res.status(201).json({ message: "Bravo, vous aimez cette sauce ! Like +1" }))
    .catch(error => res.status(400).json({ message: error }));

  // -1 si utilisateur n'aime pas la sauce + update dislikes/usersDisliked -----------
  } else if (req.body.like === -1) {
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId }
        })
      .then(() => res.status(201).json({ message: "Cette sauce ne vous plait pas... Dislike +1" }))
      .catch(error => res.status(400).json({ message: error }));
  
  // si le choix like est déjà réalisé, enlever le like -------------------------------
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId) && req.body.like !== -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId }
            })
          .then(() => res.status(201).json({ message: "Vous n'aimez plus cette sauce ! like -1" }))
          .catch(error => res.status(400).json({ message: error }));

    // si le choix dislike est déjà réalisé, enlever le dislike -----------------------
    } else if (sauce.usersDisliked.includes(req.body.userId) && req.body.like !== -1) {
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: req.body.userId }
        })
      .then(() => res.status(201).json({ message: "Vous ne détestez plus cette sauce ! dislike -1" }))
      .catch(error => res.status(400).json({ message: error }));
    }
      })
    .catch(error => res.status(404).json({ message: error }));
  }
};