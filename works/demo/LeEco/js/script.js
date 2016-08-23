/*
 * @Author: xiangliang.zeng
 * @Date:   2016-06-14 14:43:47
 * @Last Modified by:   Administrator
 * @Last Modified time: 2016-08-24 01:51:29
 */

var MYApp;
;(function(){
	function showPreview(source) {  
            var file = source.files[0];  
            if(window.FileReader) {  
                var fr = new FileReader();  
                fr.onloadend = function(e) {  
                    document.getElementById("preview").src = e.target.result;  
                    document.getElementById("preview").style.display = 'block';
                };  
                fr.readAsDataURL(file);  
            }else{
            	alert("Not supported by your browser!");
            }
        }
	//rem
	window.onload = function(){
		$('.onpage').eq(0).addClass('active').show();
		document.querySelector('.loading').style.display = 'none';
		MYApp.init();
		
	};

	//插件
	MYApp = function(){
		var wh = document.documentElement.clientHeight;
		var ww = document.documentElement.clientWidth;
		var page = $('.onpage');
		var len = page.length;
		var a = $('.active');
		var index = 0;
		var flag = true;
		var liValue,t1,t2,t3,curindex,inputName;
		//var horw,horh,verw,verh;
		var prvtDeftTouch = function(){
			$(document,'img').on('touchmove',function(event){
					event.preventDefault();
			});
		};
		var swipeL = function(){
			var nextPage=page.eq(index).next();
			if(nextPage.length>0){
				nextPage.show();
				page.eq(index).css('-webkit-transform','translate3d(-'+ww+'px,0,0)');
				page.one('webkitTransitionEnd',function(){
					page.removeClass('active');
					nextPage.addClass('active');
				})
				index++
			}
		};
		var swipeR = function(){
			var prevPage=page.eq(index).prev();
			if(prevPage.length>0){
				prevPage.show();
				prevPage.css('-webkit-transform','translate3d(0,0,0)');
				page.one('webkitTransitionEnd',function(){
					page.removeClass('active');
					prevPage.addClass('active');
				});
				index--;
			}
		};
        var resizeEvt = function() {
        	var doc = document.documentElement;
        	wh = doc.clientHeight;
            doc.style.fontSize = 100 * (wh / 1920) + 'px';
        }
        var bindEvt = function(){
    		document.addEventListener('DOMContentLoaded', resizeEvt, false);
			$(document).on('click','.prev',swipeR);
			$(document).on('click','.next',swipeL);
			/**
			 * 点击把图片绘制过去
			 */
			$('#clickimg').on('click',function(e){
				e.stopPropagation();
				$('#imgOne').click();
			});
			$('#imgOne').on('change',function(){
				showPreview(this);
			})
			$(document).on('click','#page5 .next',function(){
				$('#p5_viewimg img').attr('src',document.getElementById("preview").src);
			});

			/*防止点击turn*/
			$(document).on('click','#page1 .btn',function(e){
				e.stopPropagation();
			});
			/**
			 * 点击翻页之后暂停序列帧
			 */
			$(document).on('click','#p2_xlz',function(e){
				swipeL();
				t2.pause();
			});
			/**
			 * 点击第二页向前翻页之后开始序列帧
			 */
			$(document).on('click','#p2_light_start',function(e){
				t2.start();
			});
			
			/*$(document).on('click','#page2 .next',function(){
				if($('.inputwrap input').val() === ''){
					return false;
				}
			})*/

			/**
			 * placeholder效果
			 */
			$(document).on('focus','#p2_input',function(){
				$(this).siblings().hide();
			});
			$(document).on('blur','#p2_input',function(){
				if(this.value == ''){
					$(this).siblings().attr('src','images/p2_name.png').show();
				}
			});
			/**
			 * 点击第二页判断input是否为空,并且添加动画效果
			 */
			var p3_1 = $('.p3_1');
			var p3_2 = $('.p3_2');
			var p3_3 = $('.p3_3');
			$(document).on('click','.p2_next',function(){
				var p2_input = $('#p2_input')
				if(p2_input.val() == ''){
					p2_input.siblings().attr('src','images/p2_name1.png');
					return false;
				}
				document.getElementById('viewname').innerHTML = p2_input.val();
				swipeL();
				p3_1.addClass("tran");
			});

			$(document).one('webkitTransitionEnd','.p3_1 li',function(){
				p3_1.removeClass("tran");
				setTimeout(function(){
					p3_1.addClass("ani");
				},600);
			});
			$(document).on('webkitAnimationEnd','.p3_1 .p3_1_5',function(){
				p3_1.removeClass("ani");
				p3_1.hide();
				p3_2.show().addClass("ani");
			});
			var classNameArr = ['card_1','card_2','card_3','card_4','card_5'];
			var roles = [
				{
					tit:'images/p3_1_tit_1.png',
					intro:'images/p3_1_intro_1.png',
					information:'images/p4_middle_1.png',
					namespace:'images/p5_name_1.png',
					start:['images/start4.png','images/start5.png','images/start2.png'],
					details:'images/p5_intro_1.png',
					role:'images/Role/1.png'
				},
				{
					tit:'images/p3_1_tit_2.png',
					intro:'images/p3_1_intro_2.png',
					information:'images/p4_middle_2.png',
					namespace:'images/p5_name_2.png',
					start:['images/start2.png','images/start4.png','images/start5.png'],
					details:'images/p5_intro_2.png',
					role:'images/Role/2.png'
				},
				{
					tit:'images/p3_1_tit_3.png',
					intro:'images/p3_1_intro_3.png',
					information:'images/p4_middle_3.png',
					namespace:'images/p5_name_3.png',
					start:['images/start5.png','images/start3.png','images/start3.png'],
					details:'images/p5_intro_3.png',
					role:'images/Role/3.png'
				},
				{
					tit:'images/p3_1_tit_4.png',
					intro:'images/p3_1_intro_4.png',
					information:'images/p4_middle_4.png',
					namespace:'images/p5_name_4.png',
					start:['images/start4.png','images/start4.png','images/start3.png'],
					details:'images/p5_intro_4.png',
					role:'images/Role/4.png'
				},
				{
					tit:'images/p3_1_tit_5.png',
					intro:'images/p3_1_intro_5.png',
					information:'images/p4_middle_5.png',
					namespace:'images/p5_name_5.png',
					start:['images/start3.png','images/start4.png','images/start5.png'],
					details:'images/p5_intro_5.png',
					role:'images/Role/5.png'
				}
				
			];
			var arrLength = classNameArr.length;
			var index = 0;
			function cardSwipeL(){
				t3.pause();
				classNameArr.push(classNameArr.shift())
				for(var i = 0;i<arrLength;i++){
					$('.card li')[i].className = classNameArr[i];
				};
				index--;
				if(index<0){
					index = arrLength-1;
				}
				$('.tit li img').attr('src',roles[index].tit);
				$('.intro li img').attr('src',roles[index].intro);
				$('.p3_pag li').removeClass("active").eq(index).addClass("active");
				// setTimeout(function(){
				// 	t3.start();
				// },2000);
				console.log('LLL'+index);
			}
			function cardSwipeR(){
				t3.pause();
				classNameArr.unshift(classNameArr.pop())
				for(var i = 0;i<arrLength;i++){
					$('.card li')[i].className = classNameArr[i];
				}
				index++;
				if(index>arrLength-1){
					index = 0;
				}
				$('.tit li img').attr('src',roles[index].tit);
				$('.intro li img').attr('src',roles[index].intro);
				$('.p3_pag li').removeClass("active").eq(index).addClass("active");
				// setTimeout(function(){
				// 	t3.start();
				// },2000);				
				console.log('RRR'+index);
			}
			t3 = new Timer(2000,0,cardSwipeR);
			$(document).on('swipeLeft','.card li',cardSwipeL);
			$(document).on('swipeRight','.card li',cardSwipeR);

			/**
			 * 点击卡牌
			 */
			$(document).on('click','.p3_2 .card',function(){
				$('.p3_3').show();
				$('.p3_2').hide();
				t3.stop();
				p3_3.find('.card img').attr('src',roles[index].role);
			});
			/**
			 * 点击第三页的返回
			 */
			$(document).on('click','.p3_3_prev',function(){
				$('.p3_3').hide();
				$('.p3_2').show();
			});
			/**
			 * 点击第三页的next
			 */
			$(document).on('click','#page3 .next',function(){
				t3.pause();
				document.getElementById('page4_m_img').src=roles[index].information;
				$('.namespace img').attr('src',roles[index].namespace);
				$('.startone img').attr('src',roles[index].start[0]);
				$('.starttwo img').attr('src',roles[index].start[1]);
				$('.startthr img').attr('src',roles[index].start[2]);
				$('.details img').attr('src',roles[index].details);
			});
        }
        var timers = function(){
        	var pageClass="";
        	t1 = new Timer(100,30,function(count){
        		//$('#pagebg').removeClass(pageClass).addClass('page00'+count);
        		//pageClass = 'page00'+count;
        		$("#xlz").attr("src","images/xuliezhen/1-00"+count+".jpg");
        		if(count == 30){
        			t1.stop();
        			console.log("stop");
        		}
        	});
        	t1.start();
        	t2 = new Timer(200,0,function(){
        		$('#p2_xlz').attr("src",'images/light/light-000'+this.count+'.jpg');
        		if(this.count == 10){
        			this.count = 1;
        		}
        	});
        	t2.start();
        }
        var turnInit = function(){
        	var wwf = $("#flipbook").width();
        	var whf = $("#flipbook").height();

        	$("#flipbook").turn({
        		width:wwf, 
        		height:whf,
        		autoCenter: true,
        		display: 'single',
        		duration:2000,
        		//turnCorners: "all",
        		//elevation:0
        		when:{
        			turned: function(e, page) {
						if (page==1) {
							$(this).turn('peel', 'br');
						}
        				$(".flippages").removeClass("pageOpen");
        				var id=".page0"+page;
        				$(id).addClass("pageOpen");
        			}
        		}
        	});
        }
		var init  = function(){
			prvtDeftTouch();			
			resizeEvt();
			turnInit();
            bindEvt();
            timers();
		}
		return {
			init:init,
			resizeEvt:resizeEvt
		}
	}()
}());
$(function(){
	var timer;
	$(window).on("orientationchange", function () {
		orient();
		if(w>h){
			horw=w;
			horh=h;
			$(".cover").css({"display":"block"});
		}else{
			verw=w;
			verh=h;
			$(".container").css({"width":verw,"height":verh,"overflow-x":"hidden","overflow-y":"scroll"});
			$("#page2").css({"width":verw,"height":verh});
			$("html").css({"width":verw,"height":verh});
		}
	});
	orient();
	var w=$(window).width(),h=$(window).height(),horw,horh,verw,verh;//v 竖屏 ，hor 横屏
	if(w>h){
		horw=w;
		horh=h;
		$(".cover").css({"display":"block"});
	}else{
		verw=w;
		verh=h;
		$("body,#wrap").css({"width":verw,"height":verh,"overflow-x":"hidden"});
		$("#page2").css({"width":verw,"height":verh});
		$("html").css({"width":verw,"height":verh});
	}
	$(window).resize(function () {
		
        var ws=$(window).width(),hs=$(window).height(),isVd,flipbook = $("#flipbook");
		if(ws>hs){
			isVd=false;
		}else{
			isVd=true;
			MYApp.resizeEvt();
			var fz = $('html').css('font-size');
			var fw = parseFloat(fz)*9.2;
			var fh = parseFloat(fz)*14;
			console.log(fh)
			$("#flipbook").turn("size",fw, fh);
		}
		if(isVd){
			if(typeof verw==="undefined"){
				verw=ws;
				verh=hs;
				$("body,#wrap").css({"width":verw,"height":verh,"overflow-x":"hidden"});
				$("#page2").css({"width":verw,"height":verh});
				$("html").css({"width":verw,"height":verh});
			}
			$(".cover").css({"display":"none"});
		}else{
			$(".cover").css({"display":"none"});
		}

    });
	
});
function orient() {

    if (window.orientation == 90 || window.orientation == -90) {
    	// 横屏
        $("#page2").hide();

        $(".cover").show();

    } else if (window.orientation == 0 || window.orientation == 180) {
    	//竖屏
        $("#page2").show();

        $(".cover").hide();

    }

}
function vInit(verw,verh){

	$(".container").css({"width":verw,"height":verh,"overflow-x":"hidden","overflow-y":"scroll"});
	$("#page2").css({"width":verw,"min-height":verh});
	$("#formWrap").css({"height":$(".parts").height()});
	$(".tit").css({"height":verh*0.05});
}

