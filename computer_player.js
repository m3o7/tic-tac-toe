function ComputerPlayer(){
    Player.call(this);
}

// inherit from Player
ComputerPlayer.prototype = new Player();

// correct the constructor pointer because it points to Player
ComputerPlayer.prototype.constructor = ComputerPlayer;