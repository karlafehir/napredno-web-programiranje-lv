var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'), 
    methodOverride = require('method-override'); 
router.use(bodyParser.urlencoded({extended: true}))
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

router.route('/')
    .get(function (req, res, next) {
        const data = {
            "username": "",
            "email": "",
            "password": "",
            "confirmPassword": ""
        }
        res.render('register/index', {
            "data": data,
            "title": "Register",
        });
    })
    .post(function (req, res) {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        const data = {
            "username": username,
            "email": email,
            "password": password,
            "confirmPassword": confirmPassword
        }

        if (password !== confirmPassword) {
            const error = "Passwords do not match!"
            res.format({
                html: function () {
                    res.render('register/index', {
                        "error": error,
                        "data": data,
                        "title": "Register",
                    });
                }
            });
        } else {
            mongoose.model('User').findOne({
                $or: [
                    { username: username },
                    { email: email },
                ]
            }, function (err, user) {
                if (err) {
                    return console.error(err);
                } else {
                    if (user) {
                        const error = "User with same username/email already exists!"
                        res.format({
                            html: function () {
                                res.render('register/index', {
                                    "error": error,
                                    "data": data,
                                    "title": "Register",
                                });
                            },
                            json: function () {
                                res.json(data);
                            }
                        });
                    }
                    else {
                        mongoose.model('User').create({
                            username: username,
                            email: email,
                            password: password,
                        }, function (err, project) {
                            if (err) {
                                res.send("There was a problem adding the information to the database.");
                            } else {
                                console.log('User registered: ' + username);
                                res.format({
                                    html: function () {
                                        res.location("login");
                                        res.redirect("/login");
                                    }
                                });
                            }
                        })
                    }
                }
            });
        }
    });

module.exports = router;
