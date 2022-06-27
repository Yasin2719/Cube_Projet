const express = require('express');
require ("dotenv").config();
const router = express.Router();
const Categorie = require('./../models/Categories');
const Ressource = require('./../models/Ressources')
const ObjectID = require('mongoose').Types.ObjectId

router.get('/allCAtegorie', (req, res)=>{
    Categorie.find({})
    .then(result => {
        res.json({
            status: "SUCCES",
            message: "Succes",
            data: result
        })
    })
    .catch((err)=>{
        res.json({
            status: "FAILED",
            message: "Erreur lors de la recherche de toutes les categories",
            data: result
        })
    })
})


router.get('/getLibelleCategorie&:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('id inconnu : ' + req.params.id)

    Categorie.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('id unknow : ' + err)
    })
})




router.post('/NewCategorie', (req, res) =>{
    let {CategorieLibelle} = req.body;
    CategorieLibelle = CategorieLibelle.trim();

    if(CategorieLibelle == ""){
        res.json({
            status: "FAILED",
            message: "Valeur nulle détécté"
        });
    // } else if(!/^[" "-a-zA-Z]*$/.test(CategorieLibelle)){
    //     res.json({
    //         status: "FAILED",
    //         message: "Syntaxe invalide"
    //     })
    } else{
        Categorie.find({CategorieLibelle}).then(result =>{
            if(result.length){
                res.json({
                    status: "FAILED",
                    message: "CAtegorie existe Déjà"
                })
            }
            else{
                const NewCategorie = new Categorie({CategorieLibelle});
        
                NewCategorie.save().then(result =>{
                    res.json({
                        status: "SUCCES",
                        message: "Categorie créer avec succes"
                    })
                })
                .catch(error =>{
                    res.json({
                        status: "FAILED",
                        message: "Erreur lors de la création de la catégorie"
                    })
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Une erreur s'est produite"
            })
        })
 
    }
});

router.delete('/deleteCategorie&:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('id inconnu : ' + req.params.id)
    try {
        Categorie.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "sucessfull delete" })

    } catch (err) {

        return res.status(500).json({ message: err })

    }
    Ressource.updateMany(


        {RessourceCategorieId: req.params.id},
        {
            $set: {
                RessourceCategorieId: "62b87be63d6e54f95c06a578",

            }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) => {
            if (!err) {
                //console.log(docs);
                // return res.status(200).send({data: docs})

            }
            if (err) return console.log(err);
            // res.status(500).send({ message: err })
        }

    )
})

router.post('/deleteCategorie/:CategorieId', (req, res) =>{
    let {CategorieId} = req.body;

    Categorie.find({id: CategorieId})
    .then((data)=>{
        if(data.length>0){
            Categorie.deleteOne({id: CategorieId})
            .then((result) =>{
                res.json({
                    status: "SUCCES",
                    message: "Categorie suprimé avec succes",
                    data: data
                })
            })
            .catch((error)=>{
                console.log(error);
                res.json({
                    status: "FAILED",
                    message: "Erreur lors de la supression de la categorie"
                })
            })
        }else{
            console.log(_id);
            res.json({
                status: "FAILED",
                message: "Erreur lors de la recherche de la categorie"
            })
        }
    })
    .catch((error)=>{
        console.log("categorie inexistante");
        console.log(error);
        
        res.json({
            status: "FAILED",
            message: "Categorie inexistante"
        })
    })

    Ressource.findOneAndUpdate(


        {RessourceCategorieId: CategorieId},
        {
            $set: {
                RessourceCategorieId: "62b871d0418a2350ece3feb8",

            }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) => {
            if (!err) {
                //console.log(docs);
                // return res.status(200).send({data: docs})

            }
            if (err) return console.log(err);
            // res.status(500).send({ message: err })
        }

    )
});

router.post('/updateCategorie/:CategorieId', (req, res)=>{
    let {CategorieId, newCategorieName} = req.body;

    Categorie.find({_id: CategorieId})
    .then(data=>{
        if(data.length>0){
            Categorie.updateOne({_id: CategorieId}, {CategorieLibelle: newCategorieName})
            .then((data)=>{
                res.json({
                    status: "SUCCES",
                    message: "Succes lors de la modification de la categorie",
                    data: data
                })

            })
            .catch((error)=>{
                res.json({
                    status: "FAILED",
                    message: "Erreur lors de la modification de la categorie"
                })
            })
        }else{
            res.json({
                status: "FAILED",
                message: "Erreur lors de la recherche de la categorie"
            })
        }
    })
    .catch((error)=>{
        res.json({
            status: "FAILED",
            message: "Categorie Inexistante"
        })
    })
})

module.exports = router;