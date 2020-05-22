'use strict';

module.exports = function(app) {
    var todoList = require('./controller');

    app.route('/grader')
        .post(todoList.submitExam);

    app.route('/ranking/:id_exam')
        .get(todoList.rankings);
    app.route('/ranking/:id_exam/:id_user')
        .get(todoList.singleRank);

    app.route('/public')
        .get()
};
