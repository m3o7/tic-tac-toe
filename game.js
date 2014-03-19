$(document).ready(function () {
    // wait for the dome to get ready

    // setup
    var players = [
        new HumanPlayer('david'),
        new HumanPlayer('marco')
        // new ComputerPlayer('joshua')
    ];

    var board = new BoardController(3, 3);
    var rules = new Rules();
    var game = new GameController(players, board, rules, 'body');

    // starting the game
    game.run();
});
