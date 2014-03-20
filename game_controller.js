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

        // starting the game
        var c2_this = cl_this;
        window.addEventListener('board-ready', function(){
            c2_this.start_new_turn();
        });
    });
    console.debug('GameController initialized');
}

GameController.prototype.__next_player__ = function(){
    // count up the internal pointer or reset it to zero
    this.__current_player__ = (this.__current_player__ + 1 == this.players.length) ? 
        0 : this.__current_player__ + 1;
    return this.players[this.__current_player__];
}

GameController.prototype.start_new_turn = function(){
    console.debug('start new turn');
    
    // play another turn
    var player = this.__next_player__();
    player.make_move(this, this.board);
}

GameController.prototype.player_moved = function(){
    // called by the player

    // check if the game has ended
    if (this.rules.is_game_finished(this.board)) {
        console.log('game over');
        this.show_winner();
    } else {
        // if not, continue
        this.start_new_turn();
    }
}

GameController.prototype.show_winner = function(){

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