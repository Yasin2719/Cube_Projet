const router = require ('express').Router();
const ressourceController = require('../controllers/ressource');
const uploadController = require('../controllers/upload')
const multer = require ('multer');
const upload = multer();
// const upload =  multer({
//     dest: 'images'
// })

router.get('/', ressourceController.readRessource);
router.get('/ressource-infos/&:id', ressourceController.readRessourceById)
router.get('/user-ressource/&:id', ressourceController.ressourceByUserId);
router.post('/add', upload.single('file'), ressourceController.createRessource);
router.put('/:id', ressourceController.updateRessource);
router.delete('/&:id', ressourceController.deleteRessource);
router.patch('/like-ressource/:id', ressourceController.likeRessource )
router.patch('/unlike-ressource/:id', ressourceController.unlikeRessource ) // retirer son like 

//commentaires

router.patch('/comment-ressource/&:id', ressourceController.commentRessource)
router.patch('/delete-comment-ressource/:id', ressourceController.deleteCommentRessource)

// upload
// router.post('/upload', upload.single('file'), uploadController.uploadProfil)

// filtres 
// router.get('/filterLike', ressourceController.filterLike)


module.exports = router