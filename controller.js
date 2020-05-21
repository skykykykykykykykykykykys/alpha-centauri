'use strict';
var connection = require('./conn');
var response = require('./res');

var https = require('https');

// GRADER
/*
function parseSheets(data) {
    for (var i = 0; i < data.length; i++) {
        let userId = data[i].id_user;
        let examId = data[i].id_exam;

        let sessionScore = 0;

        console.log("User ID : " + userId," Exam ID : " + examId);
        for (var j = 0; j < data[i].answersheets.length; j++) {
            let sessionId = data[i].answersheets[j].id_session;
            for (var k in data[i]. answersheets[j].answers) {
                let answer = data[i].answersheets[j];
                //console.log("jawaban " + k + " : " + answer.answers[k]);
                //scoring
                if (answer.answers[k] == true) {
                    sessionScore += 1;
                }
            }
            console.log("Score Session " + sessionId + " : " + sessionScore);
        }
    }
}
*/


exports.submitExam = function(req, res) {

    let data = (req.body.data);
    //console.log(data[0].id_exam);
    for (var i = 0; i < data.length; i++) {
        let userId = data[i].id_user;
        let examId = data[i].id_exam;

        let sessionScore = [0,0,0,0,0,0,0,0,0,0];
        let totalScore = 0;

        console.log("User ID : " + userId," Exam ID : " + examId);
        for (var j = 0; j < data[i].answersheets.length; j++) {
            //iteratif answersheets
            let sessionId = data[i].answersheets[j].id_session;
            for (var k in data[i]. answersheets[j].answers) {
                //iteratif jawaban

                let answer = data[i].answersheets[j];
                //console.log("jawaban " + k + " : " + answer.answers[k]);
                //scoring
                if (answer.answers[k] == true) {
                    sessionScore[k] += 1;
                }
            }
            totalScore += sessionScore[k];
            console.log("Score Session " + sessionId + " : " + sessionScore[k]);
        }
        //masukkin ke database
        let input = {
            id_user: userId, 
            id_exam: examId, 
            ses1: sessionScore[0], 
            ses2: sessionScore[1], 
            ses3: sessionScore[2], 
            ses4: sessionScore[3], 
            ses5: sessionScore[4], 
            ses6: sessionScore[5], 
            ses7: sessionScore[6], 
            ses8: sessionScore[7], 
            ses9: sessionScore[8], 
            ses10: sessionScore[9], 
            total_score: totalScore
        }

        let sql = 'INSERT INTO score SET ?'
        connection.query(sql, input, (err,results) => {
            if(err) throw err;
            console.log("Inserted 1 record successful!");
        })
    }
    


    /*
    var values = [
        [$id_user, $id_exam, $ses1]
    ]
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
    */
};


//RANKING
exports.rankings = function(req, res) {
    /*
    GET ALL RANKING
    Asumsi dari database sudah di ascend dan udah ditotalin scorenya
    ngambil dari databasenya id_user, 

    Asumsi: Ranking cuman buat yg id_examnya sama. In this case, minta parameter exam yg mana.
    Outputnya keluar sesuai urutan ranking
    */



    let sql = 'SELECT * FROM score WHERE id_exam = ' + req.params.id_exam + " ORDER BY total_score ASC";
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;
        console.log("Berikut adalah id User pertama : " + results[0].id_user, results[0].id_exam, " Euy ini hasil SQL");
    });

    for (var i=0; i < results.length; i++) {
        //nyari per user
        let url = 'https://dummy.edukasystem.id/user/' + results[i].id_user;
        console.log("Berikut adalah URL untuk ngefetch userDetails", url);
        https.get(url, function(response) {
            console.log(url);
            console.log(response.statusCode);
            response.on("data", function(data) {
                const parseData = JSON.parse(data);
                console.log('Berikut adalah data lengkap mengenai User dengan id_user: ' + req.params.id, "\n", parseData);
                console.log(parseData.data.User.id_user);
            });
        });
        var dataFull = {
            'status': 200,
            'rankDetails' : [
                {
                    'rank' : rank,
                    'userDetails' : userDetails
                },
                {
                    'rank' : rank,
                    'userDetails' : userDetails
                }
            ]
        };

    }
    //TODO: GMN CARANYA append JSON OUTPUT SECARA ITERATIF
    /*
    var jsonStr = '{"theTeam":[{"teamId":"1","status":"pending"},{"teamId":"2","status":"member"},{"teamId":"3","status":"member"}]}';

    var obj = JSON.parse(jsonStr);
    obj['theTeam'].push({"teamId":"4","status":"pending"});
    jsonStr = JSON.stringify(obj);


    TODO:
        iterasi tiap results
        cek id_user yg muncul dari results[i],
        fetch id_user ke dummy.eduka
        
    */
    //TODO:


};

exports.singleRank = function(req, res) {
    /*

    */

    //ini fetch SQL all of user's ranking
    let sql = 'SELECT * FROM score WHERE id_exam = ' + req.params.id_exam + " ORDER BY total_score ASC";
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results[0].id_user, results[0].id_exam, " Euy ini hasil SQL");
    });
    //nyari ranking id_user
    let rank = indexUserId(results, req.params.id_user) + 1;
    console.log(results[indexUserId(results, req.params.id_user)] + "\n Diatas adalah hasil pencarian ranking dari " + req.params.id);

    // ini fetch userDetals: userDetails for 1 specified id_user
    let url = 'https://dummy.edukasystem.id/user/' + req.params.id_user;
    https.get(url, function(response) {
        console.log(url);
        console.log(response.statusCode);
        response.on("data", function(data) {
            const parseData = JSON.parse(data);
            console.log('Berikut adalah data lengkap mengenai User dengan id_user: ' + req.params.id, "\n", parseData);
            console.log(parseData.data.User.id_user);
        });
    });
    let detailUser = parseData.data.User;

    //respond
    sendResponse(detailUser, rank, res);

};

function indexUserId(arr, elementToFind) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i].id_user == elementToFind) {
            return i;
        }
    } return null;
}