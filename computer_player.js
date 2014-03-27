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
    board.setFieldValue(this, field.y, field.x);

    // notify the game-controller about the move
    game.playerMoved();
}

ComputerPlayer.prototype.__pick_field__ = function(board){
    // http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy
    return (
        // 1. Win
        this.__pick_win__(board) ||
        // 2. Block
        this.__block__(board) ||
        // 3. Fork
        this.__fork__(board) ||
        // 4. Block opponents fork
        this.__block_fork__(board) ||
        // 5. Center
        this.__pick_center__(board) ||
        // 6. Opposite corner
        this.__pick_opposite_corner__(board) ||
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
        [ board.getFieldArray()[0][0], board.getFieldArray()[0][1], board.getFieldArray()[0][2]],
        [ board.getFieldArray()[1][0], board.getFieldArray()[1][1], board.getFieldArray()[1][2]],
        [ board.getFieldArray()[2][0], board.getFieldArray()[2][1], board.getFieldArray()[2][2]],

        // vertical
        [ board.getFieldArray()[0][0], board.getFieldArray()[1][0], board.getFieldArray()[2][0]],
        [ board.getFieldArray()[0][1], board.getFieldArray()[1][1], board.getFieldArray()[2][1]],
        [ board.getFieldArray()[0][2], board.getFieldArray()[1][2], board.getFieldArray()[2][2]],

        // diagonals
        [ board.getFieldArray()[0][0], board.getFieldArray()[1][1], board.getFieldArray()[2][2]],
        [ board.getFieldArray()[0][2], board.getFieldArray()[1][1], board.getFieldArray()[2][0]],
    ];
}

ComputerPlayer.prototype.__filter__ = function (rows, counts){
    var cl_this = this; //closure
    return $.grep(rows, function(row){
        // check for an undefined field value
        var undef_count = 0;
        var self_count = 0;
        var other_count = 0;
        for (var i = 0; i < row.length; i++) {
            if (row[i].value === cl_this) {
                self_count += 1;
            } else if (typeof row[i].value === 'undefined'){
                undef_count += 1;
            } else {
                other_count += 1;
            }           
        };
        return (counts.undef_count === undef_count  &&
                counts.self_count  === self_count   &&
                counts.other_count === other_count
        );
    });
}

ComputerPlayer.prototype.__get_winning_fields__ = function(board, counts){
    // Return all fields that can still be part of a winning strategy

    // list all possible rows
    var row_comb = this.__get_all_row_combinations__(board);

    // filter the ones that have two fields of the player and one undefined
    var possible_rows = this.__filter__(row_comb, counts);

    // pick the first undefined field
    if (possible_rows.length > 0) {
        // return the first best field to win with
        var possible_fields = [];
        possible_rows.forEach(function(rows){
            rows.map(function(field){
                if (typeof field.value === 'undefined'){
                    possible_fields.push(field);
                }
            });
        });
        return possible_fields;
    };
}

ComputerPlayer.prototype.__pick_combination__ = function(board, counts){
    var combinations = this.__get_winning_fields__(board, counts);
    if ((typeof combinations !== 'undefined') && combinations.length > 0) {
        return combinations[0];
    }
}

ComputerPlayer.prototype.__get_forks__ = function(board, counts){
    var row_comb = this.__get_all_row_combinations__(board);
    var rows = this.__filter__(row_comb, counts);

    // count open fields - to find out if there are two intersecting lines
    // which could for a fork
    var fields = {};
    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < rows[i].length; j++) {
            var field = rows[i][j];
            var key = ''+field.x+field.y;
            if (typeof field.value === 'undefined'){
                if (typeof fields[key] === 'undefined'){
                    fields[key] = {
                        count : 1,
                        field : field,
                    };
                } else {
                    fields[key].count += 1;
                }
            }
        }
    }

    var forks = [];
    for (var property in fields) {
        if (fields.hasOwnProperty(property)) {
            if (fields[property].count > 1){
                // found a fork
                forks.push( fields[property].field );
            }
        }
    }
    return forks;
}

ComputerPlayer.prototype.__get_corners__ = function(board){
    var corners = [
        board.getField(0, 0),
        board.getField(0, board.getWidth()-1),
        board.getField(board.getHeight()-1, 0),
        board.getField(board.getHeight()-1, board.getWidth()-1),
    ];
    return corners;
}

ComputerPlayer.prototype.__pick_win__ = function(board){
    return this.__pick_combination__(board, {
        undef_count : 1,
        self_count  : 2,
        other_count : 0 
    });
}

ComputerPlayer.prototype.__block__ = function(board){
    return this.__pick_combination__(board, {
        undef_count : 1,
        self_count  : 0,
        other_count : 2 
    });
}

ComputerPlayer.prototype.__fork__ = function(board){
    // block a forking attempt by the other player
    return this.__get_forks__(board, {
        undef_count : 2,
        self_count  : 1,
        other_count : 0,
    })[0];
}

ComputerPlayer.prototype.__block_fork__ = function(board){
    // force opponent into defending and make sure that the opponent does not
    // create a fork by doing so

    var opp_forks = this.__get_forks__(board, {
        undef_count : 2,
        self_count  : 0,
        other_count : 1,
    });

    var forks = {};
    opp_forks.forEach(function(fork){
        var fork_id = '' + fork.x + fork.y;
        forks[fork_id] = fork;
    });

    if (opp_forks.length > 0) {
        // there are some forks that we need to block by forcing the other 
        // player to defend himself, but it should not force the other player
        // into creating a fork
        var fields = this.__get_winning_fields__(board, {
            undef_count : 2,
            self_count  : 1,
            other_count : 0,
        });

        // find a field that is not creating a fork for the enemy
        for (var i = 0; i < fields.length; i++) {
            // get open field, which the other player would be forced to take
            var field = fields[i];
            board.setTempFieldValue(this, field.y, field.x);
            var open_field = this.__pick_win__(board);
            
            // check if it creates a fork
            var future_opp_forks = this.__get_forks__(board, {
                undef_count : 2,
                self_count  : 0,
                other_count : 1,
            });

            var bad_move = future_opp_forks.filter(function(fork){
                return (fork === open_field);    
            }).length > 0;
            board.resetTempFields();

            if (!bad_move) {
                return field;
            };
        };

        // no defensive move possible - directly blocking the fork
        return opp_forks[0];
    };
}

ComputerPlayer.prototype.__pick_center__ = function(board){
    // return center-field if still open
    var center_open = (typeof board.getFieldValue(1,1) === 'undefined');
    return center_open ? board.getField(1,1) : undefined;
}

ComputerPlayer.prototype.__pick_opposite_corner__ = function(board){
    var cl_this = this; // closure
    var corners = this.__get_corners__(board);
    var opponent_fields = $.grep(corners, function(field){
        // return any field that is an opponents field
        return (typeof field.value !== 'undefined' && field.value !== cl_this);
    });
    var valid_opp_fields = $.grep(opponent_fields, function(field){
        // return any field that has an empty opposite field
        return (typeof field.get_oppisite_field().value === 'undefined');
    });
    return (valid_opp_fields.length > 0) ? valid_opp_fields[0].get_oppisite_field() : undefined;
}

ComputerPlayer.prototype.__pick_empty_corner__ = function(board){
    var corners = this.__get_corners__(board);
    return this.__get_first_empty_field__(corners);
}

ComputerPlayer.prototype.__pick_empty_side__ = function(board){
    var sides = [
        board.getField(0, 1),
        board.getField(1, 0),
        board.getField(2, 1),
        board.getField(1, 2),
    ];

    return this.__get_first_empty_field__(sides);
}

ComputerPlayer.prototype.__get_random_field__ = function(board){
    // Return a random field - DEBUG ONLY

    // find empty fields - implicitly there is always one empty field
    var empty_fields = $.grep(board.getFields(), function(field){
        return (typeof field.value === 'undefined');
    });
    console.error('strategy is broken - returned a random field to continue game');
    return empty_fields[Math.floor(Math.random()*empty_fields.length)];
}