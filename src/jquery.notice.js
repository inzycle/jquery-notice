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
        CLASS_INACTIVE = 'jq-inactive';

    var defaults = {
            align: 'bottom right',
            shape: 'rounded',
            delay: 2000,
            speed: 1000,
            stick: false,
            priority: 'normal',
            callback: function(){}
        },
        settings = {},
        $div = $('<div>').addClass(CLASS_DIV).append(
            $('<div>').addClass(CLASS_STICK).addClass(CLASS_SCROLL).addClass(CLASS_INACTIVE).append(
                $('<div>').addClass(CLASS_CONTENT)
            )
        ).append(
            $('<div>').addClass(CLASS_LIST).addClass(CLASS_SCROLL).addClass(CLASS_INACTIVE).append(
                $('<div>').addClass(CLASS_CONTENT)
            )
        ),
        div_stick = '.' + CLASS_STICK + ' .' + CLASS_CONTENT,
        div_list = '.' + CLASS_LIST + ' .' + CLASS_CONTENT,
        _notice_events = [],
        _notice_action = false;

    $.notice = function(text,options) {

        settings = $.extend({}, defaults, options);

        setAlign();
        setShape();

        if ( ! $(CLASS_DIV).length ){
            $('body').append($div);
        }

        var _notice = _notice_factory(text, settings.delay, settings.speed, settings.stick, settings.priority, settings.callback);

        if ( settings.stick ){
            $(div_stick).append(_notice);
            $('.' + CLASS_STICK).removeClass(CLASS_INACTIVE);
        } else {
            $(div_list).append(_notice);
            $('.' + CLASS_LIST).removeClass(CLASS_INACTIVE);
        }

        if ( ! _notice_action ){ _notice_next(); }


        function setAlign() {

            var positions = settings.align.split(' ');

            if (positions.indexOf('top') >= 0) {
                $div.addClass('align-top');
            }

            if (positions.indexOf('bottom') >= 0) {
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

            var shape = settings.shape;

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

        function _notice_factory(text, delay, speed, stick, priority, callback) {

            var obj = $('<div>').addClass(CLASS_ITEM_WRAP)
                .append($('<div>').addClass(CLASS_ITEM).addClass('priority-' + priority)
                    .append($('<span>').addClass(CLASS_ITEM_CONTENT).text(text))
                    .append($('<span>').addClass(CLASS_ITEM_CLOSE))
            );

            if ( stick ){

                var obj_close = obj.children().children('.' + CLASS_ITEM_CLOSE);

                obj_close.on('click.' + CLASS_ITEM_CLOSE, function(e) {

                    e.preventDefault();

                    var _notice = $(this).parents('.' + CLASS_ITEM_WRAP);

                    _notice.animate({                   // Manual Remove, ToDO: Need more options
                        opacity: 0
                    }, speed, function(){
                        obj.remove();                   // Step 1: remove html element
                        callback();                     // Step 2: execute possible callback
                        _notice_destroy();              // Step 3: execute destroyer
                    });

                });


            } else {

                var fn = function(){                    // Automatic Remove, ToDO: Need more options
                    obj.delay(delay).animate({
                        opacity: 0
                    }, speed, function(){
                        _notice_events.splice(0,1);     // Step 1: remove event from tail and re-sort
                        obj.remove();                   // Step 2: remove html element
                        callback();                     // Step 3: execute possible callback
                        _notice_action = false;         // Step 4: update global flag ( executioner )
                        _notice_next();                 // Step 5: execute next animation ( sequencer )
                        _notice_destroy();              // Step 6: execute destroyer
                    });
                };

                _notice_events.push(fn);

            }

            return obj

        }

        function _notice_next(){
            if ( _notice_events.length ) {
                _notice_action = true;
                _notice_events[0]();
            } else {
                _notice_action = false;
            }
        }

        function _notice_destroy(){

            var _list = false,
                _stick = false;

            if ( ! $( '.' + CLASS_STICK).find( '.' + CLASS_ITEM).length ) {
                $('.' + CLASS_STICK).addClass(CLASS_INACTIVE);
                _stick = true;
            }

            if ( ! _notice_events.length ) {
                $('.' + CLASS_LIST).addClass(CLASS_INACTIVE);
                _list = true;
            }

            if ( _stick && _list ) {
                $div.remove();
            }

        }

    };

}));