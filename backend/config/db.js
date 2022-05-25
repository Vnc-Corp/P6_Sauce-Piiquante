// //  ---------------------------------------------------------------------------------
// // importation mongoose
// //  ---------------------------------------------------------------------------------
// const mongoose = require('mongoose');
// const dotenv =  require('dotenv');//--------------------------------------------
// require('dotenv').config();
// const result = dotenv.config();

// //  ---------------------------------------------------------------------------------
// // connection mongoose 
// //  ---------------------------------------------------------------------------------

// // console.info(process.env.MONGODB_CONNECTION + " erreur mongo message");
// // mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.krnte.mongodb.net/test`,
// mongoose.connect(`mongodb+srv://fs:1234azerty@cluster0.krnte.mongodb.net/test`,
//   { useNewUrlParser: true,
//     useUnifiedTopology: true,
//  })
//   .then(() => console.log('Connexion à MongoDB réussie !'))
//   .catch((err) => console.log('Connexion à MongoDB échouée !' + err));

//   module.exports = mongoose;