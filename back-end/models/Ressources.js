const mongoose = require("mongoose");
const Categories = require("./Categories");

const RessourceSchema = new mongoose.Schema({

    posterId: { type: String, required: true },
    posterNom: { type: String, required: true},
    posterPrenom: { type: String, required: true },
    posterPseudo: { type: String, required: true },
    // ressourceTitle: { type: String, require: true },
    ressourceStatut: { type: String, require: true }, //public privé ou partagé
    //ressourceType: {type:String, require: true}, //video photo texte
    //ressourceContenu: {type:{}, require: true},
    // bio: {type:String, required:true},
    message: { type: String, trim: true, maxlength: 500 },
    photo: { type: String },
    video: { type: String },
    link: { type: String },
    likers: { type: [String], required: true },
    comments: {
        type: [
            {
                commenterId: String,
                commenterPseudo: String,
                text: String,
                timestamp: Number,
            }
        ],
        required: true,
    },
    ressourceIsValid: { type: Boolean }, // si valider par le moderateur
    //RessourceCategorie: {Categories, require: true},
    //RessourceCreateur: mongoose.Schema.Types.ObjectId,
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Ressource', RessourceSchema);