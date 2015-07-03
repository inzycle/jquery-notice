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

    var defaults = {
            align: 'bottom right',
            shape: 'rounded'
        },
        settings = {},
        $doc = $(document),
        $win = $(window),
        $div = $('<div>');

    $.elevator = function(options) {

        settings = $.extend({}, defaults, options);

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

        function init() {

            $div.addClass('jq-elevator');

            setAlign();
            setShape();

            $('body').append($div);

        }

        init();

    };

}));