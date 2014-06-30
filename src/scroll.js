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
