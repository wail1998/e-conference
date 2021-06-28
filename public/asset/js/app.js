var apiUrl = 'https://wail-e-conference.herokuapp.com';

angular.module('RDapp', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngMdIcons','ngFileUpload'])
.config(function($routeProvider, $mdThemingProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "asset/template/home.html",
    controller: 'home'
  })
  .when("/login", {
    templateUrl : "asset/template/login.html",
    controller: 'login'
  })
  .when("/compte", {
    templateUrl : "asset/template/compte.html",
    controller: 'compte'
  })
  .when("/article/:id", {
    templateUrl : "asset/template/lireArt.html",
    controller: 'lireart'
  })
  .when("/admin", {
    templateUrl : "asset/template/admin.html",
    controller: 'admin'
  });

  $locationProvider.html5Mode(true).hashPrefix('!');

  $mdThemingProvider.theme('altTheme')
       .primaryPalette('grey',{'default': '900'})
       .accentPalette('grey',{'default': '700'})
       .dark();
  $mdThemingProvider.theme('default');
  $mdThemingProvider.setDefaultTheme('default');
  $mdThemingProvider.alwaysWatchTheme(true);
})

.run(function ($rootScope, $location, $window) {
  $rootScope.$on("$routeChangeSuccess", function () {
    if ($window.localStorage.hasOwnProperty('user')) {
      $rootScope.islogin = true;
      $rootScope.user = JSON.parse($window.localStorage.getItem('user'));

      //$location.path('compte');
    } else {
      $rootScope.islogin = false;
      $rootScope.user = false;
    }
    $rootScope.isArticle = false;
    if ($location.path().split('/')[1] == "article") {
      $rootScope.isArticle = true;
    } else {
      $rootScope.isArticle = false;
    }
  });

})

.controller('toolbar', function ($scope, $http, $location, $rootScope, $window, $mdTheming, $mdDialog, Upload) {
  $rootScope.search = '';
  $scope.$on("$routeChangeSuccess", function () {
    if ($rootScope.islogin) {
      $scope.BTlogin = false;
    } else {
      $scope.BTlogin = true;
    }
  });

  if ($rootScope.islogin) {
    $scope.BTlogin = false;
  } else {
    $scope.BTlogin = true;
  }

  $scope.GoLogin = function () {
    $location.path('/login');
  };

  $scope.GoHome = function () {
    $location.path('/');
  };

  $scope.logout = function () {
    $window.localStorage.removeItem('user');
    $window.location.reload();
  };
  /* dark button */

  $rootScope.rdynamicTheme = function () {
    if ($rootScope.dynamicTheme == 'default') {
      $rootScope.dynamicTheme = 'altTheme';
      /*  code jquery*/
      $('.bdflt').addClass('bdark');
      $('.btab').css('background-color', '#000');
      $('.statu').addClass('bdark btxt');
      $('.tbttl').addClass('btxt');
    } else {
      $rootScope.dynamicTheme = 'default';
      $('.bdflt').removeClass('bdark');
      $('.btab').css('background-color', '#fff');
      $('.statu').removeClass('bdark btxt');
      $('.tbttl').removeClass('btxt');
    }
  };
//fenetre ajouter article
  /*$scope.addArt = function (ev) {
    $mdDialog.show({
      contentElement: '#myDialogArt',
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application to prevent interaction outside of dialog
      parent: angular.element(document.body),
      targetEvent: ev,

      clickOutsideToClose: false
    });
  };*/
//fenetre ajouter article
  $scope.addArt = function (ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'asset/template/artTmp.html',
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application to prevent interaction outside of dialog
      parent: angular.element(document.body),
      targetEvent: ev,
      fullscreen: true,
      clickOutsideToClose: true
    }).then(function (answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function () {
      $scope.status = 'You cancelled the dialog.';
    });
  };
//les buttons d'ajouter un article
  function DialogController($scope, $mdDialog) {
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
      $mdDialog.hide(answer);
    };


    $scope.addCls = function (ev) {
      $mdDialog.hide(ev);
    };

    $scope.tabslct = 0;
    $scope.thrdstp = false;

    $scope.btName = 'Suivant';
    $scope.next = function () {
      if ($scope.tabslct == 2) {
        $scope.tabslct = 0;
      }else if ($scope.tabslct == 1) {
        $scope.thrdstp = true;
        $scope.tabslct = $scope.tabslct + 1;
      }else {
        $scope.tabslct = $scope.tabslct + 1;
      }
    }

    $scope.user = {};

    $scope.svArt = function () {

      Upload.upload({
          url: apiUrl+'/users/addArticle',
          data: {
            title: $scope.user.title,
            article: $scope.user.pdf,
            size: $scope.user.pdfSize,
            description: $scope.user.desc,
            photo: $( '#artImage' )[0].files[0],
            user: $rootScope.user
          }
      }).then(function (resp) {
        $scope.cancel();
      });



    }

  };

  $scope.ifUpImg = false;

  $scope.gc = function () {
    $location.path('/compte');
  }




  // upload on file select or drop
   $scope.upload = function (file) {
     var uid = $rootScope.user._id;
       Upload.upload({
           url: apiUrl+'/users/upPDF',
           data: {file: file, 'uid': uid}
       }).then(function (resp) {
         $scope.user.pdf = resp.data.data;
         $scope.user.pdfSize = file.size;
       }, function (resp) {
           console.log('Error status: ' + resp.status);
       }, function (evt) {
           var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           $scope.progressPercentage = progressPercentage;
           if ($scope.progressPercentage == 100) {
             $scope.upEnd = true;
           }
       });
   };
//remis tout a default
   $scope.startUp = false;
   $scope.upEnd = false;
   $scope.upPDF = function () {
     if ($scope.uppdf) {console.log('if ok');
       $scope.upload($scope.uppdf);
       $scope.startUp = true;
     }else {
       console.log('if no');
     }
   };

})

//login
.controller('login', function ($scope,$http,$location,$mdDialog,$window) {
  $scope.user = {};
  $scope.newUser = {};
  $scope.login = function (ev) {
    $http.post(apiUrl+'/users/login', {email: $scope.user.email ,pass: $scope.user.pass}).then(function (rsp) {
      var data = rsp.data;
      if (data.mod) {
        $window.localStorage.setItem('user', JSON.stringify(data.data) );
        $location.path('compte');
      } else {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title("Désolé, quelque chose s'est mal passé.")
            .textContent("L’adresse e-mail ou Mot de passe que vous avez saisi(e) n’est pas associé(e) à un compte")
            .ariaLabel('Alert Dialog')
            .ok('OK')
            .targetEvent(ev)
        );
      }
    });
  };
//creer un compte
  $scope.newUser = function (ev) {
    $mdDialog.show({
      contentElement: '#myDialog',
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application to prevent interaction outside of dialog
      parent: angular.element(document.body),
      targetEvent: ev,
      fullscreen: true,
      clickOutsideToClose: false
    });
  };

  $scope.close = function (ev) {
    $mdDialog.hide(ev)
  };

  $scope.isEmail = false;
//verifier si email ets deja utilisé
  $scope.signup = function (ev) {
    $http.post(apiUrl+'/users/signup', {name: $scope.newUser.uname ,email: $scope.newUser.email ,pass: $scope.newUser.pass}).then(function (rsp) {
      var data = rsp.data;
      if (data.mod) {
        $location.path('compte');
      } else {
        $scope.isEmail = true;
      }
    });
  };


})

.controller('home', function ($rootScope, $scope,$http,$location,$mdDialog) {
  $rootScope.search = '';
  $scope.articles = [];
  $http.post(apiUrl+'/users/home')
  .then(function (data) {
    $scope.articles = data.data.data;
  });

  $scope.users = [];
  $http.post(apiUrl+'/users/users')
  .then(function (data) {
    $scope.users = data.data.data;
  });

  $scope.lire = function(id) {
    $location.path('article/'+id);
  }
})

.controller('compte', function ($rootScope,$scope,$http,$location,$mdDialog) {
  $scope.$on("$routeChangeSuccess", function () {
    if (!$rootScope.islogin) {
      $location.path('login');
    }
  });

  $scope.selectedTab = 0;

  $scope.changeTab = function(num) {
        $scope.selectedTab = num;
  };
})

.controller('lireart', function ($rootScope,$scope, $routeParams, $http) {
  $http.post(apiUrl+'/users/lire',{id: $routeParams.id})
  .then(function(resp) {
    $scope.article = resp.data.data;
    $scope.pdfUrl = 'http://localhost/pdf/'+$scope.article.article+'.pdf';
    $('.artPhoto').css({
      'background': 'url(http://localhost/photo/'+resp.data.data.photo+')',
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    });
    $rootScope.article = $scope.article;
  });
})

.controller('ListCtrl', function ($rootScope,$scope,$http,$location) {
  $scope.artList = [];
  $http.post(apiUrl+'/users/myart', {id: $rootScope.user._id})
  .then(function(resp) {
    function formatSizeUnits(bytes)
    {
        if ( ( bytes >> 30 ) & 0x3FF )
            bytes = ( bytes >>> 30 ) + ' GB' ;
        else if ( ( bytes >> 20 ) & 0x3FF )
            bytes = ( bytes >>> 20 ) + ' MB' ;
        else if ( ( bytes >> 10 ) & 0x3FF )
            bytes = ( bytes >>> 10 ) + ' KB' ;
        else if ( ( bytes >> 1 ) & 0x3FF )
            bytes = ( bytes >>> 1 ) + ' Bytes' ;
        else
            bytes = bytes + 'Byte' ;
        return bytes ;
    }

    $scope.artAcs = 0;
    $scope.artPtn = 0;

    for (let i in resp.data.data) {
      $scope.artList.push({
        name: resp.data.data[i].title,
        id: resp.data.data[i]._id,
        state: resp.data.data[i].accept,
        size: formatSizeUnits(resp.data.data[i].size)
      });

      if (resp.data.data[i].accept) {
        $scope.artAcs = $scope.artAcs + 1;
      }else{
        $scope.artPtn = $scope.artPtn + 1;
      }
    }


  });
  $scope.artLire = function(stat, id) {
    if (stat) {
      $location.path('/article/'+id);
    }
  };
})

.controller('admin', function ($rootScope,$scope,$http,$mdToast,$window) {
  $scope.admin = {}; /*{name: 'admin',pass:'admin'};*/
  $scope.admin.islogin = false;
  $scope.admin.erlogin = false;

  $scope.adLogin = function() {
    if ($scope.admin.name == 'admin' && $scope.admin.pass == 'admin') {
      $scope.admin.islogin = true;
    } else {
      $scope.admin.erlogin = true;
      $mdToast.show(
        $mdToast.simple()
        .textContent('Admin name or password is Incorrect!')
        .position('top right')
        .hideDelay(3000)
      );
    }

  };

  $scope.adArt = [];
  $http.post(apiUrl+'/users/allart', {id: $rootScope.user._id})
  .then(function(resp) {
    $scope.adArt = resp.data.data;
  });

  $http.post(apiUrl+'/users/alluser', {id: $rootScope.user._id})
  .then(function(resp) {
    $scope.adUsers = resp.data.data;
  });

  $scope.inArticle = true;
  $scope.inUser = false;

  $scope.isArticle = function() {
    $scope.inArticle = true;
    $scope.inUser = false;
  };
  $scope.isUser = function() {
    $scope.inArticle = false;
    $scope.inUser = true;
  };

  $scope.formatSize = function(pdfSize) {
    function formatSizeUnits(bytes)
    {
        if ( ( bytes >> 30 ) & 0x3FF )
            bytes = ( bytes >>> 30 ) + ' GB' ;
        else if ( ( bytes >> 20 ) & 0x3FF )
            bytes = ( bytes >>> 20 ) + ' MB' ;
        else if ( ( bytes >> 10 ) & 0x3FF )
            bytes = ( bytes >>> 10 ) + ' KB' ;
        else if ( ( bytes >> 1 ) & 0x3FF )
            bytes = ( bytes >>> 1 ) + ' Bytes' ;
        else
            bytes = bytes + 'Byte' ;
        return bytes ;
    };

    return formatSizeUnits(pdfSize);
  };

  $scope.goArt = function (id) {
    $window.open('article/'+id, '_blank');
  }

  $scope.accept = function(art, index) {
    $http.post(apiUrl+'/users/updateart', {art:art})
    .then(function(resp) {
      $scope.adArt[index].accept = true;
    });
  };

  $scope.delete = function(id, index) {console.log(id);
    $http.post(apiUrl+'/users/deleteart', {id: id})
    .then(function(resp) {
      $scope.adArt = $scope.adArt.filter(function(el) { return el._id != id; });
    });
  };

  $scope.userDelete = function(id, index) {console.log(id);
    $http.post(apiUrl+'/users/deleteuser', {id: id})
    .then(function(resp) {
      $scope.adUsers = $scope.adUsers.filter(function(el) { return el._id != id; });
    });
  };
})

.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.on('change', onChangeHandler);
      element.on('$destroy', function() {
        element.off();
      });
    }
  };
})

.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])

.directive('pdf', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var url = scope.$eval(attrs.src);
            element.replaceWith('<object type="application/pdf" data="' + url + '" style="min-height: 100%;width:100%"></object>');
        }
    };
})

.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);
