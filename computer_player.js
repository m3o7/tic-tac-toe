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
    // pick a field
    var field = this.__pick_field__(board);

    // sanity check - verify pick - DEBUG ONLY
    // debug - random field
    if (typeof field === 'undefined' || typeof field.value !== 'undefined') {
        // something went wrong - pick a random empty field
        field = this.__get_random_field__(board);
    }

    // commit the pick
    board.set_field_value(this, field.y, field.x);

    // notify the game-controller about the move
    game.player_moved();
}

ComputerPlayer.prototype.__pick_field__ = function(board){
    // http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy
    return (
        // 1. Win
        this.__pick_win__(board) ||
        // 2. Block
        this.__block__(board) ||
        // 3. Fork
        // 4. Block opponents fork
        // 5. Center
        this.__pick_center__(board) || 
        // 6. Opposite corner
        // 7. Empty corner
        this.__pick_empty_corner__(board) ||
        // 8. Empty side
        this.__pick_empty_side__(board)
    );
}

ComputerPlayer.prototype.__get_first_empty_field__ = function(fields){
    // Return first empty field - meaning: it can still be played
    return $.grep(fields, function(field){
        return (typeof field.value === 'undefined')
    }).pop();
}

ComputerPlayer.prototype.__get_all_row_combinations__ = function(board){
    // Return all Rows (horizontal, vertical, diagonal) that could hold
    // a winning combination

    // TODO: remove hard-coding to 3x3 field - make it generic
    return [
        // horizontal
        [ board.fields[0][0], board.fields[0][1], board.fields[0][2]],
        [ board.fields[1][0], board.fields[1][1], board.fields[1][2]],
        [ board.fields[2][0], board.fields[2][1], board.fields[2][2]],

        // vertical
        [ board.fields[0][0], board.fields[1][0], board.fields[2][0]],
        [ board.fields[0][1], board.fields[1][1], board.fields[2][1]],
        [ board.fields[0][2], board.fields[1][2], board.fields[2][2]],

        // diagonals
        [ board.fields[0][0], board.fields[1][1], board.fields[2][2]],
        [ board.fields[0][2], board.fields[1][1], board.fields[2][0]],
    ];
}

ComputerPlayer.prototype.__filter__ = function (rows, pick_self){
    var cl_this = this;
    return $.grep(rows, function(row){
        // check for an undefined field value
        var undef_count = 0;
        var player_count = 0;
        for (var i = 0; i < row.length; i++) {
            undef_count += (typeof row[i].value === 'undefined');
            if (pick_self) {
                player_count += (row[i].value === cl_this);
            } else {
                player_count += (row[i].value !== cl_this && 
                    (typeof row[i].value !== 'undefined'));
            }
            
        };
        return undef_count === 1 && player_count === 2;
    });
}

ComputerPlayer.prototype.__pick_combination__ = function(board, pick_self){
    // list all possible rows
    var row_comb = this.__get_all_row_combinations__(board);

    // filter the ones that have two fields of the player and one undefined
    var possible_rows = this.__filter__(row_comb, pick_self);

    // pick the first undefined field
    if (possible_rows.length > 0) {
        // return the first best field to win with
        return $.grep(possible_rows[0], function(field){
            // filter the empty field out
            return (typeof field.value === 'undefined');
        })[0];
    };
}


ComputerPlayer.prototype.__pick_win__ = function(board){
    return this.__pick_combination__(board, true);
}

ComputerPlayer.prototype.__block__ = function(board){
    return this.__pick_combination__(board, false);
}

ComputerPlayer.prototype.__pick_center__ = function(board){
    // return center-field if still open
    var center_open = (typeof board.get_field_value(1,1) === 'undefined');
    return center_open ? board.get_field(1,1) : undefined;
}

ComputerPlayer.prototype.__pick_empty_corner__ = function(board){
    var corners = [
        board.get_field(0, 0),
        board.get_field(0, board.width-1),
        board.get_field(board.height-1, 0),
        board.get_field(board.height-1, board.width-1),
    ];

    return this.__get_first_empty_field__(corners);
}

ComputerPlayer.prototype.__pick_empty_side__ = function(board){
    var sides = [
        board.get_field(0, 1),
        board.get_field(1, 0),
        board.get_field(2, 1),
        board.get_field(1, 2),
    ];

    return this.__get_first_empty_field__(sides);
}

ComputerPlayer.prototype.__get_random_field__ = function(board){
    // Return a random field - DEBUG ONLY

    // find empty fields - implicitly there is always one empty field
    var empty_fields = $.grep(board.get_fields(), function(field){
        return (typeof field.value === 'undefined');
    });
    console.error('strategy is broken - returned a random field to continue game');
    return empty_fields[Math.floor(Math.random()*empty_fields.length)];
}