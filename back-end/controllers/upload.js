//const UserModel = require ('../models/users')
const fs = require ('fs')
const {promisify} = require ('util')
const { uploadErros } = require('../utils/errors.utils')
const pipeLine = promisify(require ('stream').pipeline)

module.exports.uploadProfil = async (req, res)=>{

    try{
        if (req.file.detectedMimeType != "image/jpg" && req.file.detectedMimeType != "image/png", req.file.detectedMimeType != "image/jpeg")
            throw Error("invalid file")

        if (req.file.size > 500000) throw Errof("max size")
    }
    catch(err){
        const erros = uploadErros(err)
        return res.status(201).json({erros})
    }

    const fileName = req.body.name + ".jpg"


    await pipeLine(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    )
    console.log('salut');
}       