/**
 * Created by abhi on 29-03-2017.
 */

var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
//var mongoose = require('mongoose');

var utils = require('../Utils/Utils.js');
var stringProcess = require('../Utils/queryStringProcessor.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    // Code for using Mongoose. Didn't work.
    //mongoose.connect(utils.getMongoDBURI());
    //var db = mongoose.connection;
    // var result = null;
    /*db.on('error', console.error.bind(console, 'connection error:'));
     db.once('open', function() {
     /!*var schema = mongoose.Schema({ url: String, keyword: String, category: String});
     var datastore = mongoose.model('dataStore', schema,'datastore');
     datastore.find(function (err, results) {
     if (err) return console.error(err);
     console.log(results);
     result = results;
     });*!/
     });*/

    //Code using MongoDB library. Its working.

    var queryString = req.query.getQuery;
    var processedString = stringProcess.removeStopWords(queryString);

    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(utils.getMongoDBURI(), function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
            res.json({ message: 'Error in Data' });
        } else {
            var collection = db.collection('datastore');
            collection.find({'keyword': processedString.toUpperCase()}).toArray(function(e,docs){
                    if(e) {
                        console.log('Error while retrieving data. Error:', e);
                        res.json({ message: 'Error while retrieving data' });
                    }

                    res.json({ originalQuery : queryString, processedQueryString : processedString, response: docs });
                });
            db.close();
        }
    });
});

module.exports = router;
