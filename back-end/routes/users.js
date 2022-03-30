const router = require ('express').Router();
const uploadController = require('../controllers/upload')
const multer = require ('multer')
const upload =  multer()

//upload
router.post('/upload', upload.single('file'), uploadController.uploadProfil)

module.exports = router