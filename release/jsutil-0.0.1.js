/* 
 * JSUtil 0.0.1 is under MIT License (c) 2014 Sérgio Marcelino 
 * 
 * Author: http://sergio.filho.org 
 * More details on http://github.com/sergiofilhow/JSUtil 
 * 
 */ 

/*jslint browser: true*/
/*global $, jQuery, alert*/

/**
 * Hide the object if it's not hidden
 * @trigger hide event
 */
$.fn.hide = function () {
    
    'use strict';
    
	this.each(function (index, item) {
		var $item = $(item);

		if (!$item.hasClass('hidden')) {
			$item.addClass('hidden');
			$item.trigger('hide');
		}
	});
};

/**
 * Show the object if it's hidden
 * @trigger show event
 */
$.fn.show = function () {
    
    'use strict';
    
	this.each(function (index, item) {
		var $item = $(item);

		if ($item.hasClass('hidden')) {
			$item.removeClass('hidden');
			$item.trigger('show');
		}
	});
};

var JSUtil = {
    /**
     * Set the default values for an object
     */
    defaults : function (object, defaults) {

        'use strict';

        var opt;
        object = object || {};

        for (opt in defaults) {
            if (object[opt] === undefined) {
                object[opt] = defaults[opt];
            }
        }
        
        return object;
    }
};

/*jslint browser: true*/
/*global $, jQuery, alert, JSUtil*/

$.fn.customScroll = function (options) {

    'use strict';
    
    var defaults = {
        fade : false,                   // true or false for fade on focus
        resizable : true,               // Indicates the scroll size is fixed or not
        scrollClass : 'jsutil-scroll',  // The scroll bar class name
        pinClass : 'jsutil-pin'         // The scroll pin class name
    };
    
    options = JSUtil.defaults(options, defaults);
    
    var setScrollHeight = function (scroll) {
        var item = scroll.targetEl,
            $item = $(item),
            pin = item.scrollPin,
            height = $item.height(),
            pinHeight = item.clientHeight / item.scrollHeight * 100;
        
        scroll.css('height', height);

        if (options.resizable) {
            pin.css('height', pinHeight + '%');
        }
    };
    
    var showHandler = function (evt) {
        var item = evt.currentTarget,
            $item = $(item),
            $scroll = $(item.scrollBar);

		if (item.clientHeight >= item.scrollHeight) {
			$scroll.hide();
		} else {
			$scroll.show();
		}

        setScrollHeight(item.scrollBar);
    };
    
	this.each(function (index, item) {

		var $item = $(item),
            scroll = $('<div></div>'),
            pin = $('<div></div>');
        
        scroll.addClass(options.scrollClass);
        pin.addClass(options.pinClass);

		if (item.clientHeight >= item.scrollHeight) {
			scroll.hide();
		}

        scroll.targetEl = item;
		scroll.append(pin);
        
        $item.parent().append(scroll);
		item.scrollBar = scroll;
		item.scrollPin = pin;
        
        setScrollHeight(scroll);

        if (!options.resizable) {
            pin.css('margin-top', pin.height() / -2);
        }
		
        if (options.fade) {
			pin.animate({ opacity : 0 });
            
            $item.hover(function (evt) {
                var target = evt.currentTarget,
                    pin = target.scrollPin;
                pin.stop().animate({ opacity : 1 });
            }, function (evt) {
                var target = evt.currentTarget,
                    pin = target.scrollPin;
                pin.stop().animate({ opacity : 0 });
            });
		}
        
		pin.enableDrag();
		pin.on('drag', function (evt, data) {
            
            // @todo Implement the drag on option resizable == true
            
			var scrollTop = scroll.offset().top,
                scrollBottom = scrollTop + scroll.height(),
                top = pin.offset().top + pin.height() / 2,
                pageY = data.pageY,
                percent = (pageY - scrollTop) / scroll.height() * 100,
                resto,
                toScroll;

			if (percent <= 0) {
				$item.scrollTop(0);
			} else if (percent >= 100) {
				$item.scrollTop(item.scrollHeight);
			} else {
				resto = item.scrollHeight - item.clientHeight;
				toScroll = percent * resto / 100;
                
				$item.scrollTop(toScroll);
			}

		});

		$(window).resize(function () {

			if (item.clientHeight >= item.scrollHeight) {
				scroll.hide();
			} else {
				scroll.show();
			}

            setScrollHeight(scroll);
		});

	});
	this.on('scroll', function (evt) {
		var item = evt.currentTarget,
            pin = item.scrollPin,
            scroll = item.scrollBar,
            resto = item.scrollHeight - item.clientHeight,
            actualHeight = item.scrollHeight,
            top = options.resizable ? item.scrollTop / actualHeight * 100 : item.scrollTop / resto * 100;
		
		pin.css('top', top + '%');
	});
    
	this.on('resize', showHandler);
    this.on('show', showHandler);
    
    this.on('hide', function (evt) {
        var item = evt.currentTarget,
            scroll = item.scrollBar,
            $scroll = $(scroll);
        
        $scroll.hide();
    });

};

/*jslint browser: true*/
/*global $, jQuery, alert, JSUtil*/


/**
 * Enable Swipe events handling
 *
 * @var options.tolerance   Indicate the pixel distance to be considered a 
 *                          swipe, the default value is 100.
 *
 * @events                  swipedown, swipeup, swipeleft, swiperight
 */
$.fn.enableSwipe = function (options) {
    
    'use strict';
    
    var defaults = {
        tolerance : 100  // Indicate the pixel distance to be considered a swipe, the default value is 100.
    };
    
    options = JSUtil.defaults(options, defaults);
	
	var isTouch = 'ontouchstart' in window,
        touchStart = isTouch ? 'touchstart' : 'mousedown',
        touchMove = isTouch ? 'touchmove' : 'mousemove',
        touchEnd = isTouch ? 'touchend' : 'mouseup';

	this.on(touchStart, function (evt) {
		var pageX = isTouch ? evt.originalEvent.pageX : evt.pageX,
            pageY = isTouch ? evt.originalEvent.pageY : evt.pageY;

		evt.currentTarget.mouseDownX = pageX;
		evt.currentTarget.mouseDownY = pageY;

		if (!isTouch) {
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		}
	});
	this.on(touchMove, function (evt) {
		if (!isTouch) {
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		} else {
			evt.currentTarget.lastPageX = evt.originalEvent.pageX;
			evt.currentTarget.lastPageY = evt.originalEvent.pageY;
		}
	});
	this.on(touchEnd, function (evt) {
		var $target = $(evt.currentTarget),
            pageX = isTouch ? evt.currentTarget.lastPageX : evt.pageX,
            pageY = isTouch ? evt.currentTarget.lastPageY : evt.pageY,
            mouseDownX = evt.currentTarget.mouseDownX,
            mouseDownY = evt.currentTarget.mouseDownY;

		evt.currentTarget.mouseDownX = undefined;
		evt.currentTarget.mouseDownY = undefined;

		if (mouseDownY + options.tolerance < pageY) {
			$target.trigger('swipedown');
		} else if (mouseDownY - options.tolerance > pageY) {
			$target.trigger('swipeup');
		}

		if (mouseDownX + options.tolerance < pageX) {
			$target.trigger('swiperight');
		} else if (mouseDownX - options.tolerance > pageX) {
			$target.trigger('swipeleft');
		}

		if (!isTouch) {
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		}
	});
};

/**
 * @author sergiofilhow@gmail.com
 * 
 * Enable Drag n' Drop event handling
 *
 * @events drag
 */
$.fn.enableDrag = function () {
    
    'use strict';
    
	var me = this,
        isTouch = 'ontouchstart' in window,
        touchStart = isTouch ? 'touchstart' : 'mousedown',
        touchMove = isTouch ? 'touchmove' : 'mousemove',
        touchEnd = isTouch ? 'touchend' : 'mouseup';

	var touchMoveHandler = function (evt) {
		var $this = $(me);
        
		$this.trigger('drag', {
			pageX : evt.originalEvent.pageX,
			pageY : evt.originalEvent.pageY
		});

		evt.preventDefault();
		evt.stopPropagation();
		return false;
	};

	this.on(touchStart, function (evt) {
		$('body').bind(touchMove, touchMoveHandler);
		$('body').one(touchEnd, function () {
			$('body').unbind(touchMove, touchMoveHandler);
		});

		if (!isTouch) {
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		}
	});
};
