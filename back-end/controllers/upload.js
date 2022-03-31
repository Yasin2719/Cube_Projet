//const User = require ('../models/users')
const fs = require ('fs')
const {promisify} = require ('util')
const { uploadErros } = require('../utils/errors.utils')
const pipeline = promisify(require ('stream').pipeline)

module.exports.uploadProfil = async (req, res)=>{
    console.log(req);
    console.log('salut');

    try{
        if (req.file.detectedMimeType !== "image/jpg" && req.file.detectedMimeType !== "image/png" && req.file.detectedMimeType !== "image/jpeg")
            throw Error("invalid file")

        if (req.file.size > 500000) throw Error("max size")
    }
    catch(err){
        const erros = uploadErros(err)
        return res.status(201).json({erros})
    }

    const fileName = req.body.name + ".jpg"
    console.log(fileName);


    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    )
    console.log('salut');


    try{
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            {$set : {pp:"./uploads/profil/" + fileName}}
        )
    }
    catch(err){

    }
}

