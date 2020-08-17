var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
  fs.writeFileSync(`../server/public/${req.query.filename}`, 'hello world!');
  res.send('hello');
});

module.exports = router;
