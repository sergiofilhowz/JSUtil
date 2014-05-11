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
