// CONTROLLER ==================================================================
// responsible to keep track of the game state
var GameController = function(players, board, rules, tag){

    var me = this;

    // -PRIVATE
    var init = function(players, board, rules, tag){
        me.players = players;    // array of players
        me.currentPlayerID = -1; // pointer to current player
        me.board = board;
        me.rules = rules;

        me.view = new GameView(tag);

        me.view.is_ready(function(){
            // adding the board
            me.board.view.add_to(me.view);

            // starting the game
            window.addEventListener('board-ready', function start_game(){
                startNewTurn();
                // remove this listener, since its only needed for the initial part
                window.removeEventListener('board-ready', start_game, false);
            });
        });
    };

    // -PRIVATE
    var nextPlayer = function(){
        // count up the internal pointer or reset it to zero
        me.currentPlayerID = (me.currentPlayerID + 1 == me.players.length) ? 
            0 : me.currentPlayerID + 1;
        return me.players[me.currentPlayerID];
    };

    // +PUBLIC
    var startNewTurn = function(){
        // play another turn
        var player = nextPlayer();
        player.make_move(me_pointer, me.board);
    };

    // +PUBLIC
    var playerMoved = function(){
        // called by the player

        // re-render the board
        me.board.view.update();

        // check if the game has ended
        if (me.rules.is_game_finished(me.board)) {
            var winner = me.rules.get_winner();
            me.view.show_winner(winner);
            // TODO: clean up DEBUG ONLY
            if (typeof winner !== 'undefined') {
                console.debug('game over: ' + winner.name);
                if (winner.name === 'david'){
                    console.error('computer has won');
                    for (var i = 0; i < move_history.length; i++) {
                        console.error(move_history[i]);
                    };
                }
            } else {
                console.debug('game over: tie');
            }
            move_history = [];
        } else {
            // if not, continue
            window.addEventListener('board-ready', function start_game(){
                startNewTurn();
                // remove this listener, one time only event
                window.removeEventListener('board-ready', start_game, false);
            });
        }
    };

    // specify public interface
    var me_pointer = {
        startNewTurn    : startNewTurn,
        playerMoved     : playerMoved,
    };

    init(players, board, rules, tag);

    return me_pointer;
}


// VIEW ========================================================================
// responsible to render the game
function GameView(tag){
    this.tag = $(tag);
    this.__ready_callbacks__ = [];

    var cl_this = this; // closure
    getTemplate('game').then(function(base){
        // render the game
        cl_this.base = $(base);
        cl_this.tag.append(cl_this.base);
        cl_this.call_ready_callbacks();
    });
}

GameView.prototype.is_ready = function(callback){
    this.__ready_callbacks__.push(callback);
}

GameView.prototype.call_ready_callbacks = function(){
    for (var i = 0; i < this.__ready_callbacks__.length; i++) {
        this.__ready_callbacks__[i]();
    };
}

GameView.prototype.show_winner = function(winner){
    var cl_this = this; //closure
    getTemplate('winner', winner).then(function(content){
        cl_this.base.append(content);

        var c2_this = cl_this;
        $(window).click(function game_ended(){
            // player acknoledged outcome

            // clean up
            $(window).unbind();

            c2_this.base.remove();

            // notify game.js to start a new game
            window.dispatchEvent(new Event('game-ended'));
        });
    });
}
