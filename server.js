var ejs = require('ejs'),
    express = require('express'),
    app = express(),
    functions = require('./functions.js'),
    bodyParser = require('body-parser');

app.set('view engine', 'ejs');

var router = express.Router(); //API routes

// INDEX
router.get('/', function(req, res) {
    res.render('index');
});

// EVENT PAGES
router.route('/event') // Returns list of all events
    .get(function(req, res) {
        functions.loadEventsList( function (err, events) {
            if (err) {
                console.log(err);
            } else {
                res.render('events/eventList', events );
            }
        });
    });
router.route('/event/new')
    .get(function(req, res) {
        functions.loadClubList(function (err, clubs) {
            if (err) {
                console.log(err);
            }
            res.render('events/createEvent', clubs);
        });
    })
    .post(function(req) {
        var postDetails = JSON.parse(req.query.event);
        //console.log(postDetails);
        functions.postNewEvent(postDetails);
    });
router.route('/event/:id') // Returns event page for event with specified ID
    .get(function(req, res) {
        functions.loadEventResults(req.params.id, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                if (results.details == []) {
                    //res.render('events/event', { errMessage: "No event found!" });
                } else {
                    res.render('events/event', results);
                }
            }
        });
    })
    .post(function(req){
        var postDetails = JSON.parse(req.params.id);
        if (postDetails.type == "post result") {
            functions.postEventResult(postDetails);
        }
    });
router.route('/event/update/:id')
    .get(function(req, res) {
        functions.getEventDetailsForUpdate(req.params.id, function (err, results) {
            if (err) {
                console.log(err);
            }
            res.render('events/updateEvent', results);
        });
    })
    .post(function(req) {
        var postDetails = JSON.parse(req.query.event);
        //console.log(postDetails);
        functions.updateEvent(postDetails);
    });

// USER PAGES
router.route('/user')
    .get(function(req, res) {
        functions.lastNewUser( function (err, lastNewUser) {
            var newUser = { newUser: lastNewUser };
            console.log(newUser);
            res.render('users/createUser', newUser);
        });
    })
    .post(function(req, res) {
        var postDetails = JSON.parse(req.query.profile);
        functions.postNewUser(postDetails, function (err, newUser) {
            if (err) {
                console.log(err);
            }
            //console.log(newUser);
            res.send("user/" + newUser);
        });
    });
router.route('/user/:id')
    .get(function(req, res) {
        functions.loadUser(req.params.id, function (err, results) {
            if (err) {
                console.log(err);
            }
            res.render('users/user', results);
        });
    });
router.route('/user/update/:id')
    .get(function(req, res) {
        functions.loadOnlyUserProfile(req.params.id, function (err, results) {
            if (err) {
                console.log(err);
            }
            res.render('users/updateUser', results);
        });
    })
    .post(function(req) {
        var postDetails = JSON.parse(req.query.profile);
        //console.log(postDetails);
        functions.updateUser(postDetails);
    });
router.route('/user/conversation/:id')
    .get(function(req, res) {

    });

// CLUB PAGES
router.route('/club')
    .get(function(req, res) {
       functions.loadClubList(function (err, clubs) {
           if (err) {
               console.log(err);
           }
           res.render('clubs/clubList', clubs);
       });
    });
router.route('/club/new')
    .get(function(req, res) {
        res.render('clubs/createClub');
    })
    .post(function(req) {
        var postDetails = JSON.parse(req.query.club);
        //console.log(postDetails);
        functions.postNewClub(postDetails);
    });
router.route('/club/:id')
    .get(function(req, res) {
        functions.loadClub(req.params.id, function (err, results) {
            if (err) {
                console.log(err);
            }
            res.render('clubs/club', results);
        });
    })
    .post(function(req){
        var postDetails = JSON.parse(req.params.id);
        if (postDetails.type == "wallPost") {
            functions.postClubWall(postDetails);
        } else if (postDetails.type == "joinRequest") {
            functions.postJoinRequest(postDetails);
        }
    });
router.route('/club/users/:id')
    .get(function(req, res) {
        functions.loadClubMembers(req.params.id, function (err, results) {
            if (err) {
                console.log(err);
            }
            res.render('clubs/clubMembers', results);
        });
    });
router.route('/club/join_requests/:id')
    .get(function(req, res) {
        functions.loadJoinRequests(req.params.id, function (err, results) {
            if (err) {
                console.log(err);
            }
            res.render('clubs/joinRequests', results);
        });
    })
    .post(function(req){
        var postDetails = JSON.parse(req.params.id);
        functions.acceptJoinRequest(postDetails);
    })
    .delete(function(req) {
        var postDetails = JSON.parse(req.params.id);
        functions.denyJoinRequest(postDetails);
    });

// Register routes and start server
app.use(router);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080;
app.listen(port);

console.log("Everything's go.");
