// implements the Player-interface for a human
var HumanPlayer = BasePlayer.extend({
    // -PRIVATE
    init: function(name, symbol){
        this._super(name, symbol);
        this.isComputerPlayer = false;
    },

    // +PUBLIC
    makeMove: function(game, board){
        // wait until the user has made his choice
        var me = this;
        $('.ttt-field').click( function(evt) {
            me.madeMove($(evt.target), board, game);
        });
    },

    // -PRIVATE
    madeMove: function(UIfield, board, game){
        // determine the field that was clicked
        var y = parseInt(UIfield.parent().attr('id').split('-')[2]);
        var x = parseInt(UIfield.attr('id').split('-')[2]);
        var fieldValue = board.getFieldValue(y, x);

        // was it a legal move? Is that field still available?
        if (typeof fieldValue === 'undefined') {
            // commit move
            board.setFieldValue(this, y, x);

            // deactivate all field listeners
            $('.ttt-field').unbind();

            // notify the game-controller about the move
            game.playerMoved();
        } else {
            // try again
            console.debug('invalid move');
        }
    },
});
