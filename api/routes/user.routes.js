const router = require('express').Router();
const { getProfile, editProfile } = require("../models/user");
const bcrypt = require('bcrypt');

router.get('/profile/:nickname', async (req, res) => {
    try {
        const nickname = [req.params.nickname];

        getProfile(nickname)
            .then(data => {
                if (data.length > 0) {
                    res.status(200).json({
                        result: data[0],
                        message: "Ok",
                        success: true
                    });
                }
                else
                    res.status(200).json({
                        message: "Profile not found",
                        success: false
                    })
            })
            .catch((e) => {
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

router.post('/profile/edit/:nickname', async (req, res) => {
    const login = req.params.nickname;
    let keys = [];
    let params = [];
    let i = 1;

    for (const [key, value] of Object.entries(req.body)) {
        if (value !== null && key !== 'newtags' && key !== 'newpass' && key !== 'oldtags' && key !== 'coords') {
            keys.push(`${key} = $${i++}`);
            params.push(value);
        }
        else if (value !== null && key === 'newpass') {
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(value, salt);

            keys.push(`password = $${i++}`);
            params.push(hash);
        }
    }

    if (params.length === 0) {
        res.status(200).json({
            msg: 'wow',
            nickname: login,
            success: true
        })
        return;
    }

    const que = keys.join(', ');
    params.push(login);
    editProfile(que, params, i)
        .then(data => {
            res.status(200).json({
                message: "Ok",
                nickname: data.nickname,
                success: true
            })
        })
        .catch(e => {
            res.status(200).json({
                message: e.message,
                success: false
            })
        })
})