$(document).ready(function () {
    // wait for the dome to get ready

    // setup
    var players = [
        new HumanPlayer('david', 'X'),
        new HumanPlayer('marco', 'O')
        // new ComputerPlayer('joshua')
    ];

    var board = new BoardController(3, 3);
    var rules = new Rules();
    var game = new GameController(players, board, rules, 'body');
});
