const router = require ('express').Router();
const ressourceController = require('../controllers/ressource');

router.get('/', ressourceController.readRessource);
router.post('/add', ressourceController.createRessource);
router.put('/:id', ressourceController.updateRessource);
router.delete('/:id', ressourceController.deleteRessource);
router.patch('/like-ressource/:id', ressourceController.likeRessource )
router.patch('/unlike-ressource/:id', ressourceController.unlikeRessource ) // retirer son like 

//commentaires

router.patch('/comment-ressource/:id', ressourceController.commentRessource)
router.patch('/delete-comment-ressource/:id', ressourceController.deleteCommentRessource)

// upload



module.exports = router