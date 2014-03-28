// implements the Player-interface for a computer
// TODO: currently the computer-player is hard-coded to a 3x3 field
var ComputerPlayer = function(name, symbol){

    var me = this;

    // -PRIVATE
    function init(name, symbol){
        me.name = name;
        me.symbol = symbol;
    };

    // +PUBLIC
    function getSymbol(){
        return me.symbol;
    };

    // +PUBLIC
    function getName(){
        return me.name;
    };

    //  +PUBLIC
    function isComputer(){
        // HELPER METHOD
        return true;
    }

    // +PUBLIC
    function makeMove(game, board){
        // pick a field
        var field = pickField(board);

        // sanity check - verify pick - DEBUG ONLY
        // debug - random field
        if (typeof field === 'undefined' || typeof field.getInstVar('value') !== 'undefined') {
            // something went wrong - pick a random empty field
            field = getRandomField(board);
        }

        // commit the pick
        board.setFieldValue(mePointer, field.getInstVar('y'), field.getInstVar('x'));

        // notify the game-controller about the move
        game.playerMoved();
    }

    // -PRIVATE
    function pickField(board){
        // http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy
        return (
            // 1. Win
            pickWin(board) ||
            // 2. Block
            block(board) ||
            // 3. Fork
            fork(board) ||
            // 4. Block opponents fork
            blockFork(board) ||
            // 5. Center
            pickCenter(board) ||
            // 6. Opposite corner
            pickOppositeCorner(board) ||
            // 7. Empty corner
            pickEmptyCorner(board) ||
            // 8. Empty side
            pickEmptySide(board)
        );
    }

    // -PRIVATE
    function getFirstEmptyField(fields){
        // Return first empty field - meaning: it can still be played
        return fields.filter(function(field){
            return (typeof field.getInstVar('value') === 'undefined')
        }).pop();
    }

    // -PRIVATE
    function getAllRowCombinations(board){
        // Return all Rows (horizontal, vertical, diagonal) that could hold
        // a winning combination

        // TODO: remove hard-coding to 3x3 field - make it generic
        return [
            // horizontal
            [ board.getField(0,0), board.getField(0,1), board.getField(0,2) ],
            [ board.getField(1,0), board.getField(1,1), board.getField(1,2) ],
            [ board.getField(2,0), board.getField(2,1), board.getField(2,2) ],

            // vertical
            [ board.getField(0,0), board.getField(1,0), board.getField(2,0) ],
            [ board.getField(0,1), board.getField(1,1), board.getField(2,1) ],
            [ board.getField(0,2), board.getField(1,2), board.getField(2,2) ],

            // diagonals
            [ board.getField(0,0), board.getField(1,1), board.getField(2,2) ],
            [ board.getField(0,2), board.getField(1,1), board.getField(2,0) ],
        ];
    }

    // -PRIVATE
    function filter(rows, counts){
        // filter all rows out that have the wanted 'field-placements'
        // e.g.: a row with 2 of my fields and one open field, so I could win
        return rows.filter(function(row){
            // check for an undefined field value
            var undefCount = 0;
            var selfCount = 0;
            var otherCount = 0;
            for (var i = 0; i < row.length; i++) {
                if (row[i].getInstVar('value') === mePointer) {
                    selfCount += 1;
                } else if (typeof row[i].getInstVar('value') === 'undefined'){
                    undefCount += 1;
                } else {
                    otherCount += 1;
                }           
            };
            return (counts.undefCount === undefCount  &&
                    counts.selfCount  === selfCount   &&
                    counts.otherCount === otherCount
            );
        });
    }

    // -PRIVATE
    function getWinningFields(board, counts){
        // Return all fields that can still be part of a winning strategy

        // list all possible rows
        var rowCombinations = getAllRowCombinations(board);

        // filter the ones that have two fields of the player and one undefined
        var possibleRows = filter(rowCombinations, counts);

        // pick the first undefined field
        if (possibleRows.length > 0) {
            // return the first best field to win with
            var possibleFields = [];
            possibleRows.forEach(function(rows){
                rows.map(function(field){
                    if (typeof field.getInstVar('value') === 'undefined'){
                        possibleFields.push(field);
                    }
                });
            });
            return possibleFields;
        };
    }

    // -PRIVATE
    function pickCombination(board, counts){
        var combinations = getWinningFields(board, counts);
        if ((typeof combinations !== 'undefined') && combinations.length > 0) {
            return combinations[0];
        }
    }

    // -PRIVATE
    function getForks(board, counts){
        var rowComb = getAllRowCombinations(board);
        var rows = filter(rowComb, counts);

        // find out if there are two intersecting lines, by counting
        // field occurences
        var fields = {};
        for (var i = 0; i < rows.length; i++) {
            for (var j = 0; j < rows[i].length; j++) {
                var field = rows[i][j];
                var key = ''+field.getInstVar('x')+field.getInstVar('y');
                if (typeof field.getInstVar('value') === 'undefined'){
                    if (typeof fields[key] === 'undefined'){
                        fields[key] = {
                            count : 1,
                            field : field,
                        };
                    } else {
                        fields[key].count += 1;
                    }
                }
            }
        }

        var forks = [];
        for (var property in fields) {
            if (fields.hasOwnProperty(property)) {
                if (fields[property].count > 1){
                    // found a fork
                    forks.push( fields[property].field );
                }
            }
        }
        return forks;
    }

    // -PRIVATE
    function getCorners(board){
        var corners = [
            board.getField(0, 0),
            board.getField(0, board.getWidth()-1),
            board.getField(board.getHeight()-1, 0),
            board.getField(board.getHeight()-1, board.getWidth()-1),
        ];
        return corners;
    }

    // -PRIVATE
    function pickWin(board){
        return pickCombination(board, {
            undefCount : 1,
            selfCount  : 2,
            otherCount : 0 
        });
    }

    // -PRIVATE
    function block(board){
        return pickCombination(board, {
            undefCount : 1,
            selfCount  : 0,
            otherCount : 2 
        });
    }

    // -PRIVATE
    function fork(board){
        // block a forking attempt by the other player
        return getForks(board, {
            undefCount : 2,
            selfCount  : 1,
            otherCount : 0,
        })[0];
    }

    // -PRIVATE
    function blockFork(board){
        // force opponent into defending and make sure that the opponent does not
        // create a fork by doing so

        var oppForks = getForks(board, {
            undefCount : 2,
            selfCount  : 0,
            otherCount : 1,
        });

        var forks = {};
        oppForks.forEach(function(fork){
            var forkID = '' + fork.getInstVar('x') + fork.getInstVar('y');
            forks[forkID] = fork;
        });

        if (oppForks.length > 0) {
            // there are some forks that we need to block by forcing the other 
            // player to defend himself, but it should not force the other player
            // into creating a fork
            var fields = getWinningFields(board, {
                undefCount : 2,
                selfCount  : 1,
                otherCount : 0,
            });

            // find a field that is not creating a fork for the enemy
            for (var i = 0; i < fields.length; i++) {
                // get open field, which the other player would be forced to take
                var field = fields[i];
                board.setTempFieldValue(mePointer, field.getInstVar('y'), field.getInstVar('x'));
                var openField = pickWin(board);
                
                // check if it creates a fork
                var futureOppForks = getForks(board, {
                    undefCount : 2,
                    selfCount  : 0,
                    otherCount : 1,
                });

                var badMove = futureOppForks.filter(function(fork){
                    return (fork === openField);    
                }).length > 0;
                board.resetTempFields();

                if (!badMove) {
                    return field;
                };
            };

            // no defensive move possible - directly blocking the fork
            return oppForks[0];
        };
    }

    // -PRIVATE
    function pickCenter(board){
        // return center-field if still open
        var centerOpen = (typeof board.getFieldValue(1,1) === 'undefined');
        return centerOpen ? board.getField(1,1) : undefined;
    }

    // -PRIVATE
    function pickOppositeCorner(board){
        var corners = getCorners(board);
        var opponentFields = corners.filter(function(field){
            // return any field that is an opponents field
            return (typeof field.getInstVar('value') !== 'undefined' && field.getInstVar('value') !== mePointer);
        });
        var validOppFields = opponentFields.filter(function(field){
            // return any field that has an empty opposite field
            return (typeof field.getOppisiteField().getInstVar('value') === 'undefined');
        });
        return (validOppFields.length > 0) ? validOppFields[0].getOppisiteField() : undefined;
    }

    // -PRIVATE
    function pickEmptyCorner(board){
        var corners = getCorners(board);
        return getFirstEmptyField(corners);
    }

    // -PRIVATE
    function pickEmptySide(board){
        var sides = [
            board.getField(0, 1),
            board.getField(1, 0),
            board.getField(2, 1),
            board.getField(1, 2),
        ];

        return getFirstEmptyField(sides);
    }

    // -PRIVATE
    function getRandomField(board){
        // Return a random field - DEBUG ONLY

        // find empty fields - implicitly there is always one empty field
        var emptyFields = board.getFields().filter(function(field){
            return (typeof field.getInstVar('value') === 'undefined');
        });
        console.error('strategy is broken - returned a random field to continue game');
        return emptyFields[Math.floor(Math.random()*emptyFields.length)];
    }


    var mePointer = {
        getSymbol   : getSymbol,
        getName     : getName,
        isComputer  : isComputer,
        makeMove    : makeMove,
    };

    init(name, symbol);
    // specify public interface
    return mePointer;
}
