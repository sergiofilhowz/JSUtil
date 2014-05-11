/*jslint browser: true*/
/*global $, jQuery, alert*/


/**
 * Enable Swipe events handling
 *
 * @var config.tolerance    Indicate the pixel distance to be considered a 
 *                          swipe, the default value is 100.
 *
 * @events                  swipedown, swipeup, swipeleft, swiperight
 */
$.fn.enableSwipe = function (config) {
    
    'use strict';
    
    config = config || {};
    config.tolerance = config.tolerance || 100;
	
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

		if (mouseDownY + config.tolerance < pageY) {
			$target.trigger('swipedown');
		} else if (mouseDownY - config.tolerance > pageY) {
			$target.trigger('swipeup');
		}

		if (mouseDownX + config.tolerance < pageX) {
			$target.trigger('swiperight');
		} else if (mouseDownX - config.tolerance > pageX) {
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
