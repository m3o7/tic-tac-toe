// implements the Player-interface for a computer
// TODO: currently the computer-player is hard-coded to a 3x3 field
var RandomComputerPlayer = function(name, symbol){

    var me = this;

    // -PRIVATE
    var init = function(name, symbol){
        me.name = name;
        me.symbol = symbol;    
    };

    // +PUBLIC
    var getSymbol = function(){
        return me.symbol;
    };

    // +PUBLIC
    var getName = function(){
        return me.name;
    };

    //  +PUBLIC
    var isComputer = function(){
        // HELPER METHOD
        return true;
    }

    // +PUBLIC
    var makeMove = function(game, board){
        // select a random field
        if (typeof field === 'undefined' || typeof field.getInstVar('value') !== 'undefined') {
            // something went wrong - pick a random empty field
            field = getRandomField(board);
        }

        // commit the pick
        board.setFieldValue(mePointer, field.getInstVar('y'), field.getInstVar('x'));

        // notify the game-controller about the move
        game.playerMoved();
    };

    // -PRIVATE
    var getRandomField = function(board){
        // Return a random field - DEBUG ONLY

        // find empty fields - implicitly there is always one empty field
        var emptyFields = board.getFields().filter(function(field){
            return (typeof field.getInstVar('value') === 'undefined');
        });
        return emptyFields[Math.floor(Math.random()*emptyFields.length)];
    };

    var mePointer = {
        getSymbol   : getSymbol,
        getName     : getName,
        isComputer  : isComputer,
        makeMove    : makeMove,
    };

    init(name, symbol);
    // specify public interface
    return mePointer;
}
