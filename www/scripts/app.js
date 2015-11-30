/*ignore jslint start*/
define('app', [
    'jquery',
    'fastclick',
    'app/functions'
], function(
    $,
    FastClick
) {
    'use strict';

    var $window   = $(window);
    var $document = $(document);

    // Инициализация/Добавление/Удаление карточек
    (function($wrapper) {
        if (!$wrapper.length) {
            return;
        }

        require(['app/card'], function(Card) {
            var cards = [
                {
                    type  : 'narrow',
                    index : '1'
                },
                {
                    type  : 'wide',
                    index : '2'
                },
                {
                    type  : 'narrow',
                    index : '3'
                },
                {
                    type  : 'wide',
                    index : '4'
                },
                {
                    type  : 'narrow',
                    index : '5'
                }
            ];

            Card.init(cards);

            $document.on('click', '.js-card', function(e) {
                var $this = $(this);
                var index = cards.length;
                var type;

                if (e.shiftKey) {
                    if (e.altKey) {
                        type = "wide";
                    } else {
                        type = "narrow";
                    }

                    index = index + 1;

                    var newCard = [
                        {
                            type  : type,
                            index : index
                        }
                    ]
                    cards.push({
                        type: type,
                        index: cards.length + 1
                    });

                    Card.addCard(newCard);

                    return;
                }

                cards.pop();

                Card.removeCard($this);
            });
        });
    })('.js-cards');

    return {};
});
/*ignore jslint end*/
