// setup
var players = [
    new HumanPlayer('david'),
    new ComputerPlayer('joshua')
];

var board = new BoardController();
var rules = new Rules();
var game = new GameController(players, board, rules);

// starting the game
game.run();