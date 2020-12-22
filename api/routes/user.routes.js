const router = require('express').Router();
const { getProfile, editProfile, insertFriend, deleteFriend } = require("../models/user");
const bcrypt = require('bcrypt');
const { getFavoriteMovies, getProfileComments } = require('../models/movies');

router.get('/profile/:username', async (req, res) => {
    try {
        const { username } = req.params;

        getProfile(username)
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

router.post('/profile/edit/:username', async (req, res) => {
    const { username } = req.params;
    let keys = [];
    let params = [];
    let i = 1;

    // console.log(username, req.body);
    for (const [key, value] of Object.entries(req.body)) {
        if (value !== null && key !== 'newpass') {
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
            nickname: username,
            success: true
        })
        return;
    }

    const que = keys.join(', ');
    params.push(username);
    editProfile(que, params, i)
        .then(data => {
            console.log(data);
            res.status(200).json({
                message: "Ok",
                nickname: data.nickname,
                success: true
            })
        })
        .catch(e => {
            console.log(e.message);
            res.status(200).json({
                message: e.message,
                success: false
            })
        })
})

router.get('/profile/favorites/movies/:me', function (req, res) {
    try {
        const { me } = req.params;

        getFavoriteMovies(me)
            .then(data => {
                res.status(200).json({
                    success: true,
                    result: data
                });
            })
            .catch(() => {
                res.status(200).json({
                    success: false,
                    message: "Ooops! Not found favorite films"
                })
            })
    } catch (e) {
        res.status(200).json({
            success: false,
            message: "Ooops! Not found favorite films"
        })
    }
});

router.get('/profile/comments/:me', function (req, res) {
    try {
        const { me } = req.params;

        getProfileComments(me)
            .then(data => {
                res.status(200).json({
                    success: true,
                    result: data
                });
            })
            .catch(() => {
                res.status(200).json({
                    success: false,
                    message: "Ooops! Not found favorite films"
                })
            })
    } catch (e) {
        res.status(200).json({
            success: false,
            message: "Ooops! Not found favorite films"
        })
    }
});

router.post('/profile/friends', async (req, res) => {
    try {
        console.log(req.body);
        const { me, you, status } = req.body;
        const promise = (status === 'add') ? insertFriend(me, you) : deleteFriend(me, you);

        promise
            .then(data => {
                if (data.length > 0)
                    res.status(200).json({
                        message: "Ok",
                        success: true
                    });
                else
                    res.status(200).json({
                        message: "No such friend",
                        success: false
                    })
            })
            .catch(() => {
                res.status(200).json({
                    message: "Ooops! Cannot update friend list. Try again",
                    success: false
                })
            })

    }
    catch (e) {
        res.status(200).json({
            message: "Ooops! Cannot update friend list. Try again",
            success: false
        })
    }
});

module.exports = router;