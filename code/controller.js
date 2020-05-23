'use strict';
var connection = require('./conn');
var out = require('./res');

var https = require('https');
const fetch = require('node-fetch');


exports.submitExam = function(req, res) {

    //examsheets sesuai models.json

    let data = (req.body.data);
    console.log("Berikut adalah id_exam yang disubmit : ", data[0].id_exam);
    for (var i = 0; i < data.length; i++) {
        let userId = data[i].id_user;
        let examId = data[i].id_exam;

        let sessionScore = [0,0,0,0,0,0];
        let totalScore = 0;

        for (let j = 0; j < data[i].answersheets.length; j++) {
            //iteratif answersheets
            
            let sessionId = data[i].answersheets[j].id_session;
            //console.log(data[i].answersheets[j].answers)
            for (let k in data[i].answersheets[j].answers) {
                //iteratif jawaban
                
                let sessionAnswer = data[i].answersheets[j];
                //console.log("jawaban " + k + " : " + sessionAnswer.answers[k]);
                //scoring
                if (sessionAnswer.answers[k] == true) {
                    sessionScore[j] += 1;
                } if (sessionAnswer.answers[k] == null) {
                    res.end;
                    throw ("ERROR: NULL values detected.");
                }
                
            }
            totalScore += sessionScore[j];
            //console.log("Score Session " + sessionId + " : " + sessionScore[j]);
        }
        totalScore /= 6;
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
            total_score: totalScore
        }

        let sql = 'INSERT INTO score SET ?'
        connection.query(sql, input, (err,results) => {
            if(err) throw err;
            console.log("Inserted 1 record successful!");
        })
    }
    out.sendResponse(200, "Examsheet submitted successfully!", data, res);
};


//RANKING
exports.rankings = function(req, res) {

    var dataFull = {
        'status': 200,
        'rankDetails' : [
        ]
    };
    let parsedData = {};


    let sql = 'SELECT * FROM score WHERE id_exam = ' + req.params.id_exam + " ORDER BY total_score DESC";
    let query = connection.query(sql, async (err, results) => {
        if(err) throw err;
        
        //iterasi per user
        for (let i=0; i < results.length; i++) {
            let rank = i+1;
            let userId = results[i].id_user
            let url = 'https://dummy.edukasystem.id/user/' + userId;
            let response = await fetch(url)
                .then(response => response.json())
            dataFull['rankDetails'].push({"rank" : rank, 'userDetails' : response.data.User});
            
        }
        console.log(dataFull);
        res.json(dataFull);
        res.end();
    });
};

exports.singleRank = function(req, res) {
    /*

    */

    let rank = 0;
    let userId = req.params.id_user
    //ini fetch SQL all of user's ranking
    let sql = 'SELECT * FROM score WHERE id_exam = ' + req.params.id_exam + " ORDER BY total_score DESC";
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;
        //printSQL(results);
        try {
            rank = indexUserId(results, userId) + 1;
            //console.log("berikut adalah rank userID " + userId + " dengan ranking: #" + rank);
        } finally {
            if(err) throw (err);
        };
        //console.log(results[rank] + "\nDiatas adalah hasil pencarian ranking dari " + userId);
    });
    

    // ini fetch userDetals: userDetails for 1 specified id_user
    let parsedData = {};
    let url = 'https://dummy.edukasystem.id/user/' + userId;
    https.get(url, function(response) {
        console.log("fetching data....", url, response.statusCode);
        response.on("data", function(data) {
            parsedData = JSON.parse(data);
            //respond
            out.singleRankSuccess(parsedData.data.User, rank, res);
        });
    });

    

};

function indexUserId(arr, elementToFind) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i].id_user == elementToFind) {
            return i;
        }
    } return null;
}

function printSQL(arr) {
    for (var i=0; i<arr.length; i++) {
        console.log("Berikut adalah row ke " + i + "\nBerikut adalah userID " + arr[i].id_user +"\n");
    } return null;
}