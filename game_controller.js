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

        me.view.isReady(function(){
            // adding the board
            me.board.getView().addTo(me.view);

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
        player.make_move(mePointer, me.board);
    };

    // +PUBLIC
    var playerMoved = function(){
        // called by the player

        // re-render the board
        me.board.getView().update();

        // check if the game has ended
        if (me.rules.isGameFinished(me.board)) {
            var winner = me.rules.get_winner();
            me.view.showWinner(winner);
            // TODO: clean up DEBUG ONLY
            if (typeof winner !== 'undefined') {
                console.debug('game over: ' + winner.name);
                if (winner.name === 'david'){
                    console.error('computer has won');
                    moveHistory.forEach(function(move){
                        console.error(move);
                    });
                }
            } else {
                console.debug('game over: tie');
            }
            moveHistory = [];
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
    var mePointer = {
        startNewTurn    : startNewTurn,
        playerMoved     : playerMoved,
    };

    init(players, board, rules, tag);

    return mePointer;
};


// VIEW ========================================================================
// responsible to render the game
var GameView = function(tag){

    var me = this;

    // -PRIVATE
    var init = function(tag){
        me.tag = $(tag);
        me.readyCallbacks = [];

        getTemplate('game').then(function(base){
            // render the game
            me.base = $(base);
            me.tag.append(me.base);
            callReadyCallbacks();
        });
    };

    // +PUBLIC
    var getBase = function(){
        // Return the base HTML-tag (usually 'body') under which this
        // view resides
        return me.base;
    };

    // +PUBLIC
    var isReady = function(callback){
        me.readyCallbacks.push(callback);
    };

    // -PRIVATE
    var callReadyCallbacks = function(){
        me.readyCallbacks.forEach(function(callback){
            callback();
        });
    };

    // +PUBLIC
    var showWinner = function(winner){
        getTemplate('winner', winner).then(function(content){
            me.base.append(content);

            $(window).click(function game_ended(){
                // player acknoledged outcome

                // clean up
                $(window).unbind();
                me.base.remove();

                // notify game.js to start a new game
                window.dispatchEvent(new Event('game-ended'));
            });
        });
    };

    init(tag);

    // specify public interface
    return {
        getBase     : getBase,
        isReady     : isReady,
        showWinner  : showWinner,
    };
};
