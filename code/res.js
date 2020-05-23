exports.sendResponse = function(status, message, submittedData, res) {
    var data = {
        'status' : status,
        'message' : message,
        'submittedData' : submittedData
    };
    res.json(data);
    res.end();
};



exports.singleRankSuccess = function (userDetails, rank, res) {
    var data = {
        'status': 200,
        'rank' : rank,
        'userDetails': userDetails
    };
    res.json(data);
    console.log("GET singleRank success\n", data);
    res.end();
}
