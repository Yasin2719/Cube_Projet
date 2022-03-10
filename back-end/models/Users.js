const mongoose = require("mongoose");
const Ressource = require("./Ressources");

const UserSchema = mongoose.Schema({
    userNom: {type:String, require: true},
    userPrenom: {type:String, require: true},
    userPseudo: {type:String, require: true},
    userMail: {type:String, require: true},
    userPassword: {type:String, require: true},
    verified : Boolean
    //userFavoriteRessource: {type: Array[Ressource], require: false}
    
    //userRessourceExploite: [Ressource],
    //userRessourceMisDeCote: [Ressource],
});

module.exports = mongoose.model('User', UserSchema);