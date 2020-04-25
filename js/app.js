/*
 Webogram v0.7.0 - messaging web application for MTProto
 https://github.com/zhukov/webogram
 Copyright (C) 2014 Igor Zhukov <igor.beatle@gmail.com>
 https://github.com/zhukov/webogram/blob/master/LICENSE
*/
var extraModules=[];if(Config.Modes.animations)extraModules.push("ngAnimate");
angular.module("myApp",["ngRoute","ngSanitize","ngTouch","ui.bootstrap","mediaPlayer","toaster","izhukov.utils","izhukov.mtproto","izhukov.mtproto.wrapper","myApp.filters","myApp.services","myApp.directives","myApp.controllers","ngCookies"].concat(extraModules)).config(["$locationProvider","$routeProvider","$compileProvider","StorageProvider",function($locationProvider,$routeProvider,$compileProvider,StorageProvider){$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|filesystem|chrome-extension|app):|data:image\//);$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|tg|mailto|blob|filesystem|chrome-extension|app):|data:/);
if(Config.Modes.test)StorageProvider.setPrefix("t_");$routeProvider.when("/",{template:"",controller:"AppWelcomeController"});$routeProvider.when("/login",{templateUrl:templateUrl("login"),controller:"AppLoginController"});$routeProvider.when("/im",{templateUrl:templateUrl("im"),controller:"AppIMController",reloadOnSearch:false});$routeProvider.otherwise({redirectTo:"/"})}]);