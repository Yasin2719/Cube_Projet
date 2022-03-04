const mongoose = require("mongoose");

const CategorieScheam = mongoose.Schema({
    CategorieLibelle: {type:String, require: true},
});

module.exports = mongoose.model('Categorie', CategorieScheam);