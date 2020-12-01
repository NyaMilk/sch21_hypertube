const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: "uploads" });
const fs = require('fs');
const { putImage, getImage } = require('../models/image');

router.post('/:nickname', upload.single('photo'), async (req, res) => {
    try {
        const { nickname } = req.params;
        let { mimetype, path } = req.file;
        const newPath = path.split('/')[1];

        putImage(mimetype, newPath, nickname)
            .then(data => {
                res.status(200).json({
                    message: data,
                    success: true
                })
            })
            .catch(e => {
                res.status(200).json({
                    message: e.message,
                    success: false
                })
            })
    } catch (e) {
        res.status(200).json({
            message: e.message,
            success: false
        })
    }
})

router.get('/:nickname', async (req, res) => {
    try {
        const { nickname } = req.params;

        getImage(nickname)
            .then(data => {
                const path = data[0].avatar[1];
                const img = fs.readFileSync('uploads/' + path);
                const encode_image = img.toString('base64');
                const finalImg = new Buffer.from(encode_image, 'base64');
                res.contentType(data[0].avatar[0])
                res.send(finalImg);
            })
            .catch(e => {
                res.status(200).json({
                    message: "Not found photo",
                    success: false
                })
            })
    } catch (e) {
        res.status(200).json({
            message: "Not found photo",
            success: false
        })
    }
})

module.exports = router;