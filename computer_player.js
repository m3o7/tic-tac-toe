// implements the Player-interface for a computer
function ComputerPlayer(name, symbol){
    Player.call(this, name, symbol);
}

// inherit from Player
ComputerPlayer.prototype = new Player();

// correct the constructor pointer because it points to Player
ComputerPlayer.prototype.constructor = ComputerPlayer;