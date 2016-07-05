var mysql = require('mysql'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'runthing'
    });
// MAKE SURE BLANK PASSWORD

connection.connect(function (err) {
    if (err) {
        console.error('No database found, making a new one.');
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root'});
        connection.query("CREATE DATABASE runthing", function(err) {
            if (err) {
                console.log("Could not create database");
            }
            createDatabase();
        });

    } else {
        console.log('connected as id ' + connection.threadId);
    }
});

function createDatabase() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'runthing'
    });
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to new database');
        } else {
            console.log('connected as id ' + connection.threadId);
        }
    });

    connection.query("CREATE TABLE `clubs` (`ID` int(11) NOT NULL, `Name` varchar(40) NOT NULL, `Phone_Number` varchar(15) NOT NULL, `Email` varchar(40) NOT NULL, `Address` text NOT NULL, `Description` text NOT NULL )", function(err) {
        if (err) {
            console.log("Could not create clubs");
        }
    });
    connection.query("ALTER TABLE `clubs` ADD PRIMARY KEY (`ID`);", function(err) {
        if (err) {
            console.log("Could not set primary key clubs");
        }
    });
    connection.query("INSERT INTO `clubs` (`ID`, `Name`, `Phone_Number`, `Email`, `Address`, `Description`) VALUES ('0', 'Unattached', '', '', '', '')", function(err) {
        if (err) {
            console.log("Could not create unattached club");
            console.log(err);
        }
    });
    connection.query("ALTER TABLE `clubs` MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;", function(err) {
        if (err) {
            console.log("Could not auto increment clubs");
        }
    });

    connection.query("CREATE TABLE `events` ( `ID` int(11) NOT NULL, `Host_ID` int(11) NOT NULL, `Name` varchar(60) NOT NULL, `Location` varchar(60) NOT NULL, `Date` date NOT NULL, `Start_Time` time NOT NULL, `Description` text NOT NULL )", function(err) {
        if (err) {
            console.log("Could not create events");
        }
    });
    connection.query("ALTER TABLE `events` ADD PRIMARY KEY (`ID`);", function(err) {
        if (err) {
            console.log("Could not set primary key events");
        }
    });
    connection.query("ALTER TABLE `events` MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;", function(err) {
        if (err) {
            console.log("Could not auto increment events");
            console.log(err);
        }
    });

    connection.query("CREATE TABLE `joinrequests` ( `Request_ID` int(11) NOT NULL, `Club_ID` int(11) NOT NULL, `Requester_ID` int(11) NOT NULL )", function(err) {
        if (err) {
            console.log("Could not create joinrequests");
        }
    });
    connection.query("ALTER TABLE `joinrequests` ADD PRIMARY KEY (`Request_ID`);", function(err) {
        if (err) {
            console.log("Could not set primary key joinrequests");
        }
    });
    connection.query("ALTER TABLE `joinrequests` MODIFY `Request_ID` int(11) NOT NULL AUTO_INCREMENT;", function(err) {
        if (err) {
            console.log("Could not auto increment joinrequests");
        }
    });

    connection.query("CREATE TABLE `results` ( `Event_ID` int(11) NOT NULL, `Runner_ID` int(11) NOT NULL, `Time` time NOT NULL )", function(err) {
        if (err) {
            console.log("Could not create results");
        }
    });

    connection.query("CREATE TABLE `runners` ( `ID` int(11) NOT NULL, `First_Name` varchar(25) NOT NULL, `Last_Name` varchar(25) NOT NULL, `Gender` varchar(1) NOT NULL, `Age` int(11) NOT NULL, `Photo` varchar(50) DEFAULT NULL, `Club_ID` int(11) DEFAULT NULL, `Admin` tinyint(1) NOT NULL, `Bio` text )", function(err) {
        if (err) {
            console.log("Could not create runners");
        }
    });
    connection.query("ALTER TABLE `runners` ADD PRIMARY KEY (`ID`);", function(err) {
        if (err) {
            console.log("Could not set primary key runners");
        }
    });
    connection.query("ALTER TABLE `runners` MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;", function(err) {
        if (err) {
            console.log("Could not auto increment runners");
        }
    });

    connection.query("CREATE TABLE `wallposts` ( `Post_ID` int(11) NOT NULL, `Club_ID` int(11) NOT NULL, `Runner_ID` int(11) NOT NULL, `Post_Time` datetime NOT NULL, `Post` text NOT NULL )", function(err) {
        if (err) {
            console.log("Could not create wallposts");
        }
    });
    connection.query("ALTER TABLE `wallposts` ADD PRIMARY KEY (`Post_ID`);", function(err) {
        if (err) {
            console.log("Could not set primary key wallposts");
        }
    });
    connection.query("ALTER TABLE `wallposts` MODIFY `Post_ID` int(11) NOT NULL AUTO_INCREMENT;", function(err) {
        if (err) {
            console.log("Could not auto increment wallposts");
        }
    });
}

function loadEventsList(callback) {
    var query = //SQL query to load Event ID, Name, and Date
            "SELECT ID, Name, DATE_FORMAT(events.Date,'%d/%m/%Y') AS Date " + //Formats date as DD/MM/YYYY
            "FROM events " +
            "ORDER BY Date ASC";

    connection.query(query, function(err, rows) {
        if (err) {
            console.log("Error with query");
            callback(err, null);
        }
        var events = {
            events: rows
        };
        callback(null, events);
    });
}

function loadEventResults(eventID, callback) {
    var resultsQuery = // Gets the list of results from the event
            "SELECT runners.First_Name, runners.Last_Name, runners.ID, clubs.Name AS Club_Name, clubs.ID AS Club_ID, results.Time " +
            "FROM runners, clubs, results " +
            "WHERE runners.ID = results.Runner_ID AND runners.Club_ID = clubs.ID AND results.Event_ID = ?" +
            "ORDER BY results.Time ASC ",
        detailsQuery = // Query for the event's details (name, date, location, etc.)
            "SELECT events.Name, DATE_FORMAT(events.Date,'%d/%m/%Y') AS Date, events.Start_Time, events.Location, events.Host_ID, events.Description, clubs.Name AS Club_Name " +
            "FROM events, clubs " +
            "WHERE events.Host_ID = clubs.ID AND events.ID = ?",
        usersQuery =
            "SELECT ID, First_Name, Last_Name FROM runners";

    connection.query(resultsQuery, [eventID], function(err, rows) {
        if (err) {
            console.log("Error with query");
            callback(err, null);
        }
        var results = rows;
        connection.query(detailsQuery, [eventID], function(err, rows) {
            if (err) {
                console.log("Error with query");
                callback(err, null);
            }
            var details = rows;
            connection.query(usersQuery, function(err, rows) {
                if (err) {
                    console.log("Error with query");
                    callback(err, null);
                }
                var final = {
                    details: details,
                    results: results,
                    users: rows
                };
                callback(null, final);
            });
        });
    });
}

function loadUser (userID, callback) {
    var profileQuery =
            "SELECT `runners`.`ID`, `runners`.`First_Name`, `runners`.`Last_Name`, `runners`.`Gender`, `runners`.`Age`, `runners`.`Photo`, `runners`.`Bio`, `runners`.`Admin`, `clubs`.`Name` AS Club_Name, `runners`.`Club_ID` " +
            "FROM `runners`, `clubs`" +
            "WHERE `runners`.`Club_ID` = `clubs`.`ID` AND `runners`.`ID` =?",
        resultsQuery =
            "SELECT `events`.`Name` AS Event_Name, DATE_FORMAT(`events`.`Date`,'%d/%m/%Y') AS Date , `results`.`Time`, `results`.`Event_ID` " +
            "FROM `events`, `results` " +
            "WHERE `results`.`Event_ID` = `events`.`ID` AND `results`.`Runner_ID` = ? " +
            "ORDER BY `events`.`Date` DESC",
        otherUsersQuery =
            "SELECT ID, First_Name, Last_Name " +
            "FROM runners " +
            "WHERE ID != ? " +
            "ORDER BY Last_Name";

    connection.query(profileQuery, userID, function(err, rows) {
        if (err) {
            console.log("Error with query");
            callback(err, null);
        }
        var profile = rows;
        connection.query(resultsQuery, userID, function(err, rows) {
            if (err) {
                console.log("Error with query");
                callback(err, null);
            }
            var results = rows;
            connection.query(otherUsersQuery, userID, function(err, rows) {
                if (err) {
                    console.log("Error with query");
                    callback(err, null);
                }
                var final = {
                    profile: profile,
                    results: results,
                    otherUsers: rows
                };
                callback(null, final);
            });
        });

    });
}

function loadClub (clubID, callback) {
    var clubQuery =
            "SELECT ID, Name, Phone_Number, Email, Address, Description " +
            "FROM clubs " +
            "WHERE ID = ?",
        adminQuery =
            "SELECT ID, First_Name, Last_Name " +
            "FROM runners " +
            "WHERE Admin = 1 AND ID = ?",
        postsQuery =
            "SELECT wallposts.Runner_ID, runners.First_Name, runners.Last_Name, DATE_FORMAT(wallposts.Post_Time,'%d/%m/%Y - %H:%i') AS Time_Posted, wallposts.Post " +
            "FROM wallposts, runners " +
            "WHERE wallposts.Runner_ID = runners.ID AND wallposts.Club_ID = ? " +
            "ORDER BY wallposts.Post_Time DESC",
        membersQuery =
            "SELECT ID, First_Name, Last_Name FROM runners WHERE Club_ID = ?",
        nonMembersQuery =
            "SELECT ID, First_Name, Last_Name FROM runners WHERE Club_ID != ?";

    connection.query(clubQuery, clubID, function(err, rows) {
        if (err) {
            console.log("Error with query");
            callback(err, null);
        }
        var club = rows;
        connection.query(adminQuery, clubID, function (err, rows) {
            if (err) {
                console.log("Error with query");
                callback(err, null);
            }
            var admins = rows;
            connection.query(postsQuery, clubID, function (err, rows) {
                if (err) {
                    console.log("Error with query");
                    callback(err, null);
                }
                var posts = rows;
                connection.query(membersQuery, clubID, function (err, rows) {
                    if (err) {
                        console.log("Error with query");
                        callback(err, null);
                    }
                    var members = rows;
                    connection.query(nonMembersQuery, clubID, function (err, rows) {
                        if (err) {
                            console.log("Error with query");
                            callback(err, null);
                        }
                        var final = {
                            club: club,
                            admins: admins,
                            posts: posts,
                            members: members,
                            nonMembers: rows
                        };
                        callback(null, final);
                    });
                });
            });
        });
    });
}

function postClubWall (postDetails) {
    var postQuery =
        "INSERT INTO wallposts (Post_ID, Club_ID, Runner_ID, Post_Time, Post) " +
        "VALUES (NULL, ? , ? , NOW(), ? )";
    connection.query(postQuery, [postDetails.club, postDetails.member, postDetails.text], function(err) {
        if (err) {
            console.log("Error with query");
        }
    });
}

function postNewUser (postDetails, callback) {
    var postQuery =
        "INSERT INTO `runners` (`ID`, `First_Name`, `Last_Name`, `Gender`, `Age`, `Photo`, `Club_ID`, `Admin`, `Bio`) " +
        "VALUES (NULL, ?, ?, ?, ?, NULL, '1', '', ?);";
    connection.query(postQuery, [postDetails.firstName, postDetails.lastName, postDetails.gender, postDetails.age, postDetails.bio], function(err) {
        if (err) {
            console.log("Error with query");
        }
    });
    lastNewUser(callback);
}

function postNewClub (postDetails) {
    var postQuery =
        "INSERT INTO `clubs` (`ID`, `Name`, `Phone_Number`, `Email`, `Address`, `Description`) " +
        "VALUES (NULL, ?, ?, ?, ?, ?);";
    //console.log(postDetails);
    connection.query(postQuery, [postDetails.name, postDetails.phoneNumber, postDetails.email, postDetails.address, postDetails.description], function(err) {
        if (err) {
            console.log("Error with query - create new event");
            console.log(err);
        }
    });
}

function lastNewUser (callback) {
    connection.query("SELECT LAST_INSERT_ID() AS New_User", function(err, rows) {
        if (err) {
            console.log("Error with query");
        }
        callback(null, rows);
    });
}

function loadClubMembers (clubID, callback) {
    var clubQuery =
            "SELECT ID, Name " +
            "FROM clubs " +
            "WHERE ID = ?",
        memberQuery =
            "SELECT ID, First_Name, Last_Name, Admin " +
            "FROM runners " +
            "WHERE Club_ID = ? " +
            "ORDER BY Last_Name";
    connection.query(clubQuery, clubID, function(err, rows) {
        if (err) {
            console.log("Error with query");
        }
        var club = rows;
        connection.query(memberQuery, clubID, function(err, rows) {
            if (err) {
                console.log("Error with query");
            }
            var final = {
                club: club,
                members: rows
            };
            callback(null, final);
        });
    });
}

function postJoinRequest (postDetails) {
    var postQuery =
            "INSERT INTO joinrequests (Club_ID, Requester_ID ) " +
            "VALUES (?, ?)";

    connection.query(postQuery, [postDetails.club, postDetails.nonMember], function(err) {
        if (err) {
            console.log("Error with query - posting join request");
            console.log(err);
        }
    });
}

function loadJoinRequests (clubID, callback) {
    var clubQuery =
            "SELECT ID, Name " +
            "FROM clubs " +
            "WHERE ID = ?",
        requestsQuery =
            "SELECT runners.First_Name, runners.Last_Name, runners.ID " +
            "FROM runners, joinrequests " +
            "WHERE joinrequests.Requester_ID = runners.ID AND joinrequests.Club_ID = ?";
    connection.query(clubQuery, clubID, function(err, rows) {
        if (err) {
            console.log("Error with query");
        }
        var club = rows;
        connection.query(requestsQuery, clubID, function(err, rows) {
            if (err) {
                console.log("Error with query");
            }
            var final = {
                club: club,
                requests: rows
            };
            callback(null, final);
        });
    });
}

function acceptJoinRequest (postDetails) {
    var acceptQuery =
            "UPDATE `runners` SET `Club_ID` = ? WHERE `runners`.`ID` = ?",
        deleteQuery =
            "DELETE FROM joinrequests WHERE joinrequests.Requester_ID = ?";

    connection.query(acceptQuery, [postDetails.club, postDetails.user], function(err) {
        if (err) {
            console.log("Error with update query");
        }
    });
    connection.query(deleteQuery, postDetails.user, function(err) {
        if (err) {
            console.log("Error with delete query");
        }
    });
}

function denyJoinRequest (postDetails) {
    var deleteQuery =
            "DELETE FROM joinrequests WHERE joinrequests.Club_ID = ? AND joinrequests.Requester_ID = ?";

    connection.query(deleteQuery, [postDetails.club, postDetails.user], function(err) {
        if (err) {
            console.log("Error with delete query");
        }
    });
}

function loadOnlyUserProfile (userID, callback) {
    var profileQuery =
            "SELECT `runners`.`ID`, `runners`.`First_Name`, `runners`.`Last_Name`, `runners`.`Gender`, `runners`.`Age`, `runners`.`Photo`, `runners`.`Bio`, `runners`.`Admin`, `clubs`.`Name` AS Club_Name, `runners`.`Club_ID` " +
            "FROM `runners`, `clubs`" +
            "WHERE `runners`.`Club_ID` = `clubs`.`ID` AND `runners`.`ID` =?";

    connection.query(profileQuery, userID, function(err, rows) {
        if (err) {
            console.log("Error with query");
            callback(err, null);
        }
        var profile = {
            profile: rows
        };
        //console.log(profile);
        callback(null, profile);
    });
}

function updateUser(postDetails) {
    var updateQuery =
        "UPDATE runners " +
        "SET First_Name = ?, Last_Name = ?, Gender = ?, Age = ?, Bio = ? " +
        "WHERE runners.ID = ?";

    connection.query(updateQuery, [postDetails.firstName, postDetails.lastName, postDetails.gender, postDetails.age, postDetails.bio, postDetails.userID], function(err) {
        if (err) {
            console.log("Error with query: update profile");
        }
    });
}

function loadClubList(callback) {
    var query = //SQL query to load Event ID, Name, and Date
        "SELECT ID, Name, Description, Address " + //Formats date as DD/MM/YYYY
        "FROM clubs";

    connection.query(query, function(err, rows) {
        if (err) {
            console.log("Error with query");
            callback(err, null);
        }
        var clubs = {
            clubs: rows
        };
        callback(null, clubs);
    });
}

function postNewEvent(postDetails) {
    var postQuery =
        "INSERT INTO `events` (`ID`, `Host_ID`, `Name`, `Location`, `Date`, `Start_Time`, `Description`) " +
        "VALUES (NULL, ?, ?, ?, ?, ?, ?)";

    connection.query(postQuery, [postDetails.hostClub, postDetails.name, postDetails.address, postDetails.date, postDetails.startTime, postDetails.description], function(err) {
        if (err) {
            console.log("Error with query - posting new event");
        }
    });
}

function postEventResult(postDetails) {
    var postQuery =
        "INSERT INTO `results` (`Event_ID`, `Runner_ID`, `Time`) " +
        "VALUES ( ?, ?, ?)";
    //console.log(postDetails);
    connection.query(postQuery, [postDetails.eventID, postDetails.userID, postDetails.resultTime], function(err) {
        if (err) {
            console.log("Error with query - posting result");
        }
    });
}

function getEventDetailsForUpdate(eventID, callback) {
    var detailsQuery = // Query for the event's details (name, date, location, etc.)
            "SELECT events.Name, DATE_FORMAT(events.Date,'%Y-%m-%d') AS Date, events.Location, events.Start_Time, events.Host_ID, events.Description, clubs.Name AS Host_Name " +
            "FROM events, clubs " +
            "WHERE events.Host_ID = clubs.ID AND events.ID = ?",
        clubsQuery =
            "SELECT ID, Name, Description, Address " +
            "FROM clubs" +
            "WHERE ID > 1";
    connection.query(detailsQuery, eventID, function(err, rows) {
        if (err) {
            console.log("Error with query for details");
            callback(err, null);
        }
        var details = rows;
        connection.query(clubsQuery, function (err, rows) {
            if (err) {
                console.log("Error with query for clubs");
                callback(err, null);
            }
            var final = {
                details: details,
                clubs: rows
            };
            callback(null, final);
        });
    });
}

function updateEvent(postDetails) {
    var updateQuery =
        "UPDATE `events` " +
        "SET `Host_ID` = ?, `Name` = ?, `Location` = ?, `Date` = ?, `Start_Time` = ?, `Description` = ? " +
        "WHERE `events`.`ID` = ?";

    //console.log(postDetails);

    connection.query(updateQuery, [postDetails.hostClub, postDetails.name, postDetails.address, postDetails.date, postDetails.startTime, postDetails.description, postDetails.eventID], function(err) {
        if (err) {
            console.log("Error with query: update event");
            console.log(err);
        }
    });
}

module.exports = {
    loadEventsList: loadEventsList,
    loadEventResults: loadEventResults,
    loadUser: loadUser,
    loadClub: loadClub,
    postClubWall: postClubWall,
    postNewUser: postNewUser,
    loadClubMembers: loadClubMembers,
    postJoinRequest: postJoinRequest,
    loadJoinRequests: loadJoinRequests,
    acceptJoinRequest: acceptJoinRequest,
    denyJoinRequest: denyJoinRequest,
    loadOnlyUserProfile: loadOnlyUserProfile,
    updateUser: updateUser,
    loadClubList: loadClubList,
    lastNewUser: lastNewUser,
    postNewClub: postNewClub,
    postNewEvent: postNewEvent,
    postEventResult: postEventResult,
    getEventDetailsForUpdate: getEventDetailsForUpdate,
    updateEvent: updateEvent
};