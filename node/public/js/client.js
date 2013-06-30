(function ($) {
    var socket = io.connect();
    var nodeduino = $('#nodeduino');
    var position = 0;

    socket.on('update', function (data) {
        /** data is between 0 and 100 **/
        position = ($(window).height() * data / 100);
        position -= nodeduino.height();
        nodeduino.css('margin-top', position + 'px');
    });
})(jQuery);