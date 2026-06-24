var express = require('express');
var router = express.Router();
const multer = require('multer');

const AudioService = require('../services/audio.service');
const ApiSecurity = require('../middleware/apiSecurity')

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // limit files to 10MB
});



// #swagger.parameters['title'] = {
//                 in: 'formData',
//                 type: 'string',
//                 required: true,
//                 description: 'The title of your track'
//         }
//        #swagger.parameters['description'] = {
//                 in: 'formData',
//                 type: 'string',
//                 description: 'Optional track details'
//         }
router.post('/', ApiSecurity.requireLogin, upload.single('audioTrack'), (req, res, next) => {
   /* #swagger.tags = ['audio']
       #swagger.summary = 'Upload a new audio track'
       #swagger.description = 'Uploads an audio file using multipart/form-data. Requires a valid token.'
       #swagger.consumes = ['multipart/form-data']
       
       #swagger.parameters['audioTrack'] = {
                in: 'formData',
                type: 'file',
                required: true,
                description: 'The binary audio file (.mp3, .wav, etc.)'
       }
       #swagger.parameters['title'] = {
                in: 'formData',
                type: 'string',
                required: true,
                description: 'The name/title of your audio track'
       }
       #swagger.parameters['description'] = {
                in: 'formData',
                type: 'string',
                required: false,
                description: 'Optional summary or details about this music file'
       }
    */
    AudioService.upload(req, res, next);
});
 

router.get('/search', (req, res, next) => {
    /* #swagger.tags = ['audio']
       #swagger.summary = 'Search and list audio tracks'
       #swagger.parameters['title'] = { in: 'query', type: 'string' }
       #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1 }
       #swagger.parameters['size'] = { in: 'query', type: 'integer', default: 10 }
    */
    AudioService.search(req, res, next);
});



router.get('/mytracks', ApiSecurity.requireLogin, (req, res, next)=>{
    /* #swagger.tags = ['audio']*/
    AudioService.getMine(req, res, next);
})

router.get('/:fileId', (req, res, next) => {
    /* 
        #swagger.tags = ['audio']
        #swagger.parameters['fileId'] = { in: 'path', type: 'string', required: true }
    */
    AudioService.getById(req, res, next);
});



router.get('/:fileId/download', (req, res, next) => {
    /* #swagger.tags = ['audio']
       #swagger.parameters['fileId'] = { in: 'path', type: 'string', required: true }
    */
    AudioService.download(req, res, next);
});

router.put('/:fileId', ApiSecurity.requireLogin, ApiSecurity.requireAudioOwnership, (req, res, next) => {
  /* #swagger.tags = ['audio']
   
*/
    AudioService.update(req, res, next);
});


router.delete('/:fileId', ApiSecurity.requireLogin, (req, res, next) => {
    /* #swagger.tags = ['audio']
       #swagger.summary = 'Delete an audio track'
       #swagger.parameters['fileId'] = { in: 'path', type: 'string', required: true }
    */
    AudioService.delete(req, res, next);
});

router.post('/:id/like', ApiSecurity.requireLogin, (req, res, next) => {
    /* #swagger.tags = ['audio']
       #swagger.summary = 'Like an audio track'
       #swagger.parameters['id'] = { in: 'path', type: 'string', required: true }
    */
    AudioService.like(req, res, next);
});

router.delete('/:id/like', ApiSecurity.requireLogin, (req, res, next) => {
    /* #swagger.tags = ['audio']
       #swagger.summary = 'Unlike an audio track'
       #swagger.parameters['id'] = { in: 'path', type: 'string', required: true }
    */
    AudioService.unlike(req, res, next);
});

router.get('/:id/likes/count', (req, res, next) => {
    /* #swagger.tags = ['audio']
       #swagger.summary = 'Get like count for an audio track'
    */
    AudioService.likesCount(req, res, next);
});




module.exports = router;