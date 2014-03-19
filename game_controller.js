// responsible to keep track of the game state
function GameController(players, board, rules){
    this.players = players;
    this.__current_player__ = 0;
    this.board = board;
    this.rules = rules;
}

GameController.prototype.__next_player__ = function(){
}

GameController.prototype.run = function(){
    console.debug('starting the game');
}