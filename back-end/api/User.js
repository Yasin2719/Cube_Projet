const express = require('express');
require ("dotenv").config();
const router = express.Router();
const User = require('./../models/Users');
const bcrypt = require('bcrypt');
const UserVerification = require("./../models/UserVerification");
const PasswordReset = require("./../models/PasswordReset");
const nodemailer = require("nodemailer");
const {v4: uuidv4} = require("uuid");
const jwtUtils = require ('../utils/jwt.utils');
const { generateTokenUser } = require('../utils/jwt.utils');
const { status } = require('express/lib/response');
var ObjectId = require('mongodb').ObjectID;
const maxAge = 3*24*60*60*1000

let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
})

transport.verify((error, success) => {
    if(error){
        console.log(error);
    } else{
        console.log("Ready for message");
        console.log(success);
    }
})

router.post('/signup', (req,res)=>{
    let {userNom, userPrenom, userPseudo, userMail, userPassword} = req.body;
    console.log(userNom)
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
                        verified: false,
                        //userFavoriteRessource: null,
                        //userRessourceExploite: null,
                        //userRessourceMisDeCote: null
                    });

                    newUser.save().then(result =>{
                        sendVerificationMail(result, res);

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

const  sendVerificationMail = ({_id, userMail}, res)  =>{
    const currentUrl = "https://localhost/3005/";

    const uniqueString = uuidv4() + _id; 

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: userMail,
        subject :"Nouveau Mot de Passe",
        html: `<p>Pour vérifiez votre mail, cliquez sur le lien ci-dessous.</p><p>Ce lien<b> expire dans 6 heure<b>.</p><p>Cliquez <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}>ici</a> pour continuez</p>`,
    };

    const saltRounds = 10;
    bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) =>{
        const newVerification = new UserVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 21600000,

        });

        console.log(mailOptions)

        newVerification
        .save().then(()=>{
            transport
            .sendMail(mailOptions)
            .then(()=>{
                res.json({
                    status: "200",
                    message: "Verification envoyer"
                })
            })
            .catch((error)=>{
                console.log(error)
                res.json({
                    status: "404",
                    message: "Erreur lord de l'envoi de la Verification"
                })
            })
        })
        .catch((error) => {
            res.json({
                status: "404",
                message: "Impossible de sauvegarder la verification du mail"
            })
            
        })
    })
    .catch(() => {
        res.json({
            status: "404",
            message: "Une erreur s'est produite lors du cryptage du mot de passe"
        })
    })
}

router.post("/verify/:userId/:uniqueString", (req, res)=>{
    let{userId, uniqueString} = req.body;

    UserVerification.find({userId})
    .then((result)=>{
        console.log("boule fini");
        if(result.length >0){
            console.log("result > 0")
            const {expiresAt} = result[0];
            const hashedUniqueString = result[0].uniqueString;

            if(expiresAt <Date.now()){
                console.log("date expire < date ajud")
                UserVerification
                .deleteOne({userId})
                .then(result=>{
                    console.log("entrer userVerification delete one")
                    User.deleteOne({_id: userId})
                    .then(()=>{
                        console.log("entrer user delete one")
                        res.json({
                            status: 200,
                            message: "Le lien a éxpiré"
                        }); 
                    })
                    .catch((error)=>{
                        res.json({
                            status: 404,
                            message: "Erreur rencontré lors de la Supression du user"
                        }); 
                    })
                })
                .catch((error)=>{
                    res.json({
                        status: 404,
                        message: "Erreur rencontré lors de la supression du user Verifaction après expiration"
                    }); 
                })
            }
            else{
                console.log("date Superieur")
                bcrypt.compare(uniqueString,hashedUniqueString)
                .then(result=>{
                    if(result){
                        console.log("ModifUser")
                        User.updateOne({_id: userId}, {verified: true})
                        .then(()=>{
                            UserVerification
                            .deleteOne({userId})
                            .then(()=>{
                                res.json({
                                    status: 200,
                                    message: "Succes"
                                }); 
                            })
                            .catch(error=>{
                                res.json({
                                    status: 404,
                                    message: "Erreur rencontré pour finaliser le succes de la verification "
                                }); 
                            })
                        })
                        .catch(error=>{
                            res.json({
                                status: 404,
                                message: "Erreur rencontré lors de la modification du user pour verification = true"
                            }); 
                        })
                    }else{
                        res.json({
                            status: 404,
                            message: "les details de la verification sont invalid"
                        }); 
                    }
                })
                .catch(error=>{
                    res.json({
                        status: 404,
                        message: "Erreur rencontré lors de la comparaison des unique string."
                    }); 
                })
            }
        } else{
            console.log(result.length)
            console.log("Erreur, données vides")
            console.log(userId)
            res.json({
                status: 404,
                message: "Erreur, données vides"
            }); 
        }
    })
    .catch((error)=>{
        console.log(error);
        res.json({
            status: 404,
            message: "Erreur rencontré lors de la verification de l'existance de la verification user"
        }); 
    })
})

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
            if(data.length){

                if(!data[0].verified){
                    res.json({
                        status: 404,
                        message: "Le mail n'a pas était verifier. Verifiez Vos Mails"
                    }); 
                } else{
                    const hashedPw = data[0].userPassword;
                    bcrypt.compare(userPassword, hashedPw).then(result =>{
                        if(result){
                            res.cookie('jwt', jwtUtils.generateTokenUser(data), {httpOnly:true, maxAge: maxAge})
                            res.json({
                                status: 200,
                                message: "connexion avec sucès",
                               // token : "token generate : " + jwtUtils.generateTokenUser(data),
                                //data: data[0]
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
                }
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
});

router.get('/logout', (req, res)=>{
    res.cookie('jwt', '', {maxAge:1})
    res.redirect('/')
})

router.post("/requestPasswordReset", (req, res) =>{
    let {userMail, redirectUrl} = req.body;

    User
    .find({userMail})
    .then(data =>{
        if(data.length){

            if(!data[0].verified){
                res.json({
                    status: 404,
                    message: "Ce Mail n'est pas vérifier. Vérifier vos mail"
                })
            }else{
                console.log(data[0])
                sendResetMail(data[0], redirectUrl, res);
        }

        }else{
            res.json({
                status: 404,
                message: "aucun compte avec ce mail"
            })
        }
    })
    .catch(error =>{
        console.log(error)
        res.json({
            status: 404,
            message: "Erreur lors de la recherche du mail"
        })
    })
})

const sendResetMail = (_id, userMail, redirectUrl, res) =>{
    //let{_id, userMail} = req.body;
    resetString = uuidv4() + _id;

    PasswordReset
    .deleteMany({ UserId: _id})
    .then(result =>{
        console.log("entrer dans mailll")
        console.log(userMail)
        console.log(_id)
        console.log(redirectUrl)


        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: userMail,
            subject :"Nouveau Mot de Passe",
            html: `<p>Vous avez oubliez votre mot de passe, cliquez sur ce lien.</p><p>Ce lien<b> expire dans 1 heure<b>.</p><p>Cliquez <a href=${redirectUrl + "/" + _id + "/" + resetString}>ici</a> pour continuez</p>`,
        };

        const saltRounds = 10;
        bcrypt
        .hash(resetString, saltRounds)
        .then(hashedPw =>{
            const newPassWordReset = new PasswordReset({
                UserId: _id,
                ResetString: resetString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 3600000,
            });

            newPassWordReset
            .save()
            .then(() =>{
                transport
                .sendMail(mailOptions)
                .then(() =>{
                    res.json({
                        status: 200,
                        message: "Le mail a bien était envoyé",
                    })
                })
                .catch(err =>{
                    console.log(err);
                    res.json({
                        status: 404,
                        message: "Erreur lors de l'envoi du mail"
                    })
                })
            })
            .catch(err =>{
                console.log(err);
                res.json({
                    status: 404,
                    message: "Une erreur s'est produite lors de la sauvegarde du nouveau mot de passe"
                })
            })

        })
        .catch(err =>{
            console.log(err);
            res.json({
                status: 404,
                message: "Une erreur s'est produite lors du cryptage du mot de passe"
            })
        })
    })
    .catch(err =>{
        res.json({
            status: 404,
            message: "La suppression du mot de passe a échouée"
        })
    })
}

//donne tout les utilisateurs de la bd
router.get('/allUser', (req,res)=>{
    User.find().select('-userPassword')
    .then((data)=>{

        res.json({
            status: 200,
            message: "Tout les users",
            data:data
        })

    })
    .catch((err)=>{
        res.json({
            status : 404,
            message : "users introuvable"
        })
    })

})

//donne un utilisateur de la bd

router.get('/oneUser&:id', (req, res)=>{
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send('id inconnu : ' + req.params.id)
    
    User.findById(req.params.id, (err, docs)=>{
        if (!err) res.send(docs)
        else console.log('id unknow : ' + err)
    })
    .select('-userPassword')
})



//modifier mail et mot de passe d'un utilisateur
router.put('/updateMdpMail&:id', (req, res)=>{
    console.log('dallllllllllllllllllllllllllllit')
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send('id inconnu : ' + req.params.id)
    console.log(req.body.userMail)

    console.log(req.body.userPassword)
        try { 
        
        const saltRounds = 10;       
        bcrypt.hash(req.body.userPassword,saltRounds ).then(hashedPw =>{

            console.log('saluuuuuuuuuuuuuuut');
            console.log(hashedPw);
            // console.log(_id);
            User.findOneAndUpdate(
            
                
                {_id: req.params.id},
                {
                    $set : {
                         userMail : req.body.userMail,
                         userPassword : hashedPw,
                         verified : false
                        //bio : req.body.bio
                        
                    }
    
                    
                }, 
                {new: true, upsert: true, setDefaultsOnInsert: true },
                
    
                
                (err, docs)=>{
                    if(!err) {
                        console.log(docs._id)
                        console.log(docs.userMail)
                        //res.send(docs)
                        return sendResetMail(docs._id, docs.userMail,"8.8.8.8", res)
                        
                    } 
                    if (err) return res.status(500).send({message : err})
                }
                
            )

        })
        

        // .then((data)=>{
        //     console.log(data)
        //     res.json({
        //         status:200,
        //         data:data
        //     })

        // })
        // .catch((err)=>{
        //     console.log(err)
        //     res.json({
        //         status:400,
        //         message: "erreur"
        //     })
        // })
    }

    catch(err){
        console.log(err)
        return  res.status(500).json({message : err})
       
    }
} )

router.delete('/deleteUser&:id', (req, res)=>{
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send('id inconnu : ' + req.params.id)
    try {
        User.remove({_id : req.params.id}).exec();
        res.status(200).json({message : "sucessfull delete"})

    } catch (err) {

        return  res.status(500).json({message : err})

    }
})

module.exports = router; 