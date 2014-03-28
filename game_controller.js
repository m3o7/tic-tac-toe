// CONTROLLER ==================================================================
// responsible to keep track of the game state
var GameController = function(players, board, rules, tag){

    var me = this;

    // -PRIVATE
    function init(players, board, rules, tag){
        me.players = players;    // array of players
        me.currentPlayerID = -1; // pointer to current player
        me.board = board;
        me.rules = rules;

        me.view = new GameView(tag);

        me.view.isReady(function(){
            // adding the board
            me.board.getView().addTo(me.view);

            // starting the game
            window.addEventListener('board-ready', function startGame(){
                startNewTurn();
                // remove this listener, since its only needed for the initial part
                window.removeEventListener('board-ready', startGame, false);
            });
        });
    };

    // -PRIVATE
    function nextPlayer(){
        // count up the internal pointer or reset it to zero
        me.currentPlayerID = (me.currentPlayerID + 1 == me.players.length) ? 
            0 : me.currentPlayerID + 1;
        return me.players[me.currentPlayerID];
    };

    // +PUBLIC
    function startNewTurn(){
        // play another turn
        var player = nextPlayer();
        player.makeMove(mePointer, me.board);
    };

    // +PUBLIC
    function playerMoved(){
        // called by the player
        // check if the game has ended
        if (me.rules.isGameFinished(me.board)) {
            var winner = me.rules.getWinner();
            me.view.showWinner(winner);

            // DEBUG ONLY
            if (typeof winner !== 'undefined') {
                console.debug('game over: ' + winner.getName());
                if (!winner.isComputer()){
                    console.error('error, human has won');
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
            startNewTurn();
        }
    };

    function restart(){
        // cleaning up and restart the game
        me.board.clear();
        me.rules.clear();
        startNewTurn();
    };

    // specify public interface
    var mePointer = {
        startNewTurn    : startNewTurn,
        playerMoved     : playerMoved,
        restart         : restart,
    };

    init(players, board, rules, tag);

    return mePointer;
};


// VIEW ========================================================================
// responsible to render the game
var GameView = function(tag){

    var me = this;

    // -PRIVATE
    function init(tag){
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
    function getBase(){
        // Return the base HTML-tag (usually 'body') under which this
        // view resides
        return me.base;
    };

    // +PUBLIC
    function isReady(callback){
        // register callback functions for when the game-view is rendered
        me.readyCallbacks.push(callback);
    };

    // -PRIVATE
    function callReadyCallbacks(){
        me.readyCallbacks.forEach(function(callback){
            callback();
        });
    };

    // +PUBLIC
    function showWinner(winner){
        getTemplate('winner', winner).then(function(content){
            var msg = $(content);
            me.base.append(msg);

            $(window).click(function gameEnded(){
                // player acknoledged outcome

                // clean up
                $(window).unbind();
                msg.remove();

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
