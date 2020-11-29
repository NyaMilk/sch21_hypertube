const router = require('express').Router();
const { sign, getOnlyPass, getEmail, getLogin,
    addConfirmHash, getConfirmHash, userDel, confirmUser } = require('../models/register');
const bcrypt = require('bcrypt');
const { sendMail } = require('../util/mail');

router.get('/check/email/:email', async (req, res) => {
    try {
        const email = [req.params.email];

        getEmail(email)
            .then(data => {
                if (data.length > 0)
                    res.status(200).json({
                        success: true
                    })
                else
                    res.status(200).json({
                        message: "Ooops! Cannot check email. Try again",
                        success: false
                    })
            })
            .catch(() => {
                res.status(200).json({
                    message: "Ooops! Cannot check email. Try again",
                    success: false
                })
            })
    } catch (e) {
        res.status(200).json({
            message: "Ooops! Cannot check email. Try again",
            success: false
        })
    }
})

router.get('/check/login/:login', async (req, res) => {
    try {
        const login = [req.params.login];

        getLogin(login)
            .then(data => {
                if (data.length > 0)
                    res.status(200).json({
                        success: true
                    })
                else
                    res.status(200).json({
                        message: "Ooops! Cannot check login. Try again",
                        success: false
                    })
            })
            .catch(() => {
                res.status(200).json({
                    message: "Ooops! Cannot check login. Try again",
                    success: false
                })
            })
    } catch (e) {
        res.status(200).json({
            message: "Ooops! Cannot check login. Try again",
            success: false
        })
    }
})

router.post('/check/pass', async (req, res) => {
    try {
        const { login, password } = req.body;

        getOnlyPass([login])
            .then(data => {
                const len = data.length;
                let check;

                if (len > 0)
                    check = bcrypt.compareSync(password, data[0].password);

                if (len == 0 || check == false) {
                    res.status(200).json({
                        message: "Pass is incorrect",
                        success: false
                    })
                }
                else {
                    res.status(200).json({
                        message: "Okay",
                        success: true
                    })
                }
            })
            .catch(e => {
                res.status(200).json({
                    message: "Ooops! Cannot check password. Try again",
                    success: false
                })
            })
    } catch (e) {
        res.status(200).json({
            message: "Ooops! Cannot check password. Try again",
            success: false
        })
    }
})

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const { userName, lastName, firstName, email, password } = req.body;
        const time = new Date();
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        console.log(userName, firstName, lastName, email, hash);

        sign(userName, firstName, lastName, email, hash)
            .then(data => {
                if (data.username) {
                    const login = data.username;
                    const confirmHash = bcrypt.hashSync(login + time, salt).replace(/\//g, "slash");

                    addConfirmHash([confirmHash, login])
                        .then(() => {
                            sendMail(email, 'Confirmation',
                                'You have 1 day to confirm your account',
                                `<a href='http://localhost:3000/login/${userName}/${confirmHash}'>You have 1 day to confirm your account</a>`);
                            res.status(200).json({
                                message: "Check your email &)",
                                login: login,
                                success: true
                            })
                            return;
                        })
                        .catch(() => {
                            res.status(200).json({
                                message: "Ooops! User was not added! Try again",
                                success: false
                            })
                        })
                }
            })
            .catch((e) => {
                res.status(200).json({
                    message: "Ooops! User was not added! Try again",
                    success: false
                })
            })
    } catch (e) {
        res.status(200).json({
            message: "Ooops! User was not added! Try again",
            success: false
        })
    }
})

router.post('/confirm', async (req, res) => {
    try {
        const { nickname, hash } = req.body;
        const time = new Date();

        getConfirmHash([nickname])
            .then((data) => {
                if (data[0].confirmhash) {
                    const trueHash = data[0].confirmhash;
                    const oldTime = data[0].created_at_user;

                    if (time.getDate() !== oldTime.getDate() || hash !== trueHash) {
                        userDel([nickname])
                            .then(() => {
                                res.status(200).json({
                                    message: "Your confirm link is time out",
                                    success: false
                                })
                            })
                            .catch(() => {
                                res.status(200).json({
                                    message: "Your confirm link is time out",
                                    success: false
                                })
                            })
                    }
                    else {
                        confirmUser([nickname])
                            .then(() => {
                                res.status(200).json({
                                    message: "Cool! Welcome to",
                                    success: true
                                })
                            })
                            .catch(() => {
                                res.status(200).json({
                                    message: "Oppsy! Account was not confirmed. Try again",
                                    success: false
                                })
                            })
                    }
                }
            })
            .catch(() => {
                res.status(200).json({
                    message: "Oppsy! Account was not confirmed. Try again",
                    success: false
                })
            })
    } catch (e) {
        res.status(200).json({
            message: "Oppsy! Account was not confirmed. Try again",
            success: false
        })
    }
})

module.exports = router;