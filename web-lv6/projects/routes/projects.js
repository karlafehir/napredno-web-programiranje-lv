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
        mongoose.model('Project').find({}, function (err, projects) {
            if (err) {
                return console.error(err);
            } else {
                res.format({
                    html: function () {
                        res.render('projects/index', {
                            title: 'Projects',
                            "projects": projects
                        });
                    },
                    json: function () {
                        res.json(projects);
                    }
                });
            }
        });
    })
    .post(function (req, res) {
        const name = req.body.name;
        const description = req.body.description;
        const price = req.body.price;
        const members = req.body.members;
        const finishedWorks = req.body.finishedWorks;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;

        mongoose.model('Project').create({
            name: name,
            description: description,
            price: price,
            members: members,
            finishedWorks: finishedWorks,
            startTime: startTime,
            endTime: endTime,
        }, function (err, project) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                console.log('POST creating new project: ' + project);
                res.format({
                    html: function () {
                        res.location("projects");
                        res.redirect("/projects");
                    },
                    json: function () {
                        res.json(project);
                    }
                });
            }
        })
    });

router.get('/new', function (req, res) {
    res.render('projects/new', {title: 'New Project'});
});

router.route('/:id')
    .get(function (req, res) {
        mongoose.model('Project').findById(req.params.id, function (err, project) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                res.format({
                    html: function () {
                        res.render('projects/show', {
                            "project": project
                        });
                    },
                    json: function () {
                        res.json(project);
                    }
                });
            }
        });
    });

router.route('/edit/:id')
    .get(function (req, res) {
        mongoose.model('Project').findById(req.params.id, function (err, project) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                res.format({
                    html: function () {
                        res.render('projects/edit', {
                            title: 'Project: ' + project._id,
                            "project": project
                        });
                    },
                    json: function () {
                        res.json(project);
                    }
                });
            }
        });
    })
    .put(function (req, res) {
        const name = req.body.name;
        const description = req.body.description;
        const price = req.body.price;
        const members = req.body.members;
        const finishedWorks = req.body.finishedWorks;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;

        mongoose.model('Project').findById(req.params.id, function (err, project) {
            project.update({
                name: name,
                description: description,
                price: price,
                members: members,
                finishedWorks: finishedWorks,
                startTime: startTime,
                endTime: endTime,
            }, function (err, projectId) {
                if (err) {
                    res.send("There was a problem updating the information to the database: " + err);
                } else {
                    res.format({
                        html: function () {
                            res.redirect("/projects");
                        }
                    });
                }
            })
        });
    })
    .delete(function (req, res) {
        mongoose.model('Project').findById(req.params.id, function (err, project) {
            if (err) {
                return console.error(err);
            } else {
                project.remove(function (err, project) {
                    if (err) {
                        return console.error(err);
                    } else {
                        console.log('DELETE removing ID: ' + project._id);
                        res.format({
                            html: function () {
                                res.redirect("/projects");
                            },
                            json: function () {
                                res.json({
                                    message: 'deleted',
                                    item: project
                                });
                            }
                        });
                    }
                });
            }
        });
    });

module.exports = router;