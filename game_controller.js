// CONTROLLER ==================================================================
// responsible to keep track of the game state
var GameController = Class.extend({

    // -PRIVATE
    init: function(players, board, rules, tag){
        var me = this;
        this.players = players;    // array of players
        this.currentPlayerID = -1; // pointer to current player
        this.board = board;
        this.rules = rules;

        this.view = new GameView(tag);

        this.view.isReady(function(){
            // adding the board
            me.board.getView().addTo(me.view);

            // starting the game
            window.addEventListener('board-ready', function startGame(){
                me.startNewTurn();
                // remove this listener, since its only needed for the initial part
                window.removeEventListener('board-ready', startGame, false);
            });
        });
    },

    // -PRIVATE
    nextPlayer: function(){
        // count up the internal pointer or reset it to zero
        this.currentPlayerID = (this.currentPlayerID + 1 == this.players.length) ? 
            0 : this.currentPlayerID + 1;
        return this.players[this.currentPlayerID];
    },

    // +PUBLIC
    startNewTurn: function(){
        // play another turn
        var player = this.nextPlayer();
        player.makeMove(this, this.board);
    },

    // +PUBLIC
    playerMoved: function(){
        // called by the player
        // check if the game has ended
        if (this.rules.isGameFinished(this.board)) {
            var winner = this.rules.getWinner();
            this.view.showWinner(winner);

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
            this.startNewTurn();
        }
    },

    restart: function(){
        // cleaning up and restart the game
        this.board.clear();
        this.rules.clear();
        this.startNewTurn();
    },
});


// VIEW ========================================================================
// responsible to render the game
var GameView = Class.extend({

    // -PRIVATE
    init: function(tag){
        var me = this;
        this.tag = $(tag);
        this.readyCallbacks = [];

        getTemplate('game').then(function(base){
            // render the game
            me.base = $(base);
            me.tag.append(me.base);
            me.callReadyCallbacks();
        });
    },

    // +PUBLIC
    getBase: function(){
        // Return the base HTML-tag (usually 'body') under which this
        // view resides
        return this.base;
    },

    // +PUBLIC
    isReady: function(callback){
        // register callback functions for when the game-view is rendered
        this.readyCallbacks.push(callback);
    },

    // -PRIVATE
    callReadyCallbacks: function(){
        this.readyCallbacks.forEach(function(callback){
            callback();
        });
    },

    // +PUBLIC
    showWinner: function(winner){
        var me = this;
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
    },
});
