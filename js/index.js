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
	this.objw = this.obj.outerWidth(true);			
	this.ctrL = this.obj.siblings(ctrL);			
	this.ctrR = this.obj.siblings(ctrR);			
	this.flag = true;								
	this.setTri = setTri;							
	this.slw = 0;									
	this.goes = 0;									
	this.step = 0;									
	this.types = types || "nums";					
	this.nums = this.obj.data("nums") || null;		
	this.init();
}
slider.prototype = {
	init:function(){
		var self = this;
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
		this.ctrL.bind({
			"click":function(){
				self.prevs();
			}
		})
		this.ctrR.bind({
			"click":function(){
				self.nexts();			}
		})
		// 底部原点
		this.setTrigger();
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
					this.setTri = false;
					this.ctrL.hide();
					this.ctrR.hide();
				}else{
					this.setTri = false;
					this.ctrL.removeAttr("style");
					this.ctrR.removeAttr("style");
				}
				break;
		}
	},
	setTrigger:function(){
		var self = this;
		if(this.setTri){
			this.trigger = this.obj.siblings('.slider-trigger');
			// console.log("tirgger's num = "+this.tLen);
			for(var i = 0; i < this.step; i++){
				this.trigger.append("<li></li>");
			}
			this.trigger.children().first().addClass("act");
			this.trigger.css({
				"marginLeft": -self.trigger.width()/2
			})
		}else{

		}
	},
	prevs:function(){
		var self = this;
		self.ctrR.removeClass('un');
		if(self.flag){
			self.flag = false;		
			if(self.goes <= 0){
				self.goes = 0;
				console.log("toL over");
				return false;
			}
			var s = 0;
			self.goes -= 1;
			if(self.types == "nums"){
				self.chsw = self.chs.outerWidth(true);
				self.objw = self.nums * self.chsw;
			}
			s += self.objw * self.goes;
			console.log(s)
			console.log("prev goes"+ self.goes);
			if(self.goes == 0){
				self.ctrL.addClass('un');
			}
			self.sl.animate({
				"left":-s
			},400,function(){
				self.flag = true;
			});
			switch(self.types){
				case "width":
					
					break;
				case "nums":
					break;
			}			
		}
	},
	nexts:function(){
		var self = this;
		self.ctrL.removeClass("un");
		if(self.flag){
			self.flag = false;
			if(self.goes >= self.step-1){
				self.goes = self.step-1;
				console.log("toR over");
				return false;
			}
			if(self.types =="nums"){
				self.chsw = self.chs.outerWidth(true);
				self.objw = self.nums * self.chsw;
			}
			var s = 0;
			self.goes += 1;
			s = self.objw * self.goes;
			console.log("next goes"+ self.goes);
			if(self.goes == self.step-1){
				q = self.slw - self.objw * self.step;
				s += q;
				self.ctrR.addClass('un');
			}
			self.sl.animate({
				"left":-s
			},400,function(){
				self.flag = true;
			});
		}
	},
	go:function(){
		
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
				$("body").removeClass("w1200")
			}
		})
	}
	new slider(".sub-list-slider",".slider-left",".slider-right",false,"width");
	$(".shop-col-slider").each(function(){
		new slider(this,".slider-left",".slider-right",true,"nums");
	})


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