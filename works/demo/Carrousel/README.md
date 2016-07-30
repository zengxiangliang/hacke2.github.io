# Carrousel

### 效果介绍：
此项目为主要以手机端为主的3D轮播效果，左右滑动可以切换图片。

### 插件介绍：
此插件可以根据items的个数来自动rotateY的旋转角度计算，也可以通过css来写，但是如果是css来写的话就不需要在Carrouse.prototype.init()中调用
```
this.setItemsRotate();
```
```
loop():此方法为自动轮播的方法。可以通过设置选项isLoop为false禁用此方法。
```
```
paginationFn()：是否添加分页效果，如果设置的选项options.pagination没写或者写了但是通过querySelector获取过来不存在，则不进入函数。
```
选项：
```
var defaulted = {
    	box:'.box',   //容器
    	items:'.items',  //项目
    	pagination:null,   //分页
    	z:3,    //translateZ:单位为rem，不能为其他单位，只为适配性好。
    	isLoop:true,   //是否自动轮播
    	time:2000   //轮播的时间间隔
    }
```
回调函数：
```
endFn:function(fn){   //可以看出此回调函数为容器的translateEnd时触发的函数。
        	var trEndEvent = 'webkitTransitionEnd' || 'MozTransitionEnd' ||'transitionEnd';
        	document.querySelector(this.box).addEventListener(trEndEvent,function(){
        		fn();
        	},false)
        }
```

调用方式：
```
new Carrousel({
        pagination:'.pagination',
        isLoop:true
    });
```
阻止iphone的默认行为：
```
document.addEventListener('touchmove',function(e){
        e.preventDefault();
    },false)
```
rem适配：
```
function resizeEvt() {
        var ww = document.documentElement.clientWidth;
        var fontSize = ww / 750 * 100;
        document.documentElement.style.fontSize = fontSize + 'px'
    }
    document.addEventListener('DOMContentLoaded', resizeEvt, false);
    window.addEventListener('resize', resizeEvt, false);
```

HTML:
```
<div class="stage">
        <ul class="box">
            <li class="items">
                <img src="img/1.jpg" ondragstart="return false" alt="">
            </li>
            <li class="items">
                <img src="img/2.jpg" ondragstart="return false" alt="">
            </li>
            <li class="items">
                <img src="img/3.jpg" ondragstart="return false" alt="">
            </li>
            <li class="items">
                <img src="img/4.jpg" ondragstart="return false" alt="">
            </li>
            <li class="items">
                <img src="img/5.jpg" ondragstart="return false" alt="">
            </li>
            <li class="items">
                <img src="img/6.jpg" ondragstart="return false" alt="">
            </li>
        </ul>
        <ul class="pagination"></ul>
    </div>
```

CSS:
```
.stage {
        -moz-perspective: 10rem;
        -ms-perspective: 10rem;
        -webkit-perspective: 10rem;
        perspective: 10rem;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3rem;
        height: 2rem;
        margin-left: -1.5rem;
        margin-top: -1rem;
    }
    .box {
        width: 100%;
        height: 100%;
        -moz-transform-style: preserve-3d;
        -ms-transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
        -moz-transition: -moz-transform .4s;
        -ms-transition: -ms-transform .4s;
        -webkit-transition: -webkit-transform .4s;
        transition: transform .4s;
    }
    .box li {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        list-style: none;
        font-size: 40px;
        text-align: center;
        cursor: pointer;
    }
    .box li img{
        width: 100%;
        height: 100%;
    }
```
