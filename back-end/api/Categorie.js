const express = require('express');
require ("dotenv").config();
const router = express.Router();
const Categorie = require('./../models/Categories');

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

router.post('/NewCategorie', (req, res) =>{
    let {CategorieLibelle} = req.body;
    CategorieLibelle = CategorieLibelle.trim();

    if(CategorieLibelle == ""){
        res.json({
            status: "FAILED",
            message: "Valeur nulle détécté"
        });
    } else if(!/^[a-zA-Z]*$/.test(CategorieLibelle)){
        res.json({
            status: "FAILED",
            message: "Syntaxe invalide"
        })
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

router.post('/deleteCategorie/:CategorieId', (req, res) =>{
    let {CategorieId} = req.body;

    Categorie.find({_id: CategorieId})
    .then((data)=>{
        if(data.length>0){
            Categorie.deleteOne({_id: CategorieId})
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
            res.json({
                status: "FAILED",
                message: "Erreur lors de la recherche de la categorie"
            })
        }
    })
    .catch((error)=>{
        res.json({
            status: "FAILED",
            message: "Categorie inexistante"
        })
    })
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