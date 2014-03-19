// interface, which has to be implemented
function Player(name, symbol){
    this.name = name;
    this.symbol = symbol;
}

Player.prototype.make_move = function(board){
    throw {
        name: "NotImplementedError", 
        message: "make_move needs to be implemented"
    };
} 