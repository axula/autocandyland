playerCount = 0;

$('.add-player').click(function (e) {
    e.preventDefault()
    $(this).addClass('hide');
    parent = $(this).parent();
    $(parent).find('.player-group').removeClass('hide');
    playerCount++;
    if( playerCount == 2 ) {
        document.getElementById("play-button").disabled = false;
    }
})

$('.remove-player').click(function (e) {
    e.preventDefault()
    parent = $(this).parent().parent();
    $(parent).find('.player-group').addClass('hide');
    $(parent).find('.add-player').removeClass('hide');
    playerCount--;
    if( playerCount == 1 ) {
        document.getElementById("play-button").disabled = true;
    }
})