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
    this.previousArrow = $el.find('.jsutil-previous-arrow');
    this.nextArrow = $el.find('.jsutil-next-arrow');
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
 * 1 - jsutil-slider           el (the slider's body element)
 * 2 - jsutil-paginator        paginador (the paginator's body element inside the slider)
 * 3 - jsutil-paginator-item   item do paginador (each paginator's item inside paginator)
 * 4 - jsutil-previous-arrow   seta-esquerda (HTML element that represents the left-arrow, this is optional)
 * 5 - jsutil-next-arrow       seta-direita (HTML element that represents the right-arrow, this is optional)
 */
$.prototype.slider = function (pageChangeHandler, initFunction) {
    'use strict';
    var list = [];
    
    this.each(function (index, item) {
        list.push(new Slider($(item), pageChangeHandler, initFunction));
    });
    
    return list;
};