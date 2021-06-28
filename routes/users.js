var express = require('express');
var crypto = require('crypto');
var db = require('../db/sql.js');
var router = express.Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var fs = require('fs');
var path = require('path');

// Requires controller
var FileUploadController = require('./FileUploadController.js');


/* GET users listing. */
router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var pass = req.body.pass;
  db.loginUser(email, pass, function (val) {
    if (val.data && val.data.hasOwnProperty('name')) {
      delete val.data.pass;
      res.json({mod: true, data: val.data});
    } else {
      res.json({mod: false, data: 'email or pass error'});
    }
  });

});

router.post('/signup', function(req, res, next) {
  var email = req.body.email;
  var pass = req.body.pass;
  var name = req.body.name;
  db.signupUser(name, email, pass, function (val) {
    if (val.data && val.data.hasOwnProperty('name')) {
      delete val.data.pass;
      res.json({mod: true, data: val.data});
    } else {
      res.json({mod: false, data: val.msg});
    }
  });
});

router.post('/addArticle', multipartyMiddleware, function(req, res, next) {
  var title = req.body.title;
  var article = req.body.article;
  var size = req.body.size;
  var description = req.body.description;
  var user = req.body.user;
  var file = req.files.photo;

  var tid = (new Date().getTime()).toString();
  var imgEx = (file.name).split('.');
  var photo = tid+'_image'+'.'+imgEx[imgEx.length - 1];
 

  // copy the data from the req.files.file.path and paste it to file.path
  fs.readFile(req.files.photo.path, function (err, data) {console.log(req.files.photo.path);
     // set the correct path for the file not the temporary one from the API:
    file.name = photo;
    file.path = path.join(__dirname, '../upload/photo/' + file.name);
    // copy the data from the req.files.file.path and paste it to file.path
    fs.writeFile(file.path, data, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('ok');
      }
    });
  });

  
  db.addArticle(title, article, size, description, photo, user, function (val) {
    if (val.data && val.data.hasOwnProperty('title')) {
      res.json({mod: true, data: val.data});
    } else {
      res.json({mod: false, data: 'addArticle error'});
    }
  });
});

router.post('/upPDF', multipartyMiddleware, FileUploadController.uploadFile);

/*



*/


router.post('/home', function(req, res, next) {
  db.getArticle(function (val) {
    res.json({mod: true, data: val.data});
  });
});

router.post('/users', function(req, res, next) {
  db.getUsers(function (val) {
    res.json({mod: true, data: val.data});
  });
});

router.post('/lire', function(req, res, next) {
  db.getArticleOne(req.body.id, function (val) {
    res.json({mod: true, data: val.data});
  });
});

router.post('/myart', function(req, res, next) {
  db.getArticleMy(req.body.id, function (val) {
    res.json({mod: true, data: val.data});
  });
});

router.post('/allart', function(req, res, next) {
  db.getAllArticle(function (val) {
    res.json({mod: true, data: val.data});
  });
});

router.post('/updateart', function(req, res, next) {
  db.upArticle(req.body.art, function (val) {
    res.json({mod: true, data: val.data});
  });
});

router.post('/deleteart', function(req, res, next) {
  db.rmArticle(req.body.id, function (val) {
    res.json({mod: true, data: val.data});
  });
});

router.post('/alluser', function(req, res, next) {
  db.getAllUser(function (val) {
    res.json({mod: true, data: val.data});
  });
});

router.post('/deleteuser', function(req, res, next) {
  db.rmUser(req.body.id, function (val) {
    res.json({mod: true, data: val.data});
  });
});


module.exports = router;
