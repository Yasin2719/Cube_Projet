const mongoose = require("mongoose");
const Ressource = require("./Ressources");

const UserSchema = mongoose.Schema({
    userNom: {type:String, require: true},
    userPrenom: {type:String, require: true},
    userPseudo: {type:String, require: true},
    userMail: {type:String, require: true},
    userPassword: {type:String, require: true},
    verified : Boolean,
    likes : {type: [String], require: true},
    favorites : {type: [String],require : true},
<<<<<<< HEAD
    pp:{type:String, default:"./uploads/profil/random-user.png"},
    followers: {type:[String]},
    following:{type:[String]}
=======
    pp:{type:String, default:"./uploads/profil/random-user.png" }
>>>>>>> 36496474518e440616edb7f0f74ad3d26beb95f3
    //userFavoriteRessource: {type: Array[Ressource], require: false}
    
    //userRessourceExploite: [Ressource],
    //userRessourceMisDeCote: [Ressource],
});

module.exports = mongoose.model('User', UserSchema);