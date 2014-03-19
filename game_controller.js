// CONTROLLER ==================================================================
// responsible to keep track of the game state
function GameController(players, board, rules, tag){
    this.players = players;
    this.__current_player__ = -1;
    this.board = board;
    this.rules = rules;

    this.view = new GameView(this, tag);
    var cl_this = this; //closure
    this.view.is_ready(function(){
        // adding the board
        cl_this.board.view.add_to(cl_this.view);
    });
    console.debug('GameController initialized');
}

GameController.prototype.__next_player__ = function(){
    // count up the internal pointer or reset it to zero
    this.__current_player__ = (this.__current_player__ + 1 == this.players.length) ? 
        0 : this.__current_player__ + 1;
    return this.players[this.__current_player__];
}

GameController.prototype.run = function(){
    console.debug('starting the game');

    while(!this.rules.is_finished){
        // play another turn
        var player = this.__next_player__();

        break; // for debug
    }

    console.debug('game over');
}

// VIEW ========================================================================
// responsible to render the game
function GameView(controller, tag){
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