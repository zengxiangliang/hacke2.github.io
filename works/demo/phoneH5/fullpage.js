/*
* @Author: Administrator
* @Date:   2016-09-01 21:46:58
* @Last Modified by:   Administrator
* @Last Modified time: 2016-09-03 13:18:08
*/

var page = document.querySelectorAll('.page'),wrap = document.querySelector('.wrap'),x1,y1,x2,y2,d,index = 0,len = page.length,isAnimate = false;
window.addEventListener('load',init,false);
document.addEventListener('touchstart',start,false);
document.addEventListener('touchmove',move,false);
document.addEventListener('touchend',end,false);
wrap.addEventListener('webkitTransitionEnd',transitionEnd,false);
function start(e){
	var e = e.changedTouches[0];
	x1 = e.pageX;
	y1 = e.pageY;
}
function move(e){
	var e = e.changedTouches[0];
	x2 = e.pageX;
	y2 = e.pageY;
	d = y2-y1;
	
}
function end(e){
	if(d<=-100&&index<len-1&&!isAnimate){
		index++;
	}else if(d>=100&&index>0&&!isAnimate){
		index--;
	}else{
		return;
	}
	page[index].style.display = 'block';
	page[index].style.left = 0;
	page[index].style.top = index*100+'%';
	wrap.style.webkitTransform = wrap.style.transform = 'translate3d(0,'+(-index*100)+'%,0)';
	isAnimate = true;
}
function transitionEnd(){
	for(var i = 0;i<len;i++){
		if(i==index){
			continue;
		}
		page[i].style.display = 'none';
	}
	isAnimate = false;
}
function init(){
	page[0].style.display='block';
}
function hasX(){
	return wrap.getAttribute('x')||wrap.getAttribute('x') == '';
}