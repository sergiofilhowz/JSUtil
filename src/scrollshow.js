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