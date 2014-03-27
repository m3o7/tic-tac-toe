// implements the game rules, in anticipation of potentially 
// changing/new game rules
function Rules(win_count){
    // player who succeeds in placing three respective marks in a horizontal, 
    // vertical, or diagonal row wins the game

    // number of items (in a row) needed to win 
    this.win_count = (typeof win_count === 'undefined') ? 3 : win_count;
}

Rules.prototype.is_game_finished = function(board){
    // 1. check if all fields are filled (game ends, no matter what)
    // 2. check if there are three items in a row (horizontal, vertical)
    // 3. check for diagonals
    var fields = board.getFields();
    var any_field_empty = false;
    for (var i = 0; i < fields.length; i++) {
        if (this.__check_horizontal_line__(fields[i]) || 
            this.__check_vertical_line__(fields[i]) || 
            this.__check_diagonale_down_line__(fields[i]) ||
            this.__check_diagonale_up_line__(fields[i])) {
            return true;
        }
        // check if any field is empty, to indicate a tie
        any_field_empty = any_field_empty || (typeof fields[i].getInstVar('value') === 'undefined');
    }
    if (!any_field_empty) {
        // a tie has been reached
        return true;
    }

    // nobody has won yet and there are still empty fields
    return false;
}

Rules.prototype.__check_line__ = function(field, next_function){
    // Return true if there are '3' items in a row of the same kind
    if (typeof field.getInstVar('value') === 'undefined') {
        // skip empty fields
        return false;
    }

    var counter = this.win_count-1;
    var current_field = field;
    while(counter--){
        var next_field = current_field[next_function]();
        if(typeof next_field === 'undefined' ||
            next_field.getInstVar('value') !== current_field.getInstVar('value')) return false;
        current_field = next_field;
    }
    // remember the winner
    this.winner = current_field.getInstVar('value');
    return true;
}

Rules.prototype.__check_horizontal_line__ = function(field){
    return this.__check_line__(field, 'get_right_neighbor');
}

Rules.prototype.__check_vertical_line__ = function(field){
    return this.__check_line__(field, 'get_lower_neighbor');
}

Rules.prototype.__check_diagonale_down_line__ = function(field){
    return this.__check_line__(field, 'get_right_lower_neighbor');
}

Rules.prototype.__check_diagonale_up_line__ = function(field){
    return this.__check_line__(field, 'get_right_upper_neighbor');
}

Rules.prototype.get_winner = function(){
    // Return the winner of the game. If there is a tie return null
    return this.winner;
}
