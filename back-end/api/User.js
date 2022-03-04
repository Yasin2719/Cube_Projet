const express = require('express');
const router = express.Router();
const User = require('./../models/Users')
const bcrypt = require('bcrypt');

router.post('/signup', (req,res)=>{
    let {userNom, userPrenom, userPseudo, userMail, userPassword} = req.body;
    userNom = userNom.trim();
    userPrenom = userPrenom.trim();
    userPseudo = userPseudo.trim();
    userMail = userMail.trim();
    userPassword = userPassword.trim();
    

    if(userNom == "" || userPrenom == "" || userPseudo == "" || userMail == "" || userPassword == ""){
        res.json({
            status: 404,
            message: "Valeur nulle détéctée"
        });   
    } else if (!/^[a-zA-Z]*$/.test(userNom)){
        res.json({
            status: 404,
            message: "Syntaxe invalide pour le nom"
        });  
    }else if (!/^[a-zA-Z]*$/.test(userPrenom)){
        res.json({
            status: 404,
            message: "Syntaxe invalide pour le prénom"
        });  
    }else if (!/\S+@\S+\.\S+/.test(userMail)){
        res.json({
            status: 404,
            message: "Syntaxe invalide pour le mail"
        });  
    }else if (userPassword.length <8){
        res.json({
            status: 404,
            message: "Mot de passe trop court"
        });  
    }else{
        User.find({userMail}).then(result =>{
            if(result.length){
                res.json({
                    status: 404,
                    message: "Mail déjà utilisé"
                })
            }else{

                const saltRounds = 10;
                bcrypt.hash(userPassword, saltRounds).then(hashedPw =>{
                    const newUser = new User({
                        userNom,
                        userPrenom,
                        userPseudo,
                        userMail,
                        userPassword: hashedPw,
                        //userFavoriteRessource: null,
                        //userRessourceExploite: null,
                        //userRessourceMisDeCote: null
                    });

                    newUser.save().then(result =>{
                        res.json({
                            status: 200,
                            message: "succès lors de la création de l'utilisateur",
                            data: result
                        })

                    })
                    .catch(err => {
                        res.json({
                            status: 404,
                            message: "echec lors de la création de l'utilisateur"
                        })
                    })
                })
                .catch(err =>{
                    res.json({
                        status: 404,
                        message: "Erreur lors du cryptage du mot de passe",
                        data: err.message
                    })
                })

            }
        }).catch(err =>{
            console.log(err);
            res.json({
                status: 404,
                message: "Une erreur s'est produite"
            })
        })

    }
});

router.post('/signin', (req, res)=>{
    let {userMail,userPassword} = req.body;
    userMail = userMail.trim();
    userPassword = userPassword.trim();

    if( userMail == "" || userPassword == ""){
        res.json({
            status: 404,
            message: "Valeur nulle détéctée"
        });   
    }else {
        User.find({userMail})
        .then(data => {
            if(data){

                const hashedPw = data[0].userPassword;
                bcrypt.compare(userPassword, hashedPw).then(result =>{
                    if(result){
                        res.json({
                            status: 200,
                            message: "connexion avec sucès",
                            data: data
                        })
                    }else{
                        res.json({
                            status: 404,
                            message: "Mot de passe invalide"
                        }); 
                    }
                })
                .catch(err=>{
                    res.json({
                        status: 404,
                        message: "Erreur lors de la comparaison des mots de passe"
                    });
                })
            }else{
                res.json({
                    status: 404,
                    message: "Erreur lors de la connexion"
                });
            }
        }) 
        .catch(err =>{
            res.json({
                status: 404,
                message: "Mail Introuvable"
            })
        })
    }
})

module.exports = router; 