var express = require('express');
var router = express.Router();
var http = require("http");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/rss-retrieve/:rssurl', function(req, res) {
  res.set('Content-Type', 'text/html');
  var target = "http://rss.cnn.com/services/podcasting/" + req.params.rssurl + "/rss";
  http.get(target, (resu) => {
    var finalRes = "";
    resu.on("data", function(chunk){
      //console.log("On chunking");
      finalRes += chunk;
    });
    resu.on("end", function(){
      console.log(finalRes);
      res.send(finalRes);
    });
    // consume response body
  }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
    });

});

module.exports = router;
