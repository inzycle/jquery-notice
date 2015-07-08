(function(factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {

    'use strict';

    var CLASS_DIV = 'jq-notice',
        CLASS_STICK = 'jq-notice-stick',
        CLASS_SCROLL = 'jq-notice-scroll',
        CLASS_CONTENT = 'jq-notice-content',
        CLASS_LIST = 'jq-notice-list',
        CLASS_ITEM_WRAP = 'jq-notice-item-wrap',
        CLASS_ITEM = 'jq-notice-item',
        CLASS_ITEM_CONTENT = 'jq-notice-item-content',
        CLASS_ITEM_CLOSE = 'jq-notice-item-close',
        CLASS_ITEM_CLOSE_WHITE = 'close-white',
        CLASS_ITEM_CLOSE_BLOCK = 'close-block';

    var defaults_general = {

            align: 'bottom right',
            shape: 'rounded',
            delay: 2000,
            speed: 1000

        }, settings_general = {},
        defaults_notice = {

            stick: false,

            close_white: true,
            close_block: true,

            level: 'normal',

            url: null,
            id: null,

            callback: function(){}

        }, settings_notice = {},
        $div_top = $('<div>').addClass(CLASS_DIV).append(
            $('<div>').addClass(CLASS_STICK).addClass(CLASS_SCROLL).append(
                $('<div>').addClass(CLASS_CONTENT)
            )
        ).append(
            $('<div>').addClass(CLASS_LIST).addClass(CLASS_SCROLL).append(
                $('<div>').addClass(CLASS_CONTENT)
            )
        ),
        $div_bottom = $('<div>').addClass(CLASS_DIV).append(
            $('<div>').addClass(CLASS_LIST).addClass(CLASS_SCROLL).append(
                $('<div>').addClass(CLASS_CONTENT)
            )
        ).append(
            $('<div>').addClass(CLASS_STICK).addClass(CLASS_SCROLL).append(
                $('<div>').addClass(CLASS_CONTENT)
            )
        ),
        $div = null,
        div_stick = '.' + CLASS_STICK + ' .' + CLASS_CONTENT,
        div_list = '.' + CLASS_LIST + ' .' + CLASS_CONTENT,
        _notice_events = [],
        _notice_action = false;

    $.notice = function(options_general){

        settings_general = $.extend({}, defaults_general, options_general);

        function setAlign() {

            var positions = settings_general.align.split(' ');

            if (positions.indexOf('top') >= 0) {
                $div = $div_top;
                $div.addClass('align-top');
            }

            if (positions.indexOf('bottom') >= 0) {
                $div = $div_bottom;
                $div.addClass('align-bottom');
            }

            if (positions.indexOf('left') >= 0) {
                $div.addClass('align-left');
            }

            if (positions.indexOf('right') >= 0) {
                $div.addClass('align-right');
            }

        }

        function setShape() {

            var shape = settings_general.shape;

            switch (shape) {
                case 'square':
                    $div.addClass('square');
                    break;
                case 'rounded':
                    $div.addClass('rounded');
                    break;
                default:
                    $div.addClass('circle');
            }

        }

        if ( ! $('.' + CLASS_DIV).length ){
            setAlign();
            setShape();
            $('body').append($div);
        }

        return function(text,options) {

            settings_notice = $.extend({}, defaults_notice, options);

            var _notice = _notice_factory();

            if ( settings_notice.stick ){
                $(div_stick).append(_notice);
            } else {
                $(div_list).append(_notice);
            }

            if ( ! _notice_action ){ _notice_next(); }

            function _notice_factory() {

                options = $.extend({}, settings_general, settings_notice);

                var obj = $('<div>').addClass(CLASS_ITEM_WRAP)
                    .append($('<div>').addClass(CLASS_ITEM).addClass('level-' + options.level)
                        .append($('<span>').addClass(CLASS_ITEM_CONTENT))
                        .append($('<span>').addClass(CLASS_ITEM_CLOSE))
                );

                    if ( options.close_white ){
                        obj.find('.' + CLASS_ITEM_CLOSE).addClass(CLASS_ITEM_CLOSE_WHITE);
                    }

                    if ( options.close_block ){
                        obj.find('.' + CLASS_ITEM_CLOSE).addClass(CLASS_ITEM_CLOSE_BLOCK);
                    }

                if ( options.url ){
                    $('<a>').prop('href',options.url).text(text).appendTo( obj.find('.' + CLASS_ITEM_CONTENT) );
                } else {
                    obj.find('.' + CLASS_ITEM_CONTENT).text(text);
                }

                if ( options.id ){
                    obj.prop('id','jq-notice-' + options.id);
                    obj.find('.' + CLASS_ITEM_CLOSE).attr('data-id',options.id);
                    if ( options.url ){ obj.find('a').attr('data-id',options.id); }
                } else {
                    var _now = $.now();
                    obj.prop('id', 'jq-notice-' + _now);
                    obj.find('.' + CLASS_ITEM_CLOSE).attr('data-id',_now);
                    if ( options.url ){ obj.find('a').attr('data-id',_now); }
                }

                if ( options.stick ){

                    var obj_close = obj.children().children('.' + CLASS_ITEM_CLOSE);

                    obj_close.on('click.' + CLASS_ITEM_CLOSE, function(e) {

                        e.preventDefault();

                        var _notice = $(this).parents('.' + CLASS_ITEM_WRAP);

                        _notice.animate({                   // Manual Remove
                            opacity: 0
                        }, options.speed, function(){
                            obj.remove();                   // Step 1: remove html element
                            options.callback();             // Step 2: execute possible callback
                        });

                    });


                } else {

                    var fn = function(){                    // Automatic Remove
                        obj.delay(options.delay).animate({
                            opacity: 0
                        }, options.speed, function(){
                            _notice_events.splice(0,1);     // Step 1: remove event from tail and re-sort
                            obj.remove();                   // Step 2: remove html element
                            options.callback();             // Step 3: execute possible callback
                            _notice_action = false;         // Step 4: update global flag ( executioner )
                            _notice_next();                 // Step 5: execute next animation ( sequencer )
                        });
                    };

                    _notice_events.push(fn);

                }

                return obj;

            }

            function _notice_next(){
                if ( _notice_events.length ) {
                    _notice_action = true;
                    _notice_events[0]();
                } else {
                    _notice_action = false;
                }
            }

        };

    };

}));