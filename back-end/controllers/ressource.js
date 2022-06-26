const { json } = require('express/lib/response')
const RessourceModel = require('../models/Ressources')
const UserModel = require('../models/Users')
const ObjectID = require('mongoose').Types.ObjectId
const { uploadErros } = require('../utils/errors.utils')
const fs = require ('fs')
const {promisify} = require ('util')
const pipeline = promisify(require ('stream').pipeline)

module.exports.readRessource = (req, res) => {
    RessourceModel.find((err, docs) => {
        UserModel.find({_id :req.body.posterId})
        .then((data)=>{
            res.json({
                status: 200,
                data: docs,
            })
        })
        .catch((err)=>{
            res.json({
                status: 400,
                message: "erreur de récuperation des data"
            });
            console.log('Erreur d\'envoi des data' + err);
        })
    })
    .sort({createdAt:-1})//classer dans l'ordre le plus recent de la ressource
}

module.exports.readRessourceById = (req, res) => {
    if (!ObjectID.isValid(req.params.id)){
        return res.status(400).send('id ressource inconnu : ' + req.params.id)
    }
    RessourceModel.findById((req.params.id))
    .then((data)=>{
        res.json({
            status: 200,
            data: data,
        })
    })
    .catch((err)=>{
        res.json({
            status: 400,
            message: "erreur de récuperation de la ressource"
        });
        console.log('Erreur d\'envoi des data' + err);
    })
}

module.exports.ressourceByUserId = (req, res) => {
    if (!ObjectID.isValid(req.params.id)){
        return res.status(400).send('id user inconnu : ' + req.params.id)
    }
    RessourceModel.find({posterId: req.params.id},(err, docs) => {
        UserModel.findById((req.params.id))
        .then((data)=>{
            res.json({
                status: 200,
                data: docs,
            })
        })
        .catch((err)=>{
            res.json({
                status: 400,
                message: "erreur de récuperation des data"
            });
            console.log('Erreur d\'envoi des data' + err);
        })
    })
    .sort({createdAt:-1})//classer dans l'ordre le plus recent de la ressource
}

module.exports.createRessource = (req, res) => {

    let fileName;
   

    if(req.file !== null){
         console.log(req.file);
        try {
            if (req.file.detectedMimeType !== "image/jpg" && req.file.detectedMimeType !== "image/png" && req.file.detectedMimeType !== "image/jpeg")
                throw Error("invalid file")
    
            if (req.file.size > 500000) throw Error("max size")
        }
        catch(err){
            const errors = uploadErros(err);
            console.log(errors);
            return res.status(201).send({ errors });
            
        }
    
        fileName = req.body.posterId + Date.now() + '.jpg'

         pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../../../front-end-cube/public/uploads/ressources/${fileName}`
            )
        );
    }

    UserModel.find({_id :req.body.posterId})
    .then(result  =>{
        if (result.length>0){

            let nom = result[0].userNom;
            let prenom = result[0].userPrenom;
            let pseudo = result[0].userPseudo;

             //let image = req.file.filename ?  "http://localhost:3005/images/" + req.file.filename : 'http://localhost:3005/images/avatar.png'   ;
            const newRessource = new RessourceModel({
                posterId: req.body.posterId,
                posterNom: nom,
                posterPrenom: prenom,
                posterPseudo: pseudo,
                ressourceStatut: req.body.ressourceStatut,
                message: req.body.message,
                photo: req.file !== null ? "/public/uploads/ressources/" + fileName : "",
                video: req.body.video,
                link: req.body.link,
                likers: [],
                comments: [],
                ressourceIsValid: true,//false par defaut des lors du backoffice
                RessourceCategorieId : req.body.RessourceCategorieId,
                ressourceTypeRelation : req.body.ressourceTypeRelation
        
            })

            try {
                const ress =  newRessource.save();
                res.json({
                    status: 200,
                    data: newRessource
                })
                // return res.status(200).json(ress)
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err)
            }
            
            // console.log(result);

        }
        else{
            console.log("error");
        }
    })
    .catch((err)=>{
        console.log("catch");
    })


   
}

module.exports.updateRessource = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('id inconnu : ' + req.params.id)

    const updatedRecord = {
        message: req.body.message
    }

    RessourceModel.findByIdAndUpdate(
        req.params.id,
        {
            $set: updatedRecord
        },
        {
            new: true
        },
        (err, docs) => {
            if (!err) res.send(docs)
            else console.log("update error " + err);
        }
    )


}

module.exports.deleteRessource = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('id inconnu : ' + req.params.id)

    RessourceModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if (!err) res.send(docs)
            else console.log("delete error : " + err);
        }
    )

}

module.exports.likeRessource = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('id ressource inconnu : ' + req.params.id)
    }
    if (!ObjectID.isValid(req.body.id)){
        return res.status(400).send('id user inconnu : ' + req.body.id)
    } 
    try {
        await RessourceModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id }
            },
            {
                new: true
            },

        )
            .then((docs) => {
                res.json({
                    status: 400,
                    message: "Ressource likées",
                    data: docs
                })
            })
            .catch((err) =>{
                res.json({
                    status: 400,
                    data: err
                })
            })



        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { likes: req.params.id }
            },
            {
                new: true
            },

        )
            .then((docs) => {
                res.json({
                    status: 400,
                    message: "Ressource likées",
                    data: docs
                })
            })
            .catch((err) =>{
                res.json({
                    status: 400,
                    data: err
                })
            })





    }
    catch (err) {
        return res.status(400)//.send(err)

    }


}

module.exports.unlikeRessource = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('id inconnu : ' + req.params.id)

        try {
            await RessourceModel.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: { likers: req.body.id }
                },
                {
                    new: true
                },
    
            )
            .then((docs) => {
                res.json({
                    status: 400,
                    message: "Ressource dislikées",
                    data: docs
                })
            })
            .catch((err) =>{
                res.json({
                    status: 400,
                    data: err
                })
            })

            await UserModel.findByIdAndUpdate(
                req.body.id,
                {
                    $pull: { likes: req.params.id }
                },
                {
                    new: true
                },
    
            )
            .then((docs) => {
                res.json({
                    status: 400,
                    message: "Ressource likées",
                    data: docs
                })
            })
            .catch((err) =>{
                res.json({
                    status: 400,
                    data: err
                })
            })

        }
        catch (err) {
            return res.status(400)//.send(err)
    
        }


}

module.exports.commentRessource = (req, res)=>{
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('id inconnu : ' + req.params.id)

    try{
        return RessourceModel.findByIdAndUpdate(
            req.params.id, 
            {
                $push : {
                    comments : {
                        commenterId : req.body.commenterId,
                        commenterPseudo : req.body.commenterPseudo,
                        text : req.body.text,
                        timestamp : new Date().getTime()

                    }
                }
            },
            {
                new:true
            },
            (err, docs)=>{
                if (!err) return res.send(docs)
                else return res.status(400).send(err)
            }
        )

    }
    catch(err){
        return res.status(400).send(err)
    }
}   

module.exports.deleteCommentRessource = (req, res)=>{
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('id inconnu : ' + req.params.id)

    try{
        return RessourceModel.findByIdAndUpdate(
            req.params.id, 
            {
                $pull : {
                    comments : {
                        _id: req.body.commentId
                    }
                }
            }, 
            {
                new : true
            }, 
            (err, docs)=>{
                if (!err) return res.send(docs)
                else return res.status(400).send(err)
            }
        )
    }
    catch ( err){
        return res.status(400).send(err)
    }

    
}