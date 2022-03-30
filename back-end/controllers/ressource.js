const { json } = require('express/lib/response')
const RessourceModel = require('../models/Ressources')
const UserModel = require('../models/Users')
const ObjectID = require('mongoose').Types.ObjectId

module.exports.readRessource = (req, res) => {
    RessourceModel.find((err, docs) => {
        if (!err) res.send(docs)
        else console.log('Erreur d\'envoi des data' + err);
    })
    .sort({createdAt:-1})//classer dans l'ordre le plus recent de la ressource

}

module.exports.createRessource = async (req, res) => {

    const newRessource = new RessourceModel({
        posterId: req.body.posterId,
        ressourceStatut: req.body.ressourceStatut,
        message: req.body.message,
        video: req.body.video,
        likers: [],
        comments: [],
        ressourceIsValid: true,//false par defaut des lors du backoffice

    })
    try {
        const ress = await newRessource.save();
        return res.status(201).json(ress)
    }
    catch (err) {
        res.status(400).send(err)
    }
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
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('id ressource inconnu : ' + req.params.id)
    if (!ObjectID.isValid(req.body.id))
        return res.status(400).send('id user inconnu : ' + req.body.id)

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
            .then((err, docs) => {
                if (err) return res.status(400).send(err)
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
            .then((err, docs) => {
                if (!err) res.send(docs)
                else return res.status(400).send(err)
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
                .then((err, docs) => {
                    if (err) return res.status(400).send(err)
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
                .then((err, docs) => {
                    if (!err) res.send(docs)
                    else return res.status(400).send(err)
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