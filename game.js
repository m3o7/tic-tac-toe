$(document).ready(function(){
    // wait for the dome to get ready
    startNewGame();

    // listen for the game to end - to restart a new one
    window.addEventListener('game-ended', function(){
        game.restart();
    });
});

var game;
function startNewGame(){
    // setup
    var players = [
        // new RandomComputerPlayer('david', 'X'),
        new HumanPlayer('david', 'X'),
        new ComputerPlayer('joshua', 'O'),
    ];

    var board = new BoardController(3, 3);
    var rules = new Rules();
    game = new GameController(shuffle(players), board, rules, 'body');
}
