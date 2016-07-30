/*
 * @Author: Administrator
 * @Date:   2016-07-30 11:51:33
 * @Last Modified by:   Administrator
 * @Last Modified time: 2016-07-30 20:34:36
 */

'use strict';
window.Carrousel = function(w, d) {
    var isTouch = 'ontouchstart' in w;
    var events = isTouch ? {
        start: 'touchstart',
        end: 'touchend'
    } : {
        start: 'mousedown',
        end: 'mouseup'
    };
    var _c = 0,index = 0,timer;
    var defaulted = {
    	box:'.box',
    	items:'.items',
    	pagination:null,
    	z:3,
    	isLoop:true,
    	time:2000
    }
    function Carrousel(options) {
    	var options = extend(defaulted,options);
        this.box = options.box;
        this.items = options.items;
        this.z = options.z;
        this.pagination = options.pagination;
        this.isLoop = options.isLoop;
        this.time = options.time;
        this.init();
    }
    function extend(parent,child){
    	var parent = parent || {},
    		prop;
    	for(prop in child){
    		parent[prop] = child[prop];
    	}
    	return parent;
    }
    Carrousel.prototype = {
        constructor: 'Carrousel',
        init: function() {
            this.bind();
            this.setItemsRotate();
            this.loop();
            this.paginationFn();
        },
        bind: function() {
            var _box = document.querySelector(this.box);
            var _items = document.querySelectorAll(this.items);
            var _length = _items.length;
            var _this = this;
            var cv = 50;
            var _r = 360 / _length;
            var _x1, _x2, _d;
            _box.addEventListener(events.start, start, false);
            function start(e) {
                var ev = isTouch ? e.changedTouches[0] : e;
                _x1 = ev.pageX;
                _box.addEventListener(events.end, end, false);
            	if(_this.isLoop){
            		clearInterval(timer);
            	}
            }
            function end(e) {
                var ev = isTouch ? e.changedTouches[0] : e;
                _x2 = ev.pageX;
                _d = _x2 - _x1;
                if (_d > 0 && _d > cv) {
                	index--;
                	if(index<0){
                		index = _length-1;
                	}
                    _c += _r;
                } else if (_d < 0 && Math.abs(_d) > cv) {
                	index++;
	                if(index>_length-1){
	                	index = 0;
	                }
                    _c -= _r;
                }
                _this._set3d(this, 'rotateY(' + _c + 'deg)')
                if(_this.isLoop){
                	_this.loop();
                }
                if(!!_this.pagination&&!!document.querySelector(_this.pagination)){
                	_this._changePagLi(index,_length);
                }
                _box.removeEventListener(events.end, end, false);
            }
        },
        setItemsRotate: function() {
            var _items = document.querySelectorAll(this.items);
            var _length = _items.length;
            var _r = 360 / _length;
            for (var i = 0; i < _length; i++) {
                this._set3d(_items[i], 'rotateY(' + _r * i + 'deg) translateZ(' + this.z + 'rem)');
            }
        },
        _set3d: function(obj, arg) {
            return obj.style.webkitTransform = obj.style.MozTransform = obj.style.msTransform = obj.style.transform = arg;
        },
        loop: function() {
        	if(this.isLoop){
	        	var _this = this;
	            var _loop = function() {
	            	var _box = document.querySelector(_this.box);
	            	var _items = document.querySelectorAll(_this.items);
		            var _length = _items.length;
		            var _r = 360 / _length;
	            	_c -= _r;
	            	index++;
	                if(index>_length-1){
	                	index = 0;
	                }
	            	_this._set3d(_box, 'rotateY(' + _c + 'deg)')
	            	_this._changePagLi(index,_length);
	            }
	            timer = setInterval(_loop,_this.time)
            }
        },
        endFn:function(fn){
        	var trEndEvent = 'webkitTransitionEnd' || 'MozTransitionEnd' ||'transitionEnd';
        	document.querySelector(this.box).addEventListener(trEndEvent,function(){
        		fn();
        	},false)
        },
        paginationFn:function(){
        	if(!!!this.pagination&&!!!document.querySelector(this.pagination)){
        		return;
        	}
        	var _pag = document.querySelector(this.pagination);
        	var _items = document.querySelectorAll(this.items);
            var _length = _items.length;
            var d=document.createDocumentFragment();
        	for(var i = 0;i<_length;i++){
        		var li = document.createElement('li');
        		d.appendChild(li);
        	}
        	_pag.appendChild(d);
        	var _pagli = _pag.querySelectorAll('li');
        	_pagli[0].className = 'active';
        },
        _changePagLi:function(index,length){
        	var _pagli = document.querySelector(this.pagination).querySelectorAll('li');
        	for(var i = 0;i<length;i++){
        		_pagli[i].className = '';
        	}
        	_pagli[index].className = 'active';
        }
    }
    return Carrousel;
}(window, document)
