var isHandle = {
    lowerIE8: function() {
        var agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf("msie") < 0) return false;
        var ieAgent = agent.split("msie");
        return parseInt(ieAgent[1].split(";")[0]) <= 8;
    },
    isIE6:function(){
    	var agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf("msie") < 0) return false;
        var ieAgent = agent.split("msie");
        return parseInt(ieAgent[1].split(";")[0]) <= 6;
    }
};

var slider = function(obj,ctrL,ctrR,setTri,types){
	this.obj = $(obj) || null;						
	this.sl = this.obj.children();								
	this.ctrL = this.obj.siblings(ctrL);			
	this.ctrR = this.obj.siblings(ctrR);			
	this.flag = true;								
	this.setTri = setTri;							
	this.slw = 0;									
	this.goes = 0;									
	this.step = 0;									
	this.types = types || "nums";				
	this.locations = null;
	this.nums = null;
	this.re980 = false;
	this.re1200 = false;
	this.init();
}
slider.prototype = {
	init:function(){
		if($("body").width() < 1200){
			this.nums = this.obj.data("mins");
		}else{
			this.nums = this.obj.data("maxs");
		}
		var self = this;
		this.objw = this.obj.outerWidth(true);
		this.chs = this.sl.children();
		this.len = this.chs.length;
		var k = [];
		var w = 0;
		this.chs.each(function(){
			k.push($(this).outerWidth(true))
		})
		for(var i = 0; i < this.len; i++){
			w+=k[i];
		}
		this.sl.width(w);
		this.slw = this.sl.outerWidth();
		switch(this.types){
			case "width":
				this.step = Math.ceil(parseInt(this.slw) / parseInt(this.objw));
				this.tStep = Math.floor(parseInt(this.slw) / parseInt(this.objw));
				break;
			case "nums":
				this.step = Math.ceil(this.len / this.nums);
				this.tStep = Math.floor(this.len / this.nums);
				break;
		}

		// 箭头
		if(this.goes == 0){
			this.ctrL.addClass("un");
		}
		this.setArr();
		this.ctrL.off().on({
			"click":function(){
				self.prevs();
			}
		})
		this.ctrR.off().on({
			"click":function(){
				self.nexts();
			}
		})
		// 底部原点
		this.setTrigger();
		$(window).resize(function(){
			setTimeout(function(){
				self.reInit();
			},100);
		})
	},
	setArr:function(){
		switch(this.types){
			case "width":
				if(this.slw <= this.objw){
					this.ctrL.hide();
					this.ctrR.hide();
				}else{
					this.ctrL.removeAttr("style");
					this.ctrR.removeAttr("style");
				}
				break;
			case "nums":
				if(this.len <= this.nums){
					this.ctrL.hide();
					this.ctrR.hide();
				}else{
					this.ctrL.removeAttr("style");
					this.ctrR.removeAttr("style");
					if(this.len == 20){
						this.locations = this.ctrR.data("locations")
					}
				}
				break;
		}
	},
	setTrigger:function(){
		var self = this;
		if(this.setTri){
			this.trigger = this.obj.siblings('.slider-trigger');
			if(this.trigger.children().length > 0){
				this.trigger.children().remove();
			}
			if(this.step == 1){
				return false;
			}
			for(var i = 0; i < this.step; i++){
				this.trigger.append("<li></li>");
			}
			this.tric = this.trigger.children();
			this.tric.first().addClass("act");
			this.trigger.css({
				"marginLeft": -self.trigger.width()/2
			})
			this.tric.off().on({
				"click":function(){
					self.trigFun(this);
					$(this).addClass("act").siblings().removeClass("act");
				}
			})
		}
	},
	trigFun:function(tri){
		 var index = $(tri).index() + 1;
		 if(index - 1 > this.goes){
		 	this.goFun("right",index);
		 }else if(index - 1 < this.goes){
		 	this.goFun("left",index);
		 }else{
		 	return false;
		 }
	},
	prevs:function(){
		this.goFun("left");
	},
	nexts:function(){
		this.goFun("right");
	},
	goFun:function(direction,index){
		var self = this;
		this.direction = direction;
		switch(this.direction){
			case "left":
				if(self.goes <= 0){
					self.goes = 0;
					return false;
				}
				self.ctrR.removeClass('un');
				if(self.locations){
					self.ctrR.attr("href","javascript:;").removeClass("text");
					self.ctrR.children().html("");
				}
				if(self.flag){				
					self.flag = false;
					self.s = 0;
					if(index){
						self.goes = index -1
					}else{
						self.goes = self.goes - 1
					}
					if(self.types == "nums"){
						self.chsw = self.chs.outerWidth(true);
						self.objw = self.nums * self.chsw;
						self.tric.eq(self.goes).addClass("act").siblings().removeClass("act");
					}
					self.s += self.objw * self.goes;
					if(self.goes == 0){
						self.ctrL.addClass('un');
					}
					self.sl.animate({
						"left":-self.s
					},400,function(){
						self.flag = true;
					});			
				}	
			break;
			case "right":
				if(self.goes >= self.step-1){
					self.goes = self.step-1;
					if(self.locations){
						self.ctrR.attr("href",self.locations);
					}
					return false;
				}
				self.ctrL.removeClass("un");
				if(self.flag){
					self.flag = false;
					
					if(index){
						self.goes = index -1
					}else{
						self.goes = self.goes + 1
					}
					if(self.types =="nums"){
						self.chsw = self.chs.outerWidth(true);
						self.objw = self.nums * self.chsw;
						self.tric.eq(self.goes).addClass("act").siblings().removeClass("act");
					}
					self.s = self.objw * self.goes;
					if(self.goes == self.step-1){
						q = self.slw - self.objw * self.step;
						self.s += q;
						if(self.locations){
							self.ctrR.addClass('text')
							self.ctrR.children().html("查看更多");
						}else{
							self.ctrR.addClass('un');
						}
					}

					self.sl.animate({
						"left":-self.s
					},400,function(){
						self.flag = true;
					});
				}
			break;
		}
	},
	reInit:function(){
		var self = this;
		this.ctrL.addClass("un");
		this.ctrR.removeClass("un");
		if(self.locations){
			self.ctrR.attr("href","javascript:;").removeClass("text");
			self.ctrR.children().html("");
		}
		if($("body").width() < 1200){
			if(!this.re980){
				this.re980 = true;
				this.re1200 = false;
				this.init();
				this.goes = 0;
				this.s = this.objw * this.goes;
				this.sl.animate({
					"left": self.s
				},400);
			}
		}else{
			if(!this.re1200){
				this.re980 = false;
				this.re1200 = true;
				this.init();
				this.goes = 0;
				this.s = this.objw * this.goes;
				this.sl.animate({
					"left": self.s
				},400);
			}
		}
	}
}

var scrollTo = function(obj,rec,tst){
	this.obj = $(obj) || null;
	this.rec = $(rec) || null;
	this.tst = $(tst) || null
	this.tsts = this.tst.offset().top;
	this.pos = [];
	this.t = [];
	this.runs();
}
scrollTo.prototype = {
	runs:function(){
		var self = this;
		this.pushText();
		this.rec.children().off().on({
			"click":function(){
				var i = $(this).index();
				$(this).addClass("act").siblings().removeClass("act");
				self.goTo(i);
			}
		});
		if(!isHandle.isIE6()){
			$(window).scroll(function(){
				self.scrollFix(this);;
				self.rec.children().eq(self.getI($(this).scrollTop())).addClass("act").siblings().removeClass("act");
			})
		}		
	},
	getInfo:function(){
		var self = this;
		self.obj.each(function(){
			self.pos.push($(this).offset().top);
			self.t.push($(this).data("col"));
		})
	},
	pushText:function(){
		this.getInfo();
		for(var i = 0; i < this.t.length; i++){
			this.rec.append("<li><i class='img-sprite icon-rhombus'></i>"+ this.t[i] +"</li>")
		}
		this.rec.children().first().addClass("act");
		new slider(".sub-list-slider",".slider-left",".slider-right",false,"width");
	},
	goTo:function(t){
		var self = this;
		var j;
		if(!isHandle.isIE6()){
			j = self.pos[t] - 120;
		}else{
			j = self.pos[t];
		}
		$("html,body").stop().animate({
			"scrollTop":j
		},400);
	},
	scrollFix:function(o){
		var self = this;
		if($(o).scrollTop() >= self.tsts){
			self.tst.addClass("fixed");
		}else{
			self.tst.removeClass("fixed");
		}
	},
	getI:function(st){		
		var len = this.pos.length;
		var t;
		for(var i = 0; i < len; i++){
			if(st >= this.pos[i] - 150){
				t = i;
			}
		}
		return t;
	}
}


$(function(){
	// ie8及以下 自适应
	if(isHandle.lowerIE8()){
		if($("body").width() >= 1200){
			$("body").addClass("w1200");
		}
		$(window).resize(function(){
			if($("body").width() >= 1200){
				$("body").addClass("w1200");
			}else{
				$("body").removeClass("w1200");
			}
		})
	}

	// 轮播
	
	$(".shop-col-slider").each(function(i){
		new slider(this,".slider-left",".slider-right",true,"nums");
	})

	new scrollTo(".scenarized-shop-col","[data-scrollTo='true']",".scenarized-shop");

	// J_max_text
	function se(str){
		var realLength = 0, len = str.length, charCode = -1;
		for (var i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) realLength += 1;
			else realLength += 2;
		}
		return realLength;
	}
	$(".J_max_text").each(function(){
		if(se($(this).text()) > 10){
			$(this).addClass("t-overflow");
		}
	})

	// J_select
	$(".J_select").each(function(){
		var par = $(this);
		var list = par.children(".box-list-ul");
		var p = par.children(".box-list-p");

		par.off().on({
			"mouseenter":function(){
				list.show();
			},
			"mouseleave":function(){
				list.hide();
			}
		})
		list.children().off().on({
			"mouseenter":function(){
				$(this).addClass("cur").siblings().removeClass("cur")
			},
			"mouseleave":function(){
				$(this).removeClass("cur")
			},
			"click":function(){
				var ht = $(this).html();
				p.html(ht);
				list.hide();
				if($(this).children().hasClass("down")){
					$(this).children().addClass("up").removeClass("down");
				}else{
					$(this).children().addClass("down").removeClass("up");
				}
			}
		});
	})
})