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
        CLASS_LIST = 'jq-notice-list';

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
            $('<div>').addClass(CLASS_STICK).addClass(CLASS_SCROLL).append(
                $('<div>').addClass(CLASS_CONTENT)
            )
        ).append(
            $('<div>').addClass(CLASS_LIST).addClass(CLASS_SCROLL).append(
                $('<div>').addClass(CLASS_CONTENT)
            )
        ),
        div_stick = '.jq-notice-stick .jq-notice-content',
        div_list = '.jq-notice-list .jq-notice-content',
        _notice_events = [],
        _notice_action = false;

    $.notice = function(text,options) {

        settings = $.extend({}, defaults, options);

        setAlign();
        setShape();

        if ( ! $('body .jq-notice').length ){
            $('body').append($div);
        }

        var _notice = _notice_factory(text, settings.delay, settings.speed, settings.stick, settings.priority, settings.callback);

        if ( settings.stick ){
            $(div_stick).append(_notice);
        } else {
            $(div_list).append(_notice);
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

            var obj = $('<div>').addClass('jq-notice-item-wrap')
                .append($('<div>').addClass('jq-notice-item').addClass('priority-' + priority)
                    .append($('<span>').addClass('jq-notice-item-content').text(text))
                    .append($('<span>').addClass('jq-notice-item-close'))
            );

            if ( stick ){

                var obj_close = obj.children().children('.jq-notice-item-close');

                obj_close.on('click.jq-notice-item-close', function(e) {

                    e.preventDefault();

                    var _notice = $(this).parents('.jq-notice-item-wrap');

                    _notice.animate({                   // Manual Remove, ToDO: Need more options
                        opacity: 0
                    }, speed, function(){
                        obj.remove();                   // Step 1: remove html element
                        callback();                     // Step 2: execute possible callback
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
                $('.' + CLASS_DIV).remove();
                _notice_action = false;
            }
        }

    };

}));