
//  ---------------------------------------------------------------------------------
//  Permet l'interaction avec la BDD MongoDB
//  ---------------------------------------------------------------------------------
const mongoose = require('mongoose');

//  ---------------------------------------------------------------------------------
// Model Sauce
/*
    Info:   Création des schéma de données qui contient les champs souhaités pour 
            chaque sauce (type et caractère obligatoire ou non).
            Ajout caractère 'unique' pour Email
*/
//  ---------------------------------------------------------------------------------

const sauceSchema = mongoose.Schema({
    
    // Informations Sauce
    userId: { type: String, required: true},
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},

    // Informations 
    likes: { type: Number, required: true},
    dislikes: { type: Number, required: true},
    usersLiked: { type: [String], required: true},
    usersDisliked: { type: [String], required: true},

});

//  ---------------------------------------------------------------------------------
//  Exportation avec fichier et argument schema (devient un model utilisable)
//  ---------------------------------------------------------------------------------
module.exports = mongoose.model('Sauce', sauceSchema);