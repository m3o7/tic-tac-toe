// interface, which has to be implemented
function Player(name, symbol){
    this.name = name;
    this.symbol = symbol;
}

Player.prototype.make_move = function(board){
    throw "NotImplementedError";
} 