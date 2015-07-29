;(function ( $, window, document, undefined ) {

	var _loadCustomSlider = "loadCustomSlider",
        defaults = {
            speed: 1000,
            autoslide:false
        };
     /*resize hack*/   
     var resizeWindow = false;

	function SliderPlug( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = _loadCustomSlider;
        this._interval =[];
        this._clicked = false;
        this._localHeight=0;
        this.init();


    }
    SliderPlug.prototype.init = function () {
    	var hrSlider = $(this.element).find(".hr_slider");
    	var vrSlider = $(this.element).find(".vr_slider");
    	this._prev = $(this.element).find(".cust_prev");
    	this._next = $(this.element).find(".cust_next");
    	this._hrSlider = hrSlider;
    	this._vrSlider = vrSlider;
    	this.CloneSlides();    	
    };

    $.fn[_loadCustomSlider] = function ( options ) {
    	var _sc = this;

        return _sc.each(function () {
            if ( !$.data(this, "plugin_" + _loadCustomSlider )) {
                $.data( this, "plugin_" + _loadCustomSlider,
                new SliderPlug( this, options ));
            }
            $(window).resize(function(){
               resizeWindow = true;
    			return _sc.each(function (){
    				for (var i = 0; i < ($.data(this,"plugin_" + _loadCustomSlider))._interval.length; i++)
		     		{
		    			clearInterval(($.data(this,"plugin_" + _loadCustomSlider))._interval[i]);
		     		}
    				$(this).find(".hr_slider_wrap,.cust_slides,.cust_slides li,.vr_slider_wrap,.cust_prev,.cust_next").removeAttr('style');
    				$(this).find(".cust_slides li.vr_clone").remove();
                    $(this).unbind('mouseenter mouseleave');
    				$.data(this,"plugin_" + _loadCustomSlider,new SliderPlug( this, options));
    			});
	    	});
            $(window).on("orientationchange",function(){
                return _sc.each(function (){
                    for (var i = 0; i < ($.data(this,"plugin_" + _loadCustomSlider))._interval.length; i++)
                    {
                        clearInterval(($.data(this,"plugin_" + _loadCustomSlider))._interval[i]);
                    }
                    $(this).find(".hr_slider_wrap,.cust_slides,.cust_slides li,.vr_slider_wrap,.cust_prev,.cust_next").removeAttr('style');
                    $(this).find(".cust_slides li.vr_clone").remove();
                    $(this).unbind('mouseenter mouseleave');
                    $.data(this,"plugin_" + _loadCustomSlider,new SliderPlug( this, options));
                });
            });
        });
    }
    SliderPlug.prototype.SetWidth = function()
    {
        this._hrSlider.find(".cust_slides").width(WidthCount(this._hrSlider));
        this._totalContainerWidth = $(this.element).width();
         
    }
    SliderPlug.prototype.CloneSlides = function()
    {
    	var verticalLength = this._vrSlider.find(".cust_slides li").length;
    	var mod = verticalLength % 3;
    	var remain = (mod !==0) ? (3-mod):(verticalLength <=3?2:0);
    	if(remain >0)
    	{
    		var remain_Slides = this._vrSlider.find(".cust_slides li").slice(0,remain+1).clone();
    		var firstDefault_li = this._vrSlider.find(".cust_slides li:last").clone();
    		remain_Slides.addClass("vr_clone");
    		firstDefault_li.addClass("vr_clone");
    		this._vrSlider.find(".cust_slides").prepend(firstDefault_li);
    		this._vrSlider.find(".cust_slides").append(remain_Slides);
    		
    		var remain_Slides_hr = this._hrSlider.find(".cust_slides li").slice(0,remain).clone();
    		remain_Slides_hr.addClass("vr_clone");
    		this._hrSlider.find(".cust_slides").append(remain_Slides_hr);
			if(remain<2)
    		{
    			this._vrSlider.find(".cust_slides").append(remain_Slides.clone());	
    		}

    	}
    	this.SliderTransform();
    }
    SliderPlug.prototype.SliderTransform = function(e)
    {
    	
    	this._xslide = this._hrSlider, this._yslide = this._vrSlider; this._xposVal= 0, this._yposVal= 0 , this._defaultxpos = this._xslide.width();
    	var dW = (73.69 * $(this.element).width()) / 100;

    	this._xslide.find(".cust_slides li").width(this._defaultxpos);
    	this._xslide.closest(".hr_slider_wrap").width(this._defaultxpos);
    	
    	this.SetWidth();	
    	
    	this._yslide.closest(".vr_slider_wrap").width(this._totalContainerWidth - this._defaultxpos);
    	
    	/*equal height*/
        this._localHeight = GetMaxHeight(this._xslide.find(".cust_slides li"))
    	this._yslide.closest(".vr_slider_wrap").height(this._localHeight);
    	this._defaultypos = this._localHeight/3;

    	this._next.width(this._totalContainerWidth - this._defaultxpos);
    	this._prev.width(this._totalContainerWidth - this._defaultxpos);
    	
    	this._next.height(this._defaultypos);
    	this._prev.height(this._defaultypos);

    	this._yslide.find(".cust_slides li").height(this._defaultypos);
    	
		this.NextClicked(this);
		this.PrevClicked(this);	
		this.Clear(this._xslide.find(".cust_slides li .slider_contents a"));	
		
        if(this.options.autoslide)
        {
            this.SliderAuto();
            this.SliderHover();
        }
    	
    }
    SliderPlug.prototype.SliderAuto = function()
    {

    	var slide_this = this; /* :) */
    	if(slide_this.options.autoslide)
    	{
	    	slide_this._interval.push(setInterval(function(){
	    		slide_this._next.trigger('click');
	    	},slide_this.options.speed));
    	}
    }
     SliderPlug.prototype.SliderHover = function()
     {
     	var slide_this = this; /* :) */
        
     	$(this.element).hover(function(){
     		for (var i = 0; i < slide_this._interval.length; i++)
     		{
    			clearInterval(slide_this._interval[i]);
     		}
            slide_this._interval = new Array();
    	},function(){ 
    		if(!slide_this._clicked) 
    			slide_this.SliderAuto();
    		}
    	);
     }
     SliderPlug.prototype.Clear = function(_slide)
     {
     	var slide_this = this; /* :) */
     	_slide.click(function(e){
	     	for (var i = 0; i < slide_this._interval.length; i++)
	     		{
	    			clearInterval(slide_this._interval[i]);
	     		}
			slide_this._clicked= true;
     	});
     }
      SliderPlug.prototype.NextClicked = function(_scope)
      {
      	var slide_this = _scope; /* :) */
		slide_this._next.click(function(e){
	      	 e.preventDefault();
	    
	      	if(slide_this._xposVal<0)
	    		{
	    			slide_this._xposVal=0;
	    		}
	    		var totalLiHorizontalNotClone = slide_this._xslide.find(".cust_slides li").not(".vr_clone").length;
	    		if(slide_this._xposVal >= WidthCount(slide_this._xslide) -((1) * slide_this._defaultxpos))
	    		{
	    			//reset
	    			slide_this._xposVal =(-0);
	    			var xpos = "translate("+(slide_this._xposVal)+"px,0)";
	    			//slide_this._xslide.find(".cust_slides").css("-webkit-transform",xpos);
	    			CSSTransform(slide_this._xslide,xpos);
	    			
	    		}
	    		else
	    		{
					var xpos = "translate(-"+(slide_this._xposVal+slide_this._defaultxpos)+"px,0)";
		    		// slide_this._xslide.find(".cust_slides").css("-webkit-transform",xpos);
		    		CSSTransform(slide_this._xslide,xpos);
		    		slide_this._xposVal= slide_this._xposVal+slide_this._defaultxpos;
	    		}


	    		if(slide_this._yposVal<0)
	    		{
	    			slide_this._yposVal=0;
	    		}
	    		
	    		if(slide_this._yposVal == (totalLiHorizontalNotClone + 1) * slide_this._defaultypos)
	    		{
	    			
	    			slide_this._yposVal= (-0);
	    			
	    			var ypos = "translate(0,-"+(slide_this._yposVal)+"px)";
	    			// slide_this._yslide.find(".cust_slides").css("-webkit-transform",ypos);
	    			CSSTransform(slide_this._yslide,ypos);
	    			
	    		}
	    		else
	    		{
	    			var ypos = "translate(0,-"+(slide_this._yposVal+slide_this._defaultypos)+"px)";
	    			// slide_this._yslide.find(".cust_slides").css("-webkit-transform",ypos);
	    			CSSTransform(slide_this._yslide,ypos);
	    			slide_this._yposVal= slide_this._yposVal+slide_this._defaultypos;
	    		}
	    	});
      }
      SliderPlug.prototype.PrevClicked = function(_scope)
      {
      	var slide_this = _scope; /* :) */
		slide_this._prev.click(function(e){
	    	e.preventDefault();
	    	var xpos = "translate(-"+(slide_this._xposVal-slide_this._defaultxpos)+"px,0)";
    		// slide_this._xslide.find(".cust_slides").css("-webkit-transform",xpos);
    		CSSTransform(slide_this._xslide,xpos);
    		slide_this._xposVal= slide_this._xposVal-slide_this._defaultxpos;
    		

    		var ypos = "translate(0,-"+(slide_this._yposVal-slide_this._defaultypos)+"px)";
    		//slide_this._yslide.find(".cust_slides").css("-webkit-transform",ypos);
    		CSSTransform(slide_this._yslide,ypos);
    		slide_this._yposVal= slide_this._yposVal-slide_this._defaultypos;

	    });
      }
    function WidthCount(el)
    {
    	var _widthSlider = 0;
    	$(el).find(".cust_slides li").each(function(){
    	 _widthSlider+=$(this).find(".slider_contents").width();
    	});
    	return _widthSlider;
    }
     function GetMaxHeight(el)
    {
       var _max = 0;
        $(el).each(function () {
        thisHeight = $(this).height();
        if (thisHeight > _max) {
            _max = thisHeight;
        }
    });
    return _max;
    }
    function CSSTransform(_slide,pos)
    {
    	_slide.find(".cust_slides").css({
		  '-webkit-transform' : pos,
		  '-moz-transform'    : pos,
		  '-ms-transform'     : pos,
		  '-o-transform'      : pos,
		  'transform'         : pos
		});

    }
})( jQuery, window, document );
