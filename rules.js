// implements the game rules, in anticipation of potentially 
// changing/new game rules
function Rules(item_count){
    // player who succeeds in placing three respective marks in a horizontal, 
    // vertical, or diagonal row wins the game
    this.item_count = (typeof item_count === 'undefined') ? 3 : item_count;
}

Rules.prototype.is_game_finished = function(board){
    // 1. check if all fields are filled (game ends, no matter what)
    // 2. check if there are three items in a row (horizontal, vertical)
    // 3. check for diagonals
    var fields = board.get_fields();
    for (var i = 0; i < fields.length; i++) {
        if (this.__check_horizontal_line__(fields[i]) || 
            this.__check_vertical_line__(fields[i])) {
            return true;
        }
    }

    return false;
}

Rules.prototype.__check_line__ = function(field, next_function){
    if (typeof field.value === 'undefined') {
        // skip empty field
        return false;
    }

    var counter = this.item_count-1;
    var current_field = field;
    while(counter--){
        var next_field = current_field[next_function]();
        if(typeof next_field === 'undefined' ||
            next_field.value !== current_field.value) return false;
        current_field = next_field;
    }
    return true;
}

Rules.prototype.__check_horizontal_line__ = function(field){
    return this.__check_line__(field, 'get_right_neighbor');
}

Rules.prototype.__check_vertical_line__ = function(field){
    return this.__check_line__(field, 'get_lower_neighbor');
}

Rules.prototype.get_winner = function(){
    // Return the winner of the game. If there is a tie return null
}
