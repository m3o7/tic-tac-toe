// responsible to keep track of the game state
function GameController(players, board, rules, tag){
    this.players = players;
    this.__current_player__ = -1;
    this.board = board;
    this.rules = rules;

    this.view = new GameView(tag);
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

    var player = this.__next_player__();
}


// responsible to render the game
function GameView(tag){
    this.tag = tag;
    getTemplate('game').then(function(base){
        // render the game
        $(tag).append(base);
    });
}