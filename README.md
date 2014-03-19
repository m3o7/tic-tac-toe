tic-tac-toe
===========

example implementation of the game tic-tac-toe


# Tic-Tac-Toe V0.1
The first version of the game **tic-tac-toe** will be purely implemented in `JavaScript`. The purpose of this version is to get a quick version up and running and potentially learn from it for future versions.  
I have thought about it for a bit and this should be the rough first (language agnostic) **architecture**:
```javascript
class Game
    + players
    + field
    + rules
    init(players, field, rules)
    next_player()
    run()

class Board
    + size
    + fields
    init(size)

class Rules
    is_game_finished(board)
    get_winner(board)

class Player
    // interface, which has to be implemented
    + name
    init(name)
    make_move(board)

class Human(Player)
    // implements the Player-interface

class Computer(Player)
    // implements the Player-interface
```
