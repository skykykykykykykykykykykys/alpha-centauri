/**
 * Cara maju:
 *      User login
 *      Masukin exam utk sesi 1
 *      Proses nilai sesi 1
 *          masukin score ke SQL
 *      dst.
 *      Proses examsheet:
 *          Totalin nilai
 *          Reference ke user
 *      
 *      Lempar ke ranker
 *      Proses Ranking
 *      masukkin si user +score ke ranking (karena tanpa store si ranking, berarti bakal proses terus)
 * 
 * 
 * rute yg dibikin:
 * 
 *  /grader
 *  POST examsheets:
 *      Nerima examsheets
 *      isinya: id_exam, id_user, id_session (6 sesi), dan 10 jawaban nomor tiap sesi
 *  GET scores?:
 *      ngambil scorenya (keknya per event aja dlu)
 *      minta event id
 *  /ranking
 *  rankingnya per event dlu
 *  karena gk di store, harus fetch terus
 *  GET 1 rank
 *  GET ALL RANK
 * 
 * 
 * 
 * 
 * 
 * 
 */

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    controller = require('./controller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes');
routes(app);

app.listen(port);
console.log('Eduka Ranking and Grader Server started on ' + port);




