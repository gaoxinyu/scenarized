var isHandle = {
    lowerIE8: function() {
        var agent = navigator.userAgent.toLowerCase();
        //var ieAgent = /msie\s*(\d)/.exec(navigator.userAgent.toLowerCase());
        if (agent.indexOf("msie") < 0) return false;
        var ieAgent = agent.split("msie");
        return parseInt(ieAgent[1].split(";")[0]) <= 8;
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
			w+=k[i]
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

		// console.log("move step = "+self.step,self.slw,this.objw);

		
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
			},10);
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
		// console.log(this.setTri)
		if(this.setTri){
			this.trigger = this.obj.siblings('.slider-trigger');
			if(this.trigger.children().length > 0){
				// console.log("里:"+this.step);
				this.trigger.children().remove();
			}
			// console.log("外:"+this.step);
			if(this.step == 1){
				// console.log("只有一个了");
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
		// console.log("before:"+self.goes)
		switch(this.direction){
			case "left":
				if(self.goes <= 0){
					self.goes = 0;
					// console.log("toL over");
					return false;
				}
				self.ctrR.removeClass('un');
				if(self.locations){
					self.ctrR.attr("href","javascript:;");
					self.ctrR.children().html("").removeClass("text");
				}
				if(self.flag){				
					self.flag = false;
					self.s = 0;
					if(index){
						// console.log("有index")
						self.goes = index -1
					}else{
						self.goes = self.goes - 1
					}
					// console.log("prev goes"+ self.goes);
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
					// console.log("toR over");
					return false;
				}
				self.ctrL.removeClass("un");
				if(self.flag){
					self.flag = false;
					
					if(index){
						// console.log("有index")
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
					// console.log("next goes"+ self.goes);
					if(self.goes == self.step-1){
						q = self.slw - self.objw * self.step;
						self.s += q;
						if(self.locations){					
							self.ctrR.children().html("查看更多").addClass("text");
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
			self.ctrR.attr("href","javascript:;");
			self.ctrR.children().html("").removeClass("text");
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

var scrollTo = function(obj,rec){
	this.obj = $(obj) || null;
	this.rec = $(rec) || null;
	this.pos = [];
	this.t = [];
	this.pushText();
}
scrollTo.prototype = {
	getInfo:function(){
		var self = this;
		self.obj.each(function(){
			self.pos.push($(this).offset().top);
			self.t.push($(this).data("col"));
		})
		console.log(self.pos);
	},
	pushText:function(){
		this.getInfo();
		for(var i = 0; i < this.t.length; i++){
			this.rec.append("<li><i class='img-sprite icon-rhombus'></i>"+ this.t[i] +"</li>")
		}
		this.rec.children().first().addClass("act");
		new slider(".sub-list-slider",".slider-left",".slider-right",false,"width");
	},
	goTo:function(){

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

	new scrollTo(".scenarized-shop-col","[data-scrollTo='true']");

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
})