const express = require('express');
const Categories = require('../models/Categories');
require ("dotenv").config();
const router = express.Router();
const Ressources = require('../models/Ressources');

router.post('/createRessource', (req,res)=>{
    let {RessourceTitle,RessourceStatut,RessourceType,RessourceContenu,RessourceCommentaires, RessourceIsValid,RessourceCategorie} = req.body;
    
})