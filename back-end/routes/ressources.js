const router = require ('express').Router();
const ressourceController = require('../controllers/ressource');

router.get('/', ressourceController.readRessource);
router.post('/add', ressourceController.createRessource);
router.put('/:id', ressourceController.updateRessource);
router.delete('/:id', ressourceController.deleteRessource);

module.exports = router