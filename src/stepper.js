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