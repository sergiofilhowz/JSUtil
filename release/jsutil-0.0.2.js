/* 
 * JSUtil 0.0.2 is under MIT License (c) 2014 Sérgio Marcelino 
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
/*global $, jQuery, JSUtil*/

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
        
        $item.parent().addClass('jsutil-no-overflow');
        $item.addClass('jsutil-scrollable');
        $item.append(scroll);
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
		
        scroll.css('margin-top', item.scrollTop);
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
 * Remaining elements to trigger the event
 */
$.scrollshowElements = [];

/**
 * This function is called to make the element listen when he
 * appears on screen while scrolling.
 *
 * @param {Function} trigger - The function called when the element appears,
 *                             the param received by this function is the element
 */
$.fn.scrollshow = function (trigger) {
    
    'use strict';
    
    this.each(function (index, item) {
        $.scrollshowElements.push({
            el : item,
            trigger : trigger
        });
    });
    
};

$(document).ready(function () {

    'use strict';
    
    $(window).scroll(function (evt) {
        var target = $(evt.currentTarget),
            len = $.scrollshowElements.length,
            i,
            element;
        
        for (i = 0; i < len; i = i + 1) {
            element = $.scrollshowElements[i];
            if (target.scrollTop() + window.innerHeight > $(element.el).offset().top) {
                $.scrollshowElements.splice(i, 1);
                element.trigger(element.el);
                break;
            }
        }
    });

});
/*jslint browser: true*/
/*global $, jQuery, alert*/

/**
 * @class
 *
 * @param {$Element} $el - The jQuery representation of the slider's element.
 * @param {Function} pageChangeHandler - The function to be called whenever the pages change.
                                         This function receives the current paginator item 
                                         and the next paginator item.
 * @param {Function} initFunction - A function called when constructing the object.
 * @throws {Error} If there's none .jsutil-paginator element inside slider
 *
 * The initFunction is important to map all mutable elements of the slider and use them on
 * the pageChangeHandler function to change the elements' contents.
 */
function Slider($el, pageChangeHandler, initFunction) {
    'use strict';
    
    this.el = $el;
    this.paginator = $el.find('.jsutil-paginator');
    this.previousArrow = $el.find('.jsutil-slider-previous-arrow');
    this.nextArrow = $el.find('.jsutil-slider-next-arrow');
    this.paginatorItems = [];
    this.currentItem = undefined;
    
    if (this.paginator.length === 0) {
        throw new Error('The slider needs a paginator with class jsutil-paginator');
    }
    
    this.pageChangeHandler = pageChangeHandler;
    
    if (initFunction !== undefined) {
        initFunction.call(this);
    }
    
    var me = this,
        first, // the first element on the list
        lastItem; // the last element on the iteration
    
    // indexing items to make them work like a circular linked list
    this.paginator.find('.jsutil-paginator-item').each(function (index, item) {
        if (index === 0) {
            first = item;
        }
        
        if (lastItem !== undefined) {
            lastItem.$nextItem = item;
        }
        
        $(item).click(function (evt) {
            me.itemClickHandler(evt);
        });
        
        item.$previousItem = lastItem;
        me.paginatorItems.push(item);
        lastItem = item;
    });
    
    if (first !== undefined) {
        this.pageChange($(first));
        
        first.$previousItem = lastItem;
        
        if (first === lastItem) {
            // this is necessary to make the single item reference itself
            first.$nextItem = first;
        }
    }
    
    if (lastItem !== undefined) {
        lastItem.$nextItem = first;
    }
    
    this.previousArrow.click(function (evt) {
        me.previousArrowClickHandler(evt);
    });
    
    this.nextArrow.click(function (evt) {
        me.nextArrowClickHandler(evt);
    });
}

/** 
 * @private 
 */
Slider.prototype.previousArrowClickHandler = function (evt) {
    'use strict';
    this.el.trigger('previous-arrow-click', [ evt.currentTarget ]);
    this.pageChange($(this.currentItem.$previousItem));
};

/** 
 * @private 
 */
Slider.prototype.nextArrowClickHandler = function (evt) {
    'use strict';
    this.el.trigger('next-arrow-click', [ evt.currentTarget ]);
    this.pageChange($(this.currentItem.$nextItem));
};

/** 
 * @private 
 */
Slider.prototype.pageChange = function ($nextItem) {
    'use strict';
    this.el.trigger('page-change', [ this.currentItem, $nextItem.get(0) ]);
    this.pageChangeHandler.call(this, this.currentItem, $nextItem);
    this.currentItem = $nextItem.get(0);
};

/** 
 * @private 
 */
Slider.prototype.itemClickHandler = function (evt) {
    'use strict';
    this.el.trigger('paginator-item-click', [ evt.currentTarget ]);
    if (evt.currentTarget !== this.currentItem) {
        this.pageChange($(evt.currentTarget));
    }
};

/**
 * Function jQuery to make the element slideable
 *
 * @param {Function} pageChangeHandler - The function to be called whenever the pages change.
                                         This function receives the current paginator item 
                                         and the next paginator item.
 * @param {Function} initFunction - A function called when constructing the object.
 * @return {Array} returns an array os slider items created, one for each element 
 *                 returned from selector
 * @events
 * 1 - page-change (receives the current paginator item and the next paginator item)
 * 2 - previous-arrow-click (receives the arrow's element)
 * 3 - next-arrow-click (receives the arrow's element)
 * 4 - paginator-item-click (receives the paginator item clicked)
 *
 * The element must have the following structure:
 * 1 - jsutil-slider                  the slider's body element
 * 2 - jsutil-paginator               the paginator's body element inside the slider
 * 3 - jsutil-paginator-item          item do paginador (each paginator's item inside paginator
 * 4 - jsutil-slider-previous-arrow   HTML element that represents the left-arrow, this is optional
 * 5 - jsutil-slider-next-arrow       HTML element that represents the right-arrow, this is optional
 */
$.prototype.slider = function (pageChangeHandler, initFunction) {
    'use strict';
    var list = [];
    
    this.each(function (index, item) {
        list.push(new Slider($(item), pageChangeHandler, initFunction));
    });
    
    return list;
};
/*jslint browser: true*/
/*global $, jQuery, JSUtil*/

function Stepper($el, options) {
    'use strict';
    
    this.HORIZONTAL = 'horizontal';
    this.VERTICAL = 'vertical';
    
    this.el = $el;
    this.body = $el.find('.jsutil-stepper-body');
    this.previousArrow = $el.find('.jsutil-stepper-previous-arrow');
    this.nextArrow = $el.find('.jsutil-stepper-next-arrow');
    
    this.orientation = options.orientation || this.HORIZONTAL;
    this.stepSize = options.stepSize;
    this.duration = options.duration;
    this.tolerance = options.tolerante;
    this.stepWidth = options.stepLength;
    
    var me = this,
        firstChild = this.body.children().first(),
        scrollSize = this.orientation === this.HORIZONTAL ?
                this.body.get(0).scrollWidth : this.body.get(0).scrollHeight,
        size = this.orientation === this.HORIZONTAL ? this.body.width() : this.body.height();
    
    if (this.stepWidth === undefined) {
        // The step width is based on the first child width
        this.stepWidth = firstChild.width() + parseInt(firstChild.css('margin-right').replace('px', ''), 10);
    }
    
    this.calculateArrows();
    
    this.previousArrow.click(function (evt) {
        me.previousArrowClickHandler(evt);
    });
    
    this.nextArrow.click(function (evt) {
        me.nextArrowClickHandler(evt);
    });
}

/**
 * @private
 */
Stepper.prototype.previousArrowClickHandler = function (evt) {
    'use strict';
    
    this.el.trigger('previous-arrow-click', [ evt, this ]);
    this.performStep(true);
};

/**
 * @private
 */
Stepper.prototype.nextArrowClickHandler = function (evt) {
    'use strict';
    
    this.el.trigger('next-arrow-click', [ evt, this ]);
    this.performStep(false);
};

/**
 * @private
 */
Stepper.prototype.performStep = function (subtract) {
    'use strict';
    
    var property = this.orientation === this.HORIZONTAL ? 'scrollLeft' : 'scrollTop',
        scroll = this.body[property](),
        maxScroll = this.orientation === this.HORIZONTAL ?
                this.body.get(0).scrollWidth - this.body.width() :
                this.body.get(0).scrollHeight - this.body.height(),
        properties = {},
        me = this;
    
    scroll = subtract ? scroll - (this.stepSize * this.stepWidth) :
            scroll + (this.stepSize * this.stepWidth);
    scroll = scroll < this.tolerance ? 0 : scroll;
    scroll = scroll > maxScroll - this.tolerance ? maxScroll : scroll;
    
    properties[property] = scroll;
    
    this.body.stop().animate(properties, this.duration, function () {
        me.calculateArrows();
    });
    
};

Stepper.prototype.calculateArrows = function () {
    'use strict';
    
    var property = this.orientation === this.HORIZONTAL ? 'scrollLeft' : 'scrollTop',
        scroll = this.body[property](),
        maxScroll = this.orientation === this.HORIZONTAL ?
                this.body.get(0).scrollWidth - this.body.width() :
                this.body.get(0).scrollHeight - this.body.height();
    
    if (scroll === 0) {
        this.el.removeClass('jsutil-prev-available');
    } else {
        this.el.addClass('jsutil-prev-available');
    }
    
    if (scroll === maxScroll) {
        this.el.removeClass('jsutil-next-available');
    } else {
        this.el.addClass('jsutil-next-available');
    }
};

/**
 * Function jQuery to make the element a stepper
 *
 * @param {Object} options     The object that contains the configurations for the stepper.
 *
 * @param {String} options.orientation     The orientation which the stepper must behave, 
 *                                         'horizontal' or 'vertical'. Defaults to 'horizontal'
 *
 * @param {Number} options.stepSize     The size (not in pixel, but in steps) the stepper 
 *                                      will scroll when clicking on an arrow. Defaults to 1
 *
 * @param {Number} options.duration     The time in miliseconds of the duration of the 
 *                                      scrolling animation. Defaults to 500
 *
 * @param {Number} options.tolerance    The tolerance the stepper will consider the limit of the scroll,
 *                                      if the scroll if close to the limit, the scroll will increase to the limit.
 *
 * @param {Number} options.stepLength   The Length (pixel width when horizontal, pixel height when vertical) of each step.
 *                                      Defaults to undefined, calculate the width when horizontal, height when vertical of the
 *                                      the first element on the body.
 *
 * @return {Array} returns an array os slider items created, one for each element 
 *                 returned from selector
 * @events
 * 1 - previous-arrow-click (receives the event of arrow's click and the Stepper)
 * 2 - next-arrow-click (receives the event of arrow's click and the Stepper)
 *
 * The element must have the following structure:
 * 1 - jsutil-stepper                  the main stepper's element
 * 2 - jsutil-stepper-body             the stepper's body element (the scrollable content)
 * 3 - jsutil-stepper-previous-arrow   HTML element that represents the left-arrow, this is optional
 * 4 - jsutil-stepper-next-arrow       HTML element that represents the right-arrow, this is optional
 * 
 * The main stepper's element (jsutil-stepper) will have the following classes when:
 * 1 - jsutil-prev-available   When the previous arrow is available (enabled)
 * 2 - jsutil-next-available   When the next arrow is available (enabled)
 */
$.prototype.stepper = function (options) {
    'use strict';
    var list = [],
        defaults = {
            stepSize : 1,
            duration : 500,
            tolerante : 20,
            stepLength : undefined,
        };
    
    options = JSUtil.defaults(options, defaults);
    
    this.each(function (index, item) {
        var stepperObject = new Stepper($(item), options);
        item.JSUtilStepper = stepperObject;
        list.push(stepperObject);
    });
    
    return list;
};

$.prototype.getStepper = function () {
    'use strict';
    return this.get(0).JSUtilStepper;
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
