// implements the Player-interface for a human
function HumanPlayer(name, symbol){
    
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

    // +PUBLIC
    var makeMove = function(game, board){
        // wait until the user has made his choice
        $('.ttt-field').click( function(evt) {
            madeMove($(evt.target), board, game);
        });
    };

    // -PRIVATE
    var madeMove = function(UIfield, board, game){
        // determine the field that was clicked
        var y = parseInt(UIfield.parent().attr('id').split('-')[2]);
        var x = parseInt(UIfield.attr('id').split('-')[2]);
        var fieldValue = board.getFieldValue(y, x);

        // was it a legal move? Is that field still available?
        if (typeof fieldValue === 'undefined') {
            // commit move
            board.setFieldValue(mePointer, y, x);

            // deactivate all field listeners
            $('.ttt-field').unbind();

            // notify the game-controller about the move
            game.playerMoved();
        } else {
            // try again
            console.debug('invalid move');
        }
    };

    var mePointer = {
        getSymbol   : getSymbol,
        getName     : getName,
        makeMove    : makeMove,
    };

    init(name, symbol);
    // specify public interface
    return mePointer;
};
