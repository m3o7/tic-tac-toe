// implements the game rules, in anticipation of potentially 
// changing/new game rules
var Rules = function(winCount){
    // player who succeeds in placing three respective marks in a horizontal, 
    // vertical, or diagonal row wins the game

    var me = this;

    function init(winCount){
        // number of items (in a row) needed to win 
        me.winCount = (typeof winCount === 'undefined') ? 3 : winCount;
    };

    // +PUBLIC
    function isGameFinished(board){
        // 1. check if all fields are filled (game ends, no matter what)
        // 2. check if there are three items in a row (horizontal, vertical)
        // 3. check for diagonals
        var fields = board.getFields();
        var anyFieldEmpty = false;
        for (var i = 0; i < fields.length; i++) {
            if (checkHorizontalLine(fields[i]) || 
                checkVerticalLine(fields[i]) || 
                checkDiagonaleDownLine(fields[i]) ||
                checkDiagonaleUpLine(fields[i])) {
                return true;
            }
            // check if any field is empty, to indicate a tie
            anyFieldEmpty = anyFieldEmpty || (typeof fields[i].getInstVar('value') === 'undefined');
        }
        if (!anyFieldEmpty) {
            // a tie has been reached
            return true;
        }

        // nobody has won yet and there are still empty fields
        return false;
    };

    // -PRIVATE
    function checkLine(field, nextFunction){
        // Return true if there are '3' items in a row of the same kind
        if (typeof field.getInstVar('value') === 'undefined') {
            // skip empty fields
            return false;
        }

        var counter = me.winCount-1;
        var currentField = field;
        while(counter--){
            // check if all fields in one line have the same player -> winner
            var nextField = currentField[nextFunction]();
            if(typeof nextField === 'undefined' ||
                nextField.getInstVar('value') !== currentField.getInstVar('value')) return false;
            currentField = nextField;
        }

        // remember the winner
        me.winner = currentField.getInstVar('value');
        return true;
    };

    // -PRIVATE
    function checkHorizontalLine(field){
        return checkLine(field, 'getRightNeighbor');
    };

    // -PRIVATE
    function checkVerticalLine(field){
        return checkLine(field, 'getLowerNeighbor');
    };

    // -PRIVATE
    function checkDiagonaleDownLine(field){
        return checkLine(field, 'getRightLowerNeighbor');
    };

    // -PRIVATE
    function checkDiagonaleUpLine(field){
        return checkLine(field, 'getRightUpperNeighbor');
    };

    // +PUBLIC
    function getWinner(){
        // Return the winner of the game. If there is a tie return null
        return me.winner;
    };

    function clear(){
        // reset the rules for a new game
        me.winner = undefined;
    };

    init(winCount);

    // specify public interface
    return {
        isGameFinished  : isGameFinished,
        getWinner       : getWinner,
        clear           : clear,
    };
}
