var Datastore = require('nedb'),
db = {};
db.users = new Datastore({ filename: './db/users.db', autoload: true });
db.article = new Datastore({ filename: './db/article.db', autoload: true });
db.cat = new Datastore({ filename: './db/cat.db', autoload: true });



var users = function () {

  var loginUser = function (email, pass, cl) {

    db.users.find({ email: email, pass: pass }, function (err, docs) {
      var data = {};
      if (err) {
        data = {err: true,msg: err};
      } else {
        data = {err: false, data: docs[0]};
      }
      cl(data);
    });
  }

  var signupUser = function (name, email, pass, cl) {
    db.users.find({ email: email }, function (err, docs) {
      if (docs[0] && docs[0].hasOwnProperty('name')) {
        cl({err: true,msg: 'isEmail'});
      } else {
        db.users.insert({name: name, email: email, pass: pass }, function (err, newDoc) {
          var data = {};
          if (err) {
            data = {err: true,msg: err};
          } else {
            data = {err: false, data: newDoc};
          }
          cl(data);
        });
      }
    });


  }

  var addArticle = function (title, article, size, description, photo, user, cl) {
    db.article.insert({title: title, article: article, size: size, description: description, photo: photo, user: user, note: '', edit: false, accept: false}, function (err, newDoc) {
      var data = {};
      if (err) {
        data = {err: true,msg: err};
      } else {
        data = {err: false, data: newDoc};
      }
      cl(data);
    });
  }

  var getArticle = function (cl) {
    db.article.find({ accept: true }, function (err, docs) {
      var data = {};
      if (err) {
        data = {err: true,msg: err};
      } else {
        data = {err: false, data: docs};
      }
      cl(data);
    });
  }

  var getUsers = function (cl) {
    db.users.find({}, function (err, docs) {
      var data = {};
      if (err) {
        data = {err: true,msg: err};
      } else {
        data = {err: false, data: docs};
      }
      cl(data);
    });
  }

  var getArticleOne = function (id, cl) {
    db.article.find({ _id: id }, function (err, docs) {
      var data = {};
      if (err) {
        data = {err: true,msg: err};
      } else {
        data = {err: false, data: docs[0]};
      }
      cl(data);
    });
  }

  var getArticleMy = function (id, cl) {
    db.article.find({ "user._id": id }, function (err, docs) {
      var data = {};
      if (err) {
        data = {err: true,msg: err};
      } else {
        data = {err: false, data: docs};
      }
      cl(data);
    });
  }

  var getAllArticle = function (cl) {
    db.article.find({}, function (err, docs) {
      var data = {};
      if (err) {
        data = {err: true,msg: err};
      } else {
        data = {err: false, data: docs};
      }
      cl(data);
    });
  }

  var upArticle = function (art, cl) {
    art.accept = true;
    art.date = new Date();
    db.article.update({_id: art._id}, art, function (err, docs) {
      var data = {};
      if (err) {
        data = {err: true,msg: err};
      } else {
        data = {err: false, data: docs[0]};
      }
      cl(data);
    });
  }

  var rmArticle = function (id, cl) {
    db.article.remove({ _id: id }, function (err, docs) {
      var data = {};
      if (err) {
        data = {err: true,msg: err};
      } else {
        data = {err: false, data: docs[0]};
      }
      cl(data);
    });
  }

  var getAllUser = function (cl) {
    db.users.find({}, function (err, docs) {
      var data = {};
      if (err) {
        data = {err: true,msg: err};
      } else {
        data = {err: false, data: docs};
      }
      cl(data);
    });
  }

  var rmUser = function (id, cl) {
    db.users.remove({ _id: id }, function (err, docs) {
      var data = {};
      if (err) {
        data = {err: true,msg: err};
      } else {
        data = {err: false, data: docs[0]};
      }
      cl(data);
    });
  }

  return {
    loginUser: loginUser,
    signupUser: signupUser,
    addArticle: addArticle,
    getArticle: getArticle,
    getUsers: getUsers,
    getArticleOne: getArticleOne,
    getArticleMy: getArticleMy,
    getAllArticle: getAllArticle,
    upArticle: upArticle,
    rmArticle: rmArticle,
    getAllUser: getAllUser,
    rmUser: rmUser
  };
}

module.exports = new users();
