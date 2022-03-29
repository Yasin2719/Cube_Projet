const RessourceModel = require('../models/Ressources')
const UserModel = require('../models/Users')
const ObjectID = require('mongoose').Types.ObjectId

module.exports.readRessource = (req, res)=>{
    RessourceModel.find((err,docs)=>{
        if (!err) res.send(docs)
        else console.log('Erreur d\'envoi des data' + err);
    })

}

module.exports.createRessource = async (req, res)=>{

    const newRessource = new RessourceModel({
        posterId: req.body.posterId,
        ressourceStatut: req.body.ressourceStatut,
        message: req.body.message,
        video: req.body.video,
        likers : [],
        comments:[],
        ressourceIsValid: true,//false par defaut des lors du backoffice

    })
    try{
        const ress = await newRessource.save();
        return res.status(201).json(ress)
    }
    catch(err){
        res.status(400).send(err)
    }
}

module.exports.updateRessource = (req, res)=>{
    
}

module.exports.deleteRessource = (req, res)=>{
    
}