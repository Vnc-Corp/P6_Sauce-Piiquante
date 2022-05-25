// module.exports = passwordValidatorSchema;
const passwordValidator = require('password-validator');

// création d'un password plus compliqué (entre 5 et 100 pour exemple)
const passwordValidatorSchema = new passwordValidator()

passwordValidatorSchema
    .is().min(5)                                                                // Longueur minimum
    .is().max(100)                                                               // longueur maximum 
    .has().uppercase(1)                                                         // Doit avoir une lettre majuscule
    .has().lowercase()                                                          // Doit avoir au moins une minuscule
    .has().digits(2)                                                            // Doit avoir au moins 2 chiffre
    .has().not().spaces()                                                       // Ne doit pas avoir d'espace
    .is().not().oneOf(['Passw0rd', 'Password123', 'Azerty123', '123Azerty']);   // MDP > Blacklist

module.exports = passwordValidatorSchema;