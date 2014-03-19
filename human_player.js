function HumanPlayer(){
    Player.call(this);
}

// inherit from Player
HumanPlayer.prototype = new Player();

// correct the constructor pointer because it points to Player
HumanPlayer.prototype.constructor = HumanPlayer;
