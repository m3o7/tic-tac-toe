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
    var id1 = parseInt(ui_field.parent().attr('id').split('-')[2]);
    var id2 = parseInt(ui_field.attr('id').split('-')[2]);
    var field = board.fields[id1][id2];

    // was it a legal move? Is that field still available?
    if (typeof field === 'undefined') {
        // commit move
        board.fields[id1][id2] = this;

        // deactivate all field listener
        $('.ttt-field').unbind();

        // notify the game-controller about the move
        game.player_moved();
    } else {
        // try again
        console.debug('invalid move');
    }
    
    // 
}