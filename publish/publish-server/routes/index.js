var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.post('/', function(req, res) {
  req.on('data', data => {
    console.log(data);
  })
  // fs.writeFileSync(`../server/public/${req.query.filename}`, JSON.stringify(req.body));
  // res.send('hello');
});

module.exports = router;
