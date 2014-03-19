tic-tac-toe
===========

example implementation of the game tic-tac-toe


# Tic-Tac-Toe V0.1
The first version of the game **tic-tac-toe** will be purely implemented in `JavaScript`. The purpose of this version is to get a quick version up and running and potentially learn from it for future versions.  
I have thought about it for a bit and this should be the rough first (language agnostic) **architecture**:
```javascript
class GameController
    // responsible to keep track of the game state
    + players
    + field
    + rules
    init(players, board, rules)
    next_player()
    run()

class BoardController
    // represents the game board - usually a 3x3
    // board
    + size
    + fields
    init(size)

class Rules
    // implements the game rules, in anticipation 
    // of potentially changing/new game rules
    is_game_finished(board)
    get_winner(board)

class Player
    // interface, which has to be implemented
    + name
    + symbol
    init(name)
    make_move(board)

class Human(Player)
    // implements the Player-interface

class Computer(Player)
    // implements the Player-interface
```

Reasons of why the architecture looks the way it looks:
* split the apps into logical pieces, so they can be swapped without breaking anything
* anticipate some potential future features(e.g.: different board sizes, different rules, multi-player, different strength computer enemy...)
