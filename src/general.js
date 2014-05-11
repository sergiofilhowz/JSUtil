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
