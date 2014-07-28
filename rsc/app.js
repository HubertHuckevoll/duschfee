"use strict";

var app = angular.module('duschfee', ["ngRoute"], function($routeProvider, $locationProvider) {

  $routeProvider.when('/', {
    templateUrl: 'timer.html',
    controller: 'timerCtrl'
  });

  $routeProvider.when('/prefs', {
    templateUrl: 'prefs.html',
    controller: 'prefsCtrl'
  });
});

app.controller('appCtrl', function ($rootScope, $scope) {

  $rootScope.prefDefaults = {};
  $rootScope.prefDefaults.timers = [
   {desc: 'Einweichen', dur: 2},
   {desc: 'Einseifen, Abspülen', dur: 2},
   {desc: 'Haare waschen und ausspülen', dur: 3},
   {desc: 'Wir kommen zum Ende, kalt duschen', dur: 1}
  /*
   {desc: 'Einweichen', dur: .1},
   {desc: 'Einseifen, Abspülen', dur: .1},
   {desc: 'Haare waschen und ausspülen', dur: .1},
   {desc: 'Wir kommen zum Ende, kalt duschen', dur: .1}
  */
  ];
  $rootScope.prefDefaults.startOnLaunch = false;

  $rootScope.prefs = {};

  $rootScope.isRunning = false;

  $rootScope.isFirstLaunch = true;

  var prefs = JSON.parse(localStorage.getItem('duschfee'));
  if (prefs != undefined) {
    $rootScope.prefs = prefs;
  }
  else {
    $rootScope.prefs = angular.copy($rootScope.prefDefaults);
  }

});

app.controller('prefsCtrl', function ($rootScope, $scope) {

   $scope.addTimer = function() {
     $rootScope.prefs.timers.push({desc: '', dur: 1});
   };

   $scope.rmvTimer = function(idx) {
     $rootScope.prefs.timers.splice(idx, 1);
   };

   $scope.$on('$routeChangeStart', function() {
     localStorage.setItem('duschfee', JSON.stringify($rootScope.prefs));
   });

   $scope.resetPrefs = function() {
     $rootScope.prefs = angular.copy($rootScope.prefDefaults);
   };

});

app.controller('timerCtrl', function ($rootScope, $scope, $timeout, dAudio, speech) {

  $scope.ticks = null;
  $scope.curTicks = null;
  $scope.tid = null;
  $scope.idx = -1;

  $scope.min = '00';
  $scope.sec = '00';
  $scope.phase = '';
  $scope.buttonLabel = 'Start';
  $scope.buttonClass = 'btn-success';

  $scope.startStop = function() {
    if ($scope.tid != null)
    { // Stop
      $scope.stop();
    }
    else
    { // Start
      $scope.start();
    }
  };

  $scope.start = function()
  {
    document.querySelector('#audioPlayer').play();

    $rootScope.prefs.timers.push({'desc': 'Raus!', dur: 15}); // append last phase
    $scope.buttonLabel = 'Stop';
    $scope.buttonClass = 'btn-danger';
    $rootScope.isRunning = true;
    $scope.tick();
  };

  $scope.stop = function()
  {
    dAudio.stop();
    $timeout.cancel($scope.tid);
    $scope.tid = null;
    $scope.curTicks = null;
    $scope.ticks = null;
    $scope.idx = -1;
    $scope.min = '00';
    $scope.sec = '00';
    $scope.phase = '';
    $scope.buttonLabel = 'Start';
    $scope.buttonClass = 'btn-success';
    $rootScope.isRunning = false;
    $rootScope.prefs.timers.pop();
  };

  $scope.tick = function() {
    if ($scope.curTicks < $scope.ticks) {
      $scope.curTicks = $scope.curTicks + 1000;
      $scope.tid = $timeout($scope.tick, 1000);
    } else {
      if ($scope.idx < ($rootScope.prefs.timers.length-1)) {
        if ($scope.tid != null) $timeout.cancel($scope.tid);
        $scope.idx++;
        $scope.ticks = $rootScope.prefs.timers[$scope.idx].dur * 60 * 1000;
        $scope.curTicks = 0;
        $scope.tid = $timeout($scope.tick, 0);
      } else {
        $scope.startStop(); // stop
      }
    }
  };

  $scope.$watch('curTicks', function() {
    var ticks = $scope.ticks - $scope.curTicks;
    var m = parseInt(ticks / 1000 / 60);
    var s = parseInt((ticks / 1000) - (m * 60));

    if (m.toString().length < 2) m = "0" + m.toString();
    if (s.toString().length < 2) s = "0" + s.toString();

    $scope.min = m;
    $scope.sec = s;
  });

  $scope.$watch('idx', function() {
    if ($scope.idx != -1) {
      if ($scope.idx < ($rootScope.prefs.timers.length-1)) {
        var s = $rootScope.prefs.timers[$scope.idx].desc;
        $scope.phase = s;
        speech.speak(s);
      } else {
        dAudio.play();
      }
    }
  });

  $scope.orientationChanged = function(ev) {
    var lage = parseInt(ev.beta);
    if (lage > 150) {
      if ($scope.tid != null) {
        $scope.startStop();
        $scope.$apply();
      }
    }
  };

  $scope.$on('$routeChangeStart', function() {
    $rootScope.isFirstLaunch = false;
    if ($scope.tid != null) {
      $scope.stop();
    }
  });

  $rootScope.$watch('prefs', function(newVal, oldVal) {
    if ((newVal.startOnLaunch == true) && ($rootScope.isFirstLaunch == true)) {
      $rootScope.isFirstLaunch = false;
      $scope.start();
    }
  });

  // Device orientation
  window.addEventListener('deviceorientation', $scope.orientationChanged, false);

  if ($rootScope.startOnLaunch == true) {
    //$timeout($scope.start, 3000);
  }
});
