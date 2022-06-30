const mongoose = require("mongoose");
const Ressource = require("./Ressources");

const UserSchema = mongoose.Schema({
    userNom: {type:String, require: true},
    userPrenom: {type:String, require: true},
    userPseudo: {type:String, require: true},
    userMail: {type:String, require: true},
    userPassword: {type:String, require: true},
    verified : Boolean,
    statut : {type:String, require :true}, // 1 utilisateur lambda, 2 modo, 3 admin, 4 super admin
    likes : {type: [String], require: true},
    favorites : {type: [String],require : true},
    pp:{type:String, default:"/uploads/profil/random-user.png"},
    followers: {type:[String]},
    following:{type:[String]}
    //userFavoriteRessource: {type: Array[Ressource], require: false}
    
    //userRessourceExploite: [Ressource],
    //userRessourceMisDeCote: [Ressource],
});

module.exports = mongoose.model('User', UserSchema);