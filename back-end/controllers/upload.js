// yasin

const UserModel = require('../models/Users');
const fs = require('fs');
const {promisify} = require('util');
const { uploadErros } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);



module.exports.uploadProfil = async (req, res) => {

    try {
        if (req.file.detectedMimeType !== "image/jpg" && req.file.detectedMimeType !== "image/png" && req.file.detectedMimeType !== "image/jpeg")
            throw Error("invalid file")

        if (req.file.size > 500000) throw Error("max size")
    }
    catch(err){
        const errors = uploadErros(err);
        return res.status(201).send({ errors });
    }

    console.log(req.body.userId);
    const fileName = req.body.userId + ".jpg";

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../../../front-end-cube/public/uploads/profil/${fileName}`
        )
    );

    try
    {
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            { $set : {pp: "/uploads/profil/" + fileName} },
            {new: true, upsert: true, setDefaultsOnInsert: true}
            // (err, docs) => {
                // if (!err){
                //     return res.json({
                //         status: 200,
                //         data: docs
                //     });
                // } 
                // else return res.status(500).send({ message: err });
            //}
        )
        .then(result =>{
            res.json({
                status: 200,
                data: result
            })
        })
        .catch((err) =>{
            res.json({
                status: 500,
                data: err
            })
        })
    }
    catch(err){
        return res.status(500).send({ message: err});
    }
}

