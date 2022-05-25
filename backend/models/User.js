const mongoose = require('mongoose');

// permet de palier certaine erreur de mongo et de certifier un utilisateur unique/mail
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    
    // Model de connection utilisateur
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
});

// application de validator avant d'en faire un model
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);






// userSchema ok, ne pas toucher /!\