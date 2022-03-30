module.exports.uploadErros = (err) =>{
    let errors = {fomat :'', maxSize : ''}

        if (err.message.includes('invalide file'))
            errors.format = "Format incompatible"

        if (err.message.includes('max size'))
            errors.maxSize = "Le fichier dépasse 500ko"

    return error
}