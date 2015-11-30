define('app/card', ['jquery', 'cookie'], function($) {
    'use strict';

    var Card = function() {
        var card  = this;
        card.data = [];

        card.cookieName = 'card';
    };

    Card.prototype.init = function(cards, $wrapper) {
        var card   = this;
        var cookie = $.cookie(card.cookieName);

        require(['app/tpl/card'], function(tpl) {
            var html = tpl({cards});

            $('.js-cards').append(html);
        });

        if ('undefined' !== typeof cookie) {
            card.data = $.parseJSON(cookie);
        }
    };

    Card.prototype.addCard = function(cards) {
        require(['app/tpl/card'], function(tpl) {
            var html = tpl({cards});

            $('.js-cards').append(html);
        });
    };

    Card.prototype.removeCard = function(card) {
        card.remove();
    };

    return new Card();
});
