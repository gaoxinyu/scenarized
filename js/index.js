var isHandle = {
    lowerIE8: function() {
        var agent = navigator.userAgent.toLowerCase();
        //var ieAgent = /msie\s*(\d)/.exec(navigator.userAgent.toLowerCase());
        if (agent.indexOf("msie") < 0) return false;
        var ieAgent = agent.split("msie");
        return parseInt(ieAgent[1].split(";")[0]) <= 8;
    }
};


var slider = function(obj){
	this.obj = $(obj) || null;
	this.sl = this.wrap.children();
	this.ow = this.obj.outerWidth();
	this.slw = this.sl.outerWidth();
	this.step = 0;
}
slider.prototype = {
	init:function(){
		var ch = this.sl.children();

	},
	prev:function(){
		
	},
	next:function(){

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
})