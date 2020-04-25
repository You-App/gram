angular.module("mediaPlayer",["mediaPlayer.helpers"]).constant("mp.playerDefaults",{currentTrack:0,ended:undefined,network:undefined,playing:false,seeking:false,tracks:0,volume:1,formatDuration:"00:00",formatTime:"00:00",loadPercent:0}).directive("mediaPlayer",["$rootScope","$interpolate","$timeout","mp.throttle","mp.playerDefaults",function($rootScope,$interpolate,$timeout,throttle,playerDefaults){var playerMethods={load:function(mediaElement,autoplay){if(typeof mediaElement==="boolean"){autoplay=
mediaElement;mediaElement=null}else if(typeof mediaElement==="object"){this.$clearSourceList();this.$addSourceList(mediaElement)}this.$domEl.load();this.ended=undefined;if(autoplay){var canPlayEvent=this.$domEl.tagName=="OGVJS"?"loadeddata":"canplay";this.$element.one(canPlayEvent,this.play.bind(this))}},reset:function(autoplay){angular.extend(this,playerDefaults);this.$clearSourceList();this.load(this.$playlist,autoplay)},play:function(index,selectivePlay){if(typeof index==="boolean"){selectivePlay=
index;index=undefined}if(selectivePlay)this.$selective=true;if(this.$playlist.length>index){this.currentTrack=index+1;return this.load(this.$playlist[index],true)}if(!this.currentTrack&&this.$domEl.readyState)this.currentTrack++;if(this.ended)this.load(true);else this.$domEl.play()},playPause:function(index,selectivePlay){if(typeof index==="boolean"){selectivePlay=index;index=undefined}if(selectivePlay)this.$selective=true;if(typeof index==="number"&&index+1!==this.currentTrack)this.play(index);else if(this.playing)this.pause();
else this.play()},pause:function(){this.$domEl.pause()},stop:function(){this.reset()},toggleMute:function(){this.muted=this.$domEl.muted=!this.$domEl.muted},next:function(autoplay){var self=this;if(self.currentTrack&&self.currentTrack<self.tracks){var wasPlaying=autoplay||self.playing;self.pause();$timeout(function(){self.$clearSourceList();self.$addSourceList(self.$playlist[self.currentTrack]);self.load(wasPlaying);self.currentTrack++})}},prev:function(autoplay){var self=this;if(self.currentTrack&&
self.currentTrack-1){var wasPlaying=autoplay||self.playing;self.pause();$timeout(function(){self.$clearSourceList();self.$addSourceList(self.$playlist[self.currentTrack-2]);self.load(wasPlaying);self.currentTrack--})}},setPlaybackRate:function(value){this.$domEl.playbackRate=value},setVolume:function(value){this.$domEl.volume=value},seek:function(value){var doubleval=0,valuesArr;if(typeof value==="string"){valuesArr=value.split(":");doubleval+=parseInt(valuesArr.pop(),10);if(valuesArr.length)doubleval+=
parseInt(valuesArr.pop(),10)*60;if(valuesArr.length)doubleval+=parseInt(valuesArr.pop(),10)*3600;if(!isNaN(doubleval))return this.$domEl.currentTime=doubleval}else return this.$domEl.currentTime=value},on:function(type,fn){return this.$element.on(type,fn)},off:function(type,fn){return this.$element.off(type,fn)},one:function(type,fn){return this.$element.one(type,fn)},$addSourceList:function(sourceList){var self=this;if(angular.isArray(sourceList))angular.forEach(sourceList,function(singleElement,
index){var sourceElem=document.createElement("SOURCE");["src","type","media"].forEach(function(key){if(singleElement[key]!==undefined)sourceElem.setAttribute(key,singleElement[key])});self.$element.append(sourceElem)});else if(angular.isObject(sourceList)){var sourceElem=document.createElement("SOURCE");["src","type","media"].forEach(function(key){if(sourceList[key]!==undefined)sourceElem.setAttribute(key,sourceList[key])});self.$element.append(sourceElem)}},$clearSourceList:function(){this.$element.contents().remove()},
$formatTime:function(seconds){if(seconds===Infinity)return"\u221e";var hours=parseInt(seconds/3600,10)%24,minutes=parseInt(seconds/60,10)%60,secs=parseInt(seconds%60,10),result,fragment=(minutes<10?"0"+minutes:minutes)+":"+(secs<10?"0"+secs:secs);if(hours>0)result=(hours<10?"0"+hours:hours)+":"+fragment;else result=fragment;return result},$attachPlaylist:function(pl){if(pl===undefined||pl===null)this.playlist=[];else this.$playlist=pl}};var bindListeners=function(au,al,element){var updateTime=function(scope){scope.currentTime=
al.currentTime;scope.formatTime=scope.$formatTime(scope.currentTime)};var listeners={playing:function(){au.$apply(function(scope){scope.playing=true;scope.ended=false})},pause:function(){au.$apply(function(scope){scope.playing=false})},ended:function(){if(!au.$selective&&au.currentTrack<au.tracks)au.next(true);else au.$apply(function(scope){scope.ended=true;scope.playing=false;updateTime(scope)})},timeupdate:throttle(1E3,false,function(){au.$apply(function(scope){updateTime(scope)})}),loadedmetadata:function(){au.$apply(function(scope){if(!scope.currentTrack)scope.currentTrack++;
scope.duration=al.duration;scope.formatDuration=scope.$formatTime(scope.duration);if(al.buffered.length)scope.loadPercent=Math.round(al.buffered.end(al.buffered.length-1)/scope.duration*100);updateTime(scope)})},progress:function(){if(au.$domEl.buffered.length)au.$apply(function(scope){scope.loadPercent=Math.round(al.buffered.end(al.buffered.length-1)/scope.duration*100);scope.network="progress"})},volumechange:function(){au.$apply(function(scope){scope.volume=al.volume;scope.muted=al.muted})},seeked:function(){au.$apply(function(scope){scope.seeking=
false})},seeking:function(){au.$apply(function(scope){scope.seeking=true})},ratechange:function(){au.$apply(function(scope){scope.playbackRate=al.playbackRate})},stalled:function(){au.$apply(function(scope){scope.network="stalled"})},suspend:function(){au.$apply(function(scope){scope.network="suspend"})}};angular.forEach(listeners,function(f,listener){element.on(listener,f)})};var MediaPlayer=function(element){var mediaScope=angular.extend($rootScope.$new(true),{$element:element,$domEl:element[0],
$playlist:undefined,buffered:element[0].buffered,played:element[0].played,seekable:element[0].seekable},playerDefaults,playerMethods);bindListeners(mediaScope,element[0],element);return mediaScope};function playlistWatch(player){return function(playlistNew,playlistOld,watchScope){var currentTrack,newTrackNum=null;player.$attachPlaylist(playlistNew);if(playlistNew===undefined&&playlistOld!==undefined)return player.pause();if(player.currentTrack){currentTrack=playlistOld?playlistOld[player.currentTrack-
1]:-1;for(var i=0;i<playlistNew.length;i++)if(angular.equals(playlistNew[i],currentTrack)){newTrackNum=i;break}if(newTrackNum!==null){player.currentTrack=newTrackNum+1;player.tracks=playlistNew.length}else{player.pause();if(playlistNew.length)$timeout(function(){player.$clearSourceList();player.$addSourceList(playlistNew[0]);player.load();player.tracks=playlistNew.length});else player.reset()}}else if(playlistNew.length){player.$clearSourceList();player.$addSourceList(playlistNew[0]);player.load();
player.tracks=playlistNew.length}else player.reset()}}return{scope:false,link:function(scope,element,attrs,ctrl){var playlistName=attrs.playlist,mediaName=attrs.mediaPlayer||attrs.playerControl;var player=new MediaPlayer(element),playlist=scope[playlistName];if(playlistName===undefined)playlist=[];else if(scope[playlistName]===undefined)playlist=scope[playlistName]=[];else playlist=scope[playlistName];if(mediaName!==undefined)scope.$eval(mediaName+" = player",{player:player});if(element[0].tagName!==
"AUDIO"&&element[0].tagName!=="VIDEO"&&element[0].tagName!=="OGVJS")return new Error("player directive works only when attached to an <audio>/<video> type tag");var mediaElement=[],sourceElements=element.find("source");if(sourceElements.length===1)playlist.unshift({src:sourceElements[0].src,type:sourceElements[0].type,media:sourceElements[0].media});else if(sourceElements.length>1){angular.forEach(sourceElements,function(sourceElement){mediaElement.push({src:sourceElement.src,type:sourceElement.type,
media:sourceElement.media})});playlist.unshift(mediaElement)}if(playlistName===undefined)player.$attachPlaylist(playlist);else if(playlist.length){playlistWatch(player)(playlist,undefined,scope);scope.$watch(playlistName,playlistWatch(player),true)}else scope.$watch(playlistName,playlistWatch(player),true)}}}]);
angular.module("mediaPlayer.helpers",[]).factory("mp.throttle",["$timeout",function($timeout){return function(delay,no_trailing,callback,debounce_mode){var timeout_id,last_exec=0;if(typeof no_trailing!=="boolean"){debounce_mode=callback;callback=no_trailing;no_trailing=undefined}var wrapper=function(){var that=this,elapsed=+new Date-last_exec,args=arguments,exec=function(){last_exec=+new Date;callback.apply(that,args)},clear=function(){timeout_id=undefined};if(debounce_mode&&!timeout_id)exec();if(timeout_id)$timeout.cancel(timeout_id);
if(debounce_mode===undefined&&elapsed>delay)exec();else if(no_trailing!==true)timeout_id=$timeout(debounce_mode?clear:exec,debounce_mode===undefined?delay-elapsed:delay)};return wrapper}}]);