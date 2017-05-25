/*
* @Author: Administrator
* @Date:   2016-09-01 21:46:58
* @Last Modified by:   Administrator
* @Last Modified time: 2016-09-03 16:18:50
*/

var page = document.querySelectorAll('.page'),wrap = document.querySelector('.wrap'),x1,y1,x2,y2,d,index = 0,len = page.length,isAnimate = false;
window.addEventListener('load',init,false);
document.addEventListener('touchstart',start,false);
document.addEventListener('touchmove',move,false);
document.addEventListener('touchend',end,false);
wrap.addEventListener('webkitTransitionEnd',transitionEnd,false);
function start(e){
	y1 = e.changedTouches[0].pageY;
	
}
function move(e){
	y2 = e.changedTouches[0].pageY;
}
function end(e){
	d = y2-y1;
	if(d<=100&&index<len-1&&!isAnimate){
		index++;
	}else if(d>=100&&index>0&&!isAnimate){
		index--;
	}else{
		return;	
	}
	page[index].style.display = 'block';
	wrap.style.webkitTransform = 'translate3d(0,'+(-index*100)+'%,0)';
	isAnimate = true;
}
function transitionEnd(){
	for(var i = 0;i<len;i++){
		if(i==index){
			continue;
		}
		if(page[i].style.display === 'block'){
			page[i].style.display = 'none';
		}
	}
	isAnimate = false;
}
function init(){
	page[0].style.display='block';
	for(var i = 0;i<len;i++){
		page[i].style.top = i*100+'%';
	}
}
function hasX(){
	return wrap.getAttribute('x')||wrap.getAttribute('x') == '';
}