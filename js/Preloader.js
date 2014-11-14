//<![CDATA[
$(window).load(function() { // ensures window load before code fire
    $('#status').delay(2800).fadeOut('slow');// fadeout for loader
$('#preloader').delay(3150).fadeOut('slow'); // fadeout for white div. page wide.
$('body').delay(350).css({'overflow-y':'visible'});
});
//]]>