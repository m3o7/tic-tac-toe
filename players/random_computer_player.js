// implements the Player-interface for a computer
// TODO: currently the computer-player is hard-coded to a 3x3 field
var RandomComputerPlayer = BasePlayer.extend({

    // -PRIVATE
    init: function(name, symbol){
        this._super(name, symbol);
        this.isComputerPlayer = true;
    },

    // +PUBLIC
    makeMove: function(game, board){
        // select a random field
        if (typeof field === 'undefined' || typeof field.getInstVar('value') !== 'undefined') {
            // something went wrong - pick a random empty field
            field = this.getRandomField(board);
        }

        // commit the pick
        board.setFieldValue(this, field.getInstVar('y'), field.getInstVar('x'));

        // notify the game-controller about the move
        game.playerMoved();
    },
});
