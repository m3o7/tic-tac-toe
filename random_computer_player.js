// implements the Player-interface for a computer
// TODO: currently the computer-player is hard-coded to a 3x3 field
function RandomComputerPlayer(name, symbol){
    Player.call(this, name, symbol);
}

// inherit from Player
RandomComputerPlayer.prototype = new Player();

// correct the constructor pointer because it points to Player
RandomComputerPlayer.prototype.constructor = RandomComputerPlayer;

RandomComputerPlayer.prototype.make_move = function(game, board){
    // select a random field
    if (typeof field === 'undefined' || typeof field.value !== 'undefined') {
        // something went wrong - pick a random empty field
        field = this.__get_random_field__(board);
    }

    // commit the pick
    board.set_field_value(this, field.y, field.x);

    // notify the game-controller about the move
    game.player_moved();
}

RandomComputerPlayer.prototype.__get_random_field__ = function(board){
    // Return a random field - DEBUG ONLY

    // find empty fields - implicitly there is always one empty field
    var empty_fields = $.grep(board.get_fields(), function(field){
        return (typeof field.value === 'undefined');
    });
    return empty_fields[Math.floor(Math.random()*empty_fields.length)];
}