// implements the Player-interface for a computer
// TODO: currently the computer-player is hard-coded to a 3x3 field
function ComputerPlayer(name, symbol){
    Player.call(this, name, symbol);
}

// inherit from Player
ComputerPlayer.prototype = new Player();

// correct the constructor pointer because it points to Player
ComputerPlayer.prototype.constructor = ComputerPlayer;

ComputerPlayer.prototype.make_move = function(game, board){
    // pick a random field
    var field = this.__pick_field__(board);
    board.set_field_value(this, field.y, field.x);

    // notify the game-controller about the move
    game.player_moved();
}

ComputerPlayer.prototype.__pick_field__ = function(board){
    // http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy
    var field = (
        // 1. Win
        // 2. Block
        // 3. Fork
        // 4. Block opponents fork
        // 5. Center
        this.__pick_center__(board) || 
        // 6. Opposite corner
        // 7. Empty corner
        this.__pick_empty_corner__(board)
        // 8. Empty side
    );

    // verify pick
    // debug - random field
    if (typeof field === 'undefined' || typeof field.value !== 'undefined') {
        // something went wrong - pick a random empty field
        field = this.__get_random_field__(board);
    }

    return field;
}

ComputerPlayer.prototype.__pick_center__ = function(board){
    // return center-field if still open
    var center_open = (typeof board.get_field_value(1,1) === 'undefined');
    if (center_open) console.debug('picked center');
    return center_open ? board.get_field(1,1) : undefined;
}

ComputerPlayer.prototype.__pick_empty_corner__ = function(board){
    var corners = $.grep([
        board.get_field(0, 0),
        board.get_field(0, board.width-1),
        board.get_field(board.height-1, 0),
        board.get_field(board.height-1, board.width-1),
    ], function(field){
        return (typeof field.value === 'undefined')
    });

    return corners.pop();
}

ComputerPlayer.prototype.__get_random_field__ = function(board){
    // Return a random field - DEBUG ONLY

    // find empty fields - implicitly there is always one empty field
    var empty_fields = $.grep(board.get_fields(), function(field){
        return (typeof field.value === 'undefined');
    });
    console.error('strategy is broken - returned a random field, to continue game');
    return empty_fields[Math.floor(Math.random()*empty_fields.length)];
}