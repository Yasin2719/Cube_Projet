const mongoose = require("mongoose");
const Categories = require("./Categories");

const RessourceSchema = mongoose.Schema({
    RessourceLibelle: {type:String, require: true},
    RessourceStatut: {type:String, require: true},
    RessourceType: {type:String, require: true},
    RessourceContenu: {type:String, require: true},
    RessourceCommentaires: [mongoose.Schema.Types.ObjectId,String],
    RessourceIsValid: {type:Boolean},
    //RessourceCategorie: Categories,
    //RessourceCreateur: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Ressource', RessourceSchema);