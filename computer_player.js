// implements the Player-interface for a computer
function ComputerPlayer(name, symbol){
    Player.call(this, name, symbol);
}

// inherit from Player
ComputerPlayer.prototype = new Player();

// correct the constructor pointer because it points to Player
ComputerPlayer.prototype.constructor = ComputerPlayer;

ComputerPlayer.prototype.make_move = function(game, board){
    // find empty fields - implicitly there is always one empty field
    var empty_fields = $.grep(board.get_fields(), function(field){
        return (typeof field.value === 'undefined');
    });

    // pick a random field
    var random_field = empty_fields[Math.floor(Math.random()*empty_fields.length)];
    board.set_field_value(this, random_field.y, random_field.x);

    // notify the game-controller about the move
    game.player_moved();
}