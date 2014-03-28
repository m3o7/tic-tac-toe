var BasePlayer = Class.extend({
    // -PRIVATE
    init: function(name, symbol){
        this.name = name;
        this.symbol = symbol;
        this.isComputerPlayer;
    },

    // +PUBLIC
    getSymbol: function(){
        return this.symbol;
    },

    // +PUBLIC
    getName: function(){
        return this.name;
    },

        //  +PUBLIC
    isComputer: function(){
        // HELPER METHOD
        return this.isComputerPlayer;
    },

    // -PRIVATE
    getRandomField: function(board){
        // Return a random field - DEBUG ONLY

        // find empty fields - implicitly there is always one empty field
        var emptyFields = board.getFields().filter(function(field){
            return (typeof field.getInstVar('value') === 'undefined');
        });
        console.error('strategy is broken - returned a random field to continue game');
        return emptyFields[Math.floor(Math.random()*emptyFields.length)];
    }
});