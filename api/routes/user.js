const router = require("express").Router();
const { getMe } = require('../models/user');
const { getMe2 } = require('../models/user2');

router.get("/test", (req, res) => {
    getMe2()
        .then((data) => {
            res.json({
                data: data
            })
        })
});

module.exports = router;