// implements the game rules, in anticipation of potentially 
// changing/new game rules
var Rules = function(win_count){
    // player who succeeds in placing three respective marks in a horizontal, 
    // vertical, or diagonal row wins the game

    var me = this;

    var init = function(win_count){
        // number of items (in a row) needed to win 
        me.win_count = (typeof win_count === 'undefined') ? 3 : win_count;
    };

    // +PUBLIC
    var isGameFinished = function(board){
        // 1. check if all fields are filled (game ends, no matter what)
        // 2. check if there are three items in a row (horizontal, vertical)
        // 3. check for diagonals
        var fields = board.getFields();
        var any_field_empty = false;
        for (var i = 0; i < fields.length; i++) {
            if (checkHorizontalLine(fields[i]) || 
                checkVerticalLine(fields[i]) || 
                checkDiagonaleDownLine(fields[i]) ||
                checkDiagonaleUpLine(fields[i])) {
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
    };

    // -PRIVATE
    var checkLine = function(field, next_function){
        // Return true if there are '3' items in a row of the same kind
        if (typeof field.getInstVar('value') === 'undefined') {
            // skip empty fields
            return false;
        }

        var counter = me.win_count-1;
        var current_field = field;
        while(counter--){
            var next_field = current_field[next_function]();
            if(typeof next_field === 'undefined' ||
                next_field.getInstVar('value') !== current_field.getInstVar('value')) return false;
            current_field = next_field;
        }
        // remember the winner
        me.winner = current_field.getInstVar('value');
        return true;
    };

    // -PRIVATE
    var checkHorizontalLine = function(field){
        return checkLine(field, 'getRightNeighbor');
    };

    // -PRIVATE
    var checkVerticalLine = function(field){
        return checkLine(field, 'getLowerNeighbor');
    };

    // -PRIVATE
    var checkDiagonaleDownLine = function(field){
        return checkLine(field, 'getRightLowerNeighbor');
    };

    // -PRIVATE
    var checkDiagonaleUpLine = function(field){
        return checkLine(field, 'getRightUpperNeighbor');
    };

    // +PUBLIC
    var get_winner = function(){
        // Return the winner of the game. If there is a tie return null
        return me.winner;
    };

    init(win_count);

    // specify public interface
    return {
        isGameFinished  : isGameFinished,
        get_winner      : get_winner,
    };
}
