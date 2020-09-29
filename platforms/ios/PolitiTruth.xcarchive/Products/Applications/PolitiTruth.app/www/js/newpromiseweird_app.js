// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'startegetr' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngStorage', 'starter.services', 'ionic.ion.imageCacheFactory', 'ngAnimate', 'ionic.contrib.ui.tinderCards2', 'ngCordova'])
  
.config(function($ionicConfigProvider) {

    $ionicConfigProvider.views.transition('none'); //removes all transitions
if (navigator.appVersion.indexOf("Android") > 0) {
$ionicConfigProvider.scrolling.jsScrolling(false); //supposed to help android performance?
}


})


  .run(function ($ionicPlatform, $ImageCacheFactory, $localStorage, Politifact) {



if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1. 
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}


    if (typeof $localStorage.newstories == 'undefined') {
      $localStorage.newstories = [];
    }

    if (typeof $localStorage.done == 'undefined') {
      $localStorage.done = [];
    }
/**/
    //A cache to preload some canonical photos from new stories
    startcache = [];
    for (i = 0; i < $localStorage.newstories.length; i++) {
      if (!$localStorage.done.includes(i) && !startcache.includes($localStorage.newstories[i].speaker.canonical_photo)) {
        startcache.push($localStorage.newstories[i].speaker.canonical_photo);
      }
      if (startcache.length > 20) { 
        break; 
      }
    }

    //archive from service exposed in politifact.js preload all the canonical photos from archives 
    for (i = archive.length - 1; i > archive.length - 10; i--) {
      if (!$localStorage.done.includes(i) && !startcache.includes(archive[i].speaker.canonical_photo)) {
        startcache.push(archive[i].speaker.canonical_photo);
      }
    }

    //send these photos to the $ImageCacheFactory
    $ImageCacheFactory.Cache(startcache).then(function () {
      //alert("preload start! "+startcache.length);
    });

    /* */
    $ImageCacheFactory.Cache([
            "img/tom_ruling_false.gif",
            "img/tom_ruling_mostlyfalse.gif",
            "img/tom_ruling_halftrue.gif",
            "img/tom_ruling_mostlytrue.gif",
            "img/tom_ruling_pantsonfire!.gif",
            "img/tom_ruling_true.gif"
        ]);
   
    /**/

    /////////
    //Caching and preloading ends
    /////////


    //Keyboard and Status bar stuff
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        //StatusBar.styleDefault();
        StatusBar.overlaysWebView(true);
       // StatusBar.style(1); //Light
      }

    });
  })

.animation(".fade", function($timeout) {
    return {
      leave: function(el, done) {
        el[0].style.opacity = 0;
        $timeout(done, 700);
      }
    };
  })

  .directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
      scope.$watch(
        function (scope) {
          // watch the 'compile' expression for changes
          return scope.$eval(attrs.compile);
        },
        function (value) {
          // when the 'compile' expression changes
          // assign it into the current DOM
          element.html(value);

          // compile the new DOM and link it to the current
          // scope.
          // NOTE: we only compile .childNodes so that
          // we don't get into infinite loop compiling ourselves
          $compile(element.contents())(scope);
        }
      );
    };
  }])

  //A simple directive that resizes the element it is applied to to the (window height - 18px). (18px is the margin-top of the ionic container)
  .directive('resizeMax', function($window){
    return {
      restrict: "A",
      link: function(scope, el, attr){
        el.ready(function(){
          el.css("height",($window.innerHeight-18)+"px");
        });
      }
    }
  })


  .controller("AppCtrl", function ($scope, $http, $localStorage, Politifact, $window, $ionicScrollDelegate, $ionicModal, $ionicPopup, $ImageCacheFactory,$ionicPlatform,$cordovaVibration, $timeout) {
    $scope.Math = Math;
    $scope.prevcorr = [];
    BetweenSummaries=5;
    $scope.firstopen=false;
    $scope.nodata=false;



   // alert(JSON.stringify($localStorage.newstories));

//console.log(JSON.stringify($localStorage.newstories))
/*
    $scope.iospadding=true;

    if ($scope.iospadding){
    	$scope.paddingtop=1000+'px' // 18
    }else{
    	$scope.paddingtop=0;
    }
*/

//$localStorage.$reset() //()()()

/**/


 


   
if (typeof $localStorage.ad == 'undefined'){
  $localStorage.ad=0;
} 

$scope.lastphoto="img/bckg.jpg";

if (typeof $localStorage.lastphoto == 'undefined'){
  $localStorage.lastphoto="img/bckg.jpg"
} 

if (typeof $localStorage.record !== 'undefined'){
$scope.prevper=$localStorage.record[0]/$localStorage.record[1];
}
    //Popup to reset game
    
    $scope.resetgame = function () {
      //popup are you sure? 
      var confirmPopup = $ionicPopup.confirm({
        title: 'Reset Saved Data?',
        subTitle: 'This will wipe your score and let you re-answer previously guessed statements.'
      });

      confirmPopup.then(function (res) {
        if (res) {
          $localStorage.record = [0, 0];
          $localStorage.done = [];
          $scope.newquestion();
          $scope.closeModalmenu();
        }
      });
    }


    //Code for tinder-style swipe
    $scope.onTouch=function(){
      // console.log("touched");
    }
    $scope.onRelease=function(){
      // console.log("released");
    }
    $scope.cardDestroyed=function(){      
      // console.log("destroyed");
    }
    $scope.resurrectCard=function(){
      // console.log("Resurrecting dead card.");
      if (typeof document.getElementsByTagName('td-card')[0]){return}
      


      document.getElementsByTagName('td-card')[0].style.transform="";
      document.getElementsByTagName('td-card')[0].style.transition="";
      document.getElementsByTagName('td-card')[0].style.transitionDelay="";
      document.getElementsByTagName('td-card')[0].style.transitionDuration="";
      document.getElementsByTagName('td-card')[0].style.transitionProperty="";
      document.getElementsByTagName('td-card')[0].style.transitionTimingFunction="";

      document.getElementsByClassName('no-text')[0].style.opacity=0;
      document.getElementsByClassName('yes-text')[0].style.opacity=0;
    }

    $scope.cardSwipedLeft=function(){
      $scope.guess(false);
    }
    $scope.cardSwipedRight=function(){
      $scope.guess(true);
    }


    
    //Get a new question to show
    $scope.getNewQuestion=function(){

if ($scope.prevcorr.length==5){
  $scope.openModalpop();
          return}

      $ionicScrollDelegate.scrollTop();

	$scope.guessmade = false;
      $scope.newquestion();
      

      //Now, bring the recently destroyed card back to life.
      $scope.resurrectCard();

      
    }
    //Code for tinder-style swipe ends


    //Links to other projects
    $scope.synonymy = function () {
      if (navigator.appVersion.indexOf("Android") > 0) {
        $window.open("http://play.google.com/store/apps/details?id=air.com.jarvisfilms.synonymylite");
      } else {
        $window.open('http://itunes.apple.com/us/app/synonymy-lite/id938998017?ls=1&mt=8', '_system', 'location=yes');
      }
    }

    $scope.cinq = function () {
      $window.open('http://www.cinqmarsmedia.com', '_system');
    }

    $scope.pf = function () {
      $window.open('http://www.phoneflare.com', '_system');
    }

     $scope.politimember = function () {
      $window.open('http://membership.politifact.com/', '_system');
    }

     $scope.read = function () {
      $window.open('https://www.cinqmarsmedia.com/politifact/readmore.html', '_system');
    }

     $scope.author = function () {
      $window.open('https://www.cinqmarsmedia.com/politifact/author.html', '_system');
    }

     $scope.politiemail = function () {
      $window.open('http://www.politifact.us13.list-manage.com/subscribe/post?u=7fcd21cd74d3867be10c01899&amp;id=35b7b8b717', '_system');
    }

     $scope.politifacturl = function () {
      $window.open('http://www.politifact.com', '_system');
    }


    $scope.birds = function () {
      $window.open('https://www.youtube.com/embed/2rI_em4MscE?VQ=HD1080&autoplay=1', '_system');
    }


    $scope.wordunk = function () {
      if (navigator.appVersion.indexOf("Android") > 0) {
        $window.open('https://play.google.com/store/apps/details?id=com.jarvisfilms.wordunknown&hl=en', '_system');
      } else {
        $window.open('https://itunes.apple.com/de/app/word-unknown/id1064901570?l=en&mt=8', '_system');
      }
    }

    $scope.sugarsweet = function () {
      if (navigator.appVersion.indexOf("Android") > 0) {
        $window.open('https://play.google.com/store/apps/details?id=com.jarvisfilms.sugarsweet', '_system');
      } else {
        $window.open('https://itunes.apple.com/us/app/sugarsweet/id1151606636?ls=1&mt=8', '_system');
      }
    }

    $scope.caissa = function () {
      $window.open('http://www.caissajs.com', '_system');
    }

    $scope.tmm = function () {
      $window.open('http://www.typemymusic.com', '_system');
    }

    $scope.me = function () {
      $window.open('http://www.jarvisfilms.com', '_system');
    }



    $scope.facebook = function () {
      $window.open('https://www.facebook.com/sharer/sharer.php?u=' + 'http%3A%2F%2Fpolitifact.com' + allstories[$scope.currentindex].statement_url + '%2F&amp;src=sdkpreparse', '_system');

    }
    $scope.twitter = function () {
      $window.open('https://twitter.com/intent/tweet?url=' + 'http%3A%2F%2Fpolitifact.com' + allstories[$scope.currentindex].statement_url, '_system');

    }
    $scope.googleplus = function () {
      $window.open('https://plus.google.com/share?url=' + 'http%3A%2F%2Fpolitifact.com' + allstories[$scope.currentindex].statement_url, '_system');

    }




    $ionicModal.fromTemplateUrl('menu.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modaltwo = modal;
    });
    $scope.openModalmenu = function (first) {
      if (first){$scope.firstopen=true}else{
        $scope.firstopen=false
      }
      $scope.modaltwo.show();
    };
    $scope.closeModalmenu = function () {
      if($scope.firstopen){
        $scope.newquestion();
      }
      $scope.modaltwo.hide();
       
/*
      if ($scope.firstopen){
        $timeout(function () {
        $scope.firstopen=false;
       $scope.openModalmenu(); 
     }, 300);
      }
 */
    };

    $ionicModal.fromTemplateUrl('stats.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modalone = modal;
    });
    $scope.openModalstats = function () {
      $scope.fetchdata();
      $scope.modalone.show();
    };
    $scope.closeModalstats = function () {
      $scope.modalone.hide();
    };

    $ionicModal.fromTemplateUrl('popup.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modalthree = modal;
    });

    $scope.openModalpop = function () {
$scope.ad=$localStorage.ad;
//alert($scope.ad) // ()()
$scope.modalthree.show();
if ($localStorage.ad>3){
$localStorage.ad=0;
}else{
$localStorage.ad=$localStorage.ad+1;
}
$scope.numerator=0;
$scope.perdiff=($scope.record[0]/$scope.record[1])-$scope.prevper
$scope.perdiffdisp=Math.ceil($scope.perdiff*1000)/10
for (i=0;i<$scope.prevcorr.length;i++){
  if ($scope.prevcorr[i]){
  $scope.numerator=$scope.numerator+1
  }
}
      $scope.denom=$scope.prevcorr.length
    };
    $scope.closeModalpop = function () {
$scope.prevper=$scope.record[0]/$scope.record[1];
$scope.prevcorr=[]
$scope.getNewQuestion();
$scope.modalthree.hide();
      
    };

    if (typeof $localStorage.archiveforpush == 'undefined') {
      $localStorage.archiveforpush = [];
    }
    if (typeof $localStorage.cache == 'undefined') {
      $localStorage.cache = [];
    }

    if (typeof $localStorage.record == 'undefined') {
      $localStorage.record = [0, 0];
      //$window.setTimeout(function(){ $scope.openModalmenu(); }, 300);
    }

    if ($localStorage.record[1] == 0) {

     
      $timeout(function () {
       $scope.openModalmenu(true);
     }, 300);


    }

//----------------------()()()()()---------------------------------
$scope.processNewAPI=function (data){
  console.log(data);
  // transform data structure
  return data
}


$scope.queryPolitifactAPI = function (lstdt){

  return new Promise((resolve,reject) => {
var last=new Date(lstdt)
console.log(last);
var date=last.getFullYear()+'-'+last.getMonth()+'-'+last.getDate() // !!!!!!!!!!1 figure out dateobject in call to API2018-01-01

var url="https://devtest.politifact.com/api/factchecks/?format=json&publication_date_after=" + date+'&ordering=publication_date&callback=?'
console.log(url);
  $.getJSON(url,//
          function (data) {
          	console.log(data);
//---------------------------------------------------------
    resolve($scope.processNewAPI(data))
           })


  });
}
/**/
 var test =new Date().getTime()-800000000

$scope.queryPolitifactAPI(test)

    $scope.pullnewstories = function () {
      allstories = archive.concat($localStorage.newstories);

      lastdate = new Date(allstories[allstories.length - 1].ruling_date)

      if (typeof $localStorage.lastpull == 'undefined') {
        $localStorage.lastpull = lastdate.getTime();
      }

      now = new Date();
      topull = (now.getTime() - $localStorage.lastpull) / 86400000;
      if (String(topull) == 'NaN') {
        topull = (now.getTime() - lastdate.getTime()) / 86400000;
      }

      if (topull > 1) {
        topull = Math.ceil(topull);



$scope.queryPolitifactAPI(lastdate).then((data)=>{

      $localStorage.lastpull = now;
            data = data.reverse();

            //alert(JSON.stringify(data)); //()()()

            for (i = 0; i < data.length; i++) {
              if (new Date(data[i].ruling_date) > lastdate) {
                //alert(JSON.stringify(data[i]))
                $localStorage.newstories.push(data[i]);
              }
            }
            allstories = archive.concat($localStorage.newstories);

})


     
      }

    }

    $scope.pullnewstories();
    //alert($localStorage.politifacts)

    $scope.guess = function (bool) {
//()()

$localStorage.lastphoto=$scope.current.speaker.canonical_photo
$scope.lastphoto=$localStorage.lastphoto;

if(!navigator.onLine){
  $scope.lastphoto="img/bckg.jpg"
}

      //
/*
    	if ($scope.prevcorr.length==1){
	$scope.prevper=$scope.record[0]/$scope.record[1];
}
*/

      //alert($localStorage.record)
      $ionicScrollDelegate.scrollTop();

      if ($scope.guessmade) {
        //alert('l')
        $scope.newquestion();
        //$scope.$apply(function(){});
        $scope.guessmade = false;

        return;
      }

      //alert(startcache);//()()()()
      newcache = []
      for (i = allstories.length - 1; i > -1; i--) {
        if (!$localStorage.done.includes(i) && !startcache.includes(allstories[i].speaker.canonical_photo)) {
          startcache.push(allstories[i].speaker.canonical_photo);
          newcache.push(allstories[i].speaker.canonical_photo);
          if (newcache.length > 0) { break }
        }
      }
      $ImageCacheFactory.Cache(newcache).then(function () {
        //console.log("preload mid! "+newcache.length);
      });

      $scope.right = bool;

      $localStorage.done.push($scope.currentindex);
      $localStorage.record[1] = $localStorage.record[1] + 1;

      if (allstories[$scope.currentindex].ruling.ruling.includes('HalfXXXX')) { // FOR HALF
        $scope.correct = true
      } else {
        $scope.correct=(allstories[$scope.currentindex].ruling.ruling.includes('True')===bool);
      }

 
      //$scope.$apply(function(){ });
      $scope.guessmade = true;


if (!$scope.correct){
  if (navigator.appVersion.indexOf("iPhone") > 0 || navigator.appVersion.indexOf("Android") > 1){
      $cordovaVibration.vibrate(200); //()()()
    } 
}

if (typeof $localStorage.serverdata !== 'undefined'){

for (i=0;i<$localStorage.serverdata.length;i=i+3){
if (parseInt($localStorage.serverdata[i])==$scope.currentindex){
  //alert($localStorage.serverdata[i+1]+' '+ $localStorage.serverdata[i+2])
$scope.questionpercent=parseInt($localStorage.serverdata[i+1])/parseInt($localStorage.serverdata[i+2])
//console.log('questper '+$scope.questionpercent)
$scope.questionpercent=Math.floor($scope.questionpercent*100)/100

$scope.fullper=$scope.questionpercent*100
//alert($scope.questionpercent)
break;
}
}

if (isNaN($scope.questionpercent)){
  $scope.donotshowquestper=true;
}else{
  $scope.donotshowquestper=false;
}

}else{
   $scope.donotshowquestper=true;
}
// ---------------------

//alert($localStorage.serverdata)
//alert($scope.currentindex)

//alert($scope.questionpercent)
//{questionpercent}}
//----------------------


//$scope.$apply(function(){ 
$scope.prevcorr.push($scope.correct)
//});

$scope.halfopacity=[]
for (i=0;i<$scope.prevcorr.length;i++){
  if (i==$scope.prevcorr.length-1){
    $scope.halfopacity.push(false)
  }else{
$scope.halfopacity.push(true)
}
}
//alert($scope.halfopacity)
//$scope.halfopacity=[true,true,true,false]




if ($scope.correct) {
        $localStorage.record[0] = $localStorage.record[0] + 1
        truorfalse = 1;
      } else {
        truorfalse = 0;
      }

      $scope.record = $localStorage.record

$localStorage.archiveforpush=[]; //()()() comment out

      //postcurrent=postcurrent+1;
      if (!$localStorage.archiveforpush.includes($scope.currentindex)) {
        $localStorage.cache.push($scope.currentindex, truorfalse);
      }
//alert($localStorage.cache)
      if ($localStorage.cache.length > 9) { // interval at which data is posted
        //alert('sends')
        //http://www.caissajs.com/CaissaPost.php?result=1&moves='+moves+'&contempt='+contempt;
        $http({
          method: 'POST',
          url: 'https://www.cinqmarsmedia.com/politifact/PoliPost.php?cache=' + $localStorage.cache,
          //data: $scope.outgoingdata,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).success(function (response) {
          //alert(response)
          for (i = 0; i < $localStorage.cache.length; i = i + 2) {
            $localStorage.archiveforpush.push($localStorage.cache[i]);
          }
          $localStorage.cache = [];
        }).error(function (response) {

        });
      }


    }

    function GetZPercent(z) { //z == number of standard deviations from the mean

      //if z is greater than 6.5 standard deviations from the mean
      //the number of significant digits will be outside of a reasonable 
      //range
      if (z < -6.5)
        return 0.0;
      if (z > 6.5)
        return 1.0;

      var factK = 1;
      var sum = 0;
      var term = 1;
      var k = 0;
      var loopStop = Math.exp(-23);
      while (Math.abs(term) > loopStop) {
        term = .3989422804 * Math.pow(-1, k) * Math.pow(z, k) / (2 * k + 1) / Math.pow(2, k) * Math.pow(z, k + 1) / factK;
        sum += term;
        k++;
        factK *= k;

      }
      sum += 0.5;

      return sum;
    }


    $scope.fetchdata=function(){

      $scope.fetcherror = false;
      $scope.record = $localStorage.record;

      $http({
        method: 'GET',
        url: 'https://www.cinqmarsmedia.com/politifact/PoliGet.php',
        //data: $scope.outgoingdata,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

      }).success(function (rez) {
        console.log(rez);
      		//alert(JSON.stringify(rez))
        $scope.response = rez.split(",");
        $localStorage.serverdata=$scope.response;
        $scope.statistics($scope.response);


      }).error(function (response) {
        console.log(response);
      	//alert($localStorage.serverdata)
        $scope.fetcherror = true;
        $scope.statistics($localStorage.serverdata);
      });

    }

$scope.statistics = function (data) {
$scope.globalgames=0;
$scope.globalcorrect=0;


if(typeof data=='undefined'){
$scope.nodata=true;
  return
}else{
  $scope.nodata=false;
}

//alert(data)
//----------------------------------------
// global games
for (i=2;i<data.length;i=i+3){
$scope.globalgames=$scope.globalgames+parseInt(data[i]);
}

// global correct
for (x=1;x<data.length;x=x+3){
$scope.globalcorrect=$scope.globalcorrect+parseInt(data[x]);
}

// global avg
$scope.globalavg=Math.floor($scope.globalcorrect/$scope.globalgames*10000)/100;

//----------------------------------------

      if ($scope.record[1] == 0) {        
          $scope.percentile = 50 - ($scope.globalcorrect / $scope.globalgames * 100)
        } else {
          $scope.percentile = ($scope.record[0] / $scope.record[1]) * 100 - ($scope.globalcorrect / $scope.globalgames * 100)
        }

        // alert($scope.percentile)
        $scope.percentile = $scope.percentile / 25 // standard deviation
        $scope.percentile = GetZPercent($scope.percentile)

if ($scope.record[0] / $scope.record[1]==1){$scope.percentile=.99}
if ($scope.record[0] / $scope.record[1]==0){$scope.percentile=.01}

$scope.toppercentile=1-$scope.percentile
//----------------------------------------

$scope.mostwrongindexs = [];
$scope.mostwrongpercents = [];

lowestnum=[1,1,1,1,1,1,1,1,1,1];
lowestindex=[null,null,null,null,null,null,null,null,null,null];
//alert(data)


bubblesort=function(){

for (p=0;p<data.length;p=p+3){
  for (u=0;u<lowestnum.length;u++){
    decimal=parseInt(data[p+1])/parseInt(data[p+2]);
    //console.log(decimal)
      if (decimal<lowestnum[u] && decimal>0 && !lowestindex.includes(parseInt(data[p]))){
        lowestnum[u]=Math.floor(decimal*100)/100;
        lowestindex[u]=parseInt(data[p]);
        //alert(lowestnum)
       // console.log('fires')
       // console.log(lowestindex)
        bubblesort();return;
}
}
}

}
bubblesort()



//alert(lowestindex)
//alert(lowestnum)
//alert(lowestindex)

//alert(JSON.stringify(allstories[3077]))
used=[];
for (n=0;n<lowestindex.length;n++){
  if (!used.includes(lowestindex[n]) && lowestindex[n]){

  $scope.mostwrongindexs.push(allstories[lowestindex[n]])
  $scope.mostwrongpercents.push(lowestnum[n]);
  used.push(lowestindex[n]);

}
}



}


    $scope.openstory = function (param) {
      $window.open('http://politifact.com' + $scope.mostwrongindexs[param].statement_url, '_system');
    }

    $scope.newquestion = function () {
      $scope.currentindex = $scope.genindx()
      $scope.current = allstories[$scope.currentindex];
//$scope.rulingsrc="//:0"

/**/
filename=$scope.current.speaker.canonical_photo.replace(/^.*\/mugs\//,'');
      //regex

      for (h=0;h<imagenames.length;h++){
      	if (imagenames[h]==filename){
      		$scope.current.speaker.canonical_photo="img/database/"+filename
      		break;
        }
      }

      if (filename.substring(0,20)=='mug-independentgroup' || filename.substring(0,36)=='politifact-mugs-mug-independentgroup'){
          $scope.current.speaker.canonical_photo="img/database/crowd.jpg";
      }

      //alert($scope.current.speaker.canonical_photo)


      //alert(JSON.stringify($localStorage.newstories))
      //$scope.current.statement='<div style=\"color: rgb(0, 0, 0); font-family: arial, sans-serif; line-height: normal; \">The United'

      //if ($scope.current.statement.includes('style=')){}

      $scope.current.statement = $scope.current.statement.replace(/style=...*"/g, '');
      $scope.current.statement = $scope.current.statement.replace(/class=...*"/g, '');
      $scope.current.statement = $scope.current.statement.replace(/<br>/g, '');
      $scope.current.statement = $scope.current.statement.replace(/↵/g, '');
      $scope.current.statement = $scope.current.statement.replace(/<b\s/g, '<span ');
      $scope.current.statement = $scope.current.statement.replace(/<\/b>/g, '</span>');
      $scope.current.statement = $scope.current.statement.replace(/<div>;<\/div>/g, '');
      $scope.current.statement = $scope.current.statement.replace(/<br \/>/g, '');
      $scope.current.statement = $scope.current.statement.replace(/<div>&nbsp;<\/div>/g, '');
      $scope.current.statement = $scope.current.statement.replace(/<div>\s+&nbsp;\s+<\/div>/g, '');
      $scope.current.statement = $scope.current.statement.replace(/<div><\/div>/g, '');
      $scope.current.statement = $scope.current.statement.replace(/<div>\s+<\/div>/g, '');
      $scope.current.statement = $scope.current.statement.replace(/<p>&nbsp;<\/p>/g, '');
      $scope.current.statement = $scope.current.statement.replace(/<p>\s+&nbsp;\s+<\/p>/g, '');
      $scope.current.statement = $scope.current.statement.replace(/\/n/g, '');
      $scope.current.statement = $scope.current.statement.replace(/\s\s/g, ' ');
      $scope.current.statement = $scope.current.statement.replace(/(\S\/)(\S)/g, '$1 $2')
      //$scope.current.statement=$scope.current.statement.replace(/;</g,'<');
      //$scope.current.statement=$scope.current.statement.replace(/\S;\S/g,' ');


      //--------------
      //striiiing='congressional jf fdjkls fjdkls jklfd regulations'

      boom = $scope.current.statement.match(/\w\w\w\w\w\w\w\w\w+/g);
      if (boom) {
        for (x = 0; x < boom.length; x++) {
          //softhyphens=striiiing.substr(0,5)
          softhyphens = ''
          for (y = 0; y < boom[x].length; y++) {

            if (y > 5 && y < boom[x].length - 5) {
              softhyphens = softhyphens + '&shy;' + boom[x][y]
            } else {
              softhyphens = softhyphens + boom[x][y]
            }

          }

          $scope.current.statement = $scope.current.statement.replace(boom[x], softhyphens)
        }
      }


      ruling=$scope.current.ruling.ruling.toLowerCase();
      ruling=ruling.replace(" ","")
      ruling=ruling.replace(" ","")
      ruling=ruling.replace("-","")
      

if (ruling =="false"){
      $scope.rulingcolor="#b5151c"
}else if (ruling=="halftrue"){

  $scope.rulingcolor="#cea517";

}else if(ruling=="mostlytrue"){

  $scope.rulingcolor="#889c3b"


}else if(ruling=="mostlyfalse"){

  $scope.rulingcolor="#c47419"

}else if (ruling=="true"){
  $scope.rulingcolor="#498f43"
}else{
  $scope.rulingcolor="#b5151c"
}

      $scope.rulingsrc="img/tom_ruling_"+ruling+".gif"+"?a="+Math.random(); // gif for animations
      //$scope.rulingsrcjpg="img/tom_ruling_"+ruling+".png" // gif for animations

    }

    $scope.readmore = function () {
      //alert(archive[$scope.currentindex].statement_url);
      $window.open('http://politifact.com' + allstories[$scope.currentindex].statement_url, '_system');

    }


   
$ionicPlatform.ready(function(){
  $scope.fetchdata();
  /*
  AppRate.preferences.storeAppURL.ios = '1217091559';
  AppRate.preferences.storeAppURL.android = 'market://details?id=com.cinqmarsmedia.polititruth';
  AppRate.preferences.usesUntilPrompt = 1; //()()()()

    $cordovaAppRate.promptForRating(false).then(function (result) {
        // success
    });
    */
  //console.log(allstories)
/*
total=0;
tru=0;
fal=0
half=0;

for (i=allstories.length-1;i>allstories.length-304;i--){
  

  if (allstories[i].ruling.ruling=="Pants on Fire!"){
    fal=fal+1
    total=total+1
  }
   if (allstories[i].ruling.ruling=="Half-True"){
    half=half+1
    total=total+1
  }

    if (allstories[i].ruling.ruling=="False"){
    fal=fal+1
    total=total+1
  }

    if (allstories[i].ruling.ruling=="Mostly False"){
    fal=fal+1
    total=total+1
  }

    if (allstories[i].ruling.ruling=="True"){
    tru=tru+1
    total=total+1
  }

  if (allstories[i].ruling.ruling=="Mostly True"){
    tru=tru+1
    total=total+1
  }


}

alert('total: '+total+' false: '+fal+' true: '+tru+' half: '+half)
*/
})

$ionicPlatform.on('resume', function(){
  $scope.fetchdata();
})

    $scope.genindx = function () {
      for (i = allstories.length - 1; i > -2; i--) {
        if (i == -1) {

          $localStorage.record = [0, 0];
          $localStorage.done = [];
          $scope.newquestion();
          return
        }

        if ($localStorage.done.includes(i)) {
          continue
        } else {

          if ((allstories[i].ruling.ruling.includes('False') || allstories[i].ruling.ruling.includes('True') || allstories[i].ruling.ruling.includes('Pants'))&& !allstories[i].ruling.ruling.includes('Half')) { // Half-True Pool ** ()()()()()
            return i;
          }

          // return i;
        }

      }

    }

    $scope.newquestion();

//**************************** ()()()

/*
commadelim='';
for (i=0;i<grabimages.length;i++){
	commadelim=commadelim+grabimages[i].speaker.canonical_photo+'|'
}


console.log(commadelim);
*/
// create new localstorage for local files
// then if statement if it resolves load that one
// switch blogger ones with something else
//****************************

  })

