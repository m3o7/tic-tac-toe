// implements the Player-interface for a human
function HumanPlayer(name, symbol){
    Player.call(this, name, symbol);
}

// inherit from Player
HumanPlayer.prototype = new Player();

// correct the constructor pointer because it points to Player
HumanPlayer.prototype.constructor = HumanPlayer;

HumanPlayer.prototype.make_move = function(game, board){
    var cl_this = this; //closure
    $('.ttt-field').click( function(evt) {
        cl_this.made_move($(evt.target), board, game);
    });
}

HumanPlayer.prototype.made_move = function(ui_field, board, game){
    console.debug('player ' + this.name + ' made a move');

    // determine the field that was clicked
    var y = parseInt(ui_field.parent().attr('id').split('-')[2]);
    var x = parseInt(ui_field.attr('id').split('-')[2]);
    var field_value = board.get_field_value(y, x);

    // was it a legal move? Is that field still available?
    if (typeof field_value === 'undefined') {
        // commit move
        board.set_field_value(this, y, x);

        // deactivate all field listeners
        $('.ttt-field').unbind();

        // notify the game-controller about the move
        game.player_moved();
    } else {
        // try again
        console.debug('invalid move');
    }
}
