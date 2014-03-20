// implements the Player-interface for a human
function HumanPlayer(){
    Player.call(this);
}

// inherit from Player
HumanPlayer.prototype = new Player();

// correct the constructor pointer because it points to Player
HumanPlayer.prototype.constructor = HumanPlayer;

HumanPlayer.prototype.make_move = function(game, board){
    $('.ttt-field').click( function(evt) {
        // deactivate all field listener
        $('.ttt-field').unbind();

        // notify the game-controller about the move
        console.debug('player has clicked');
        game.player_moved();
    });
}