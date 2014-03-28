var Field = Class.extend({

    // -PRIVATE
    init: function(board, value, x, y){
        this.board = board;
        this.value = value;
        this.x = x;
        this.y = y;
    },

    // +PUBLIC
    getInstVar: function(name){
        // return value of instance variable
        return this[name];
    },

    // PUBLIC
    setInstVar: function(name, newValue){
        this[name] = newValue;
        this.update();
    },

    // +PUBLIC
    hasRightNeighbor: function(){
        return this.board.getFieldArray()[this.y].length - 1 > this.x;
    },

    // +PUBLIC
    hasLeftNeighbor: function(){
        return this.x > 0;
    },

    // +PUBLIC
    hasLowerNeighbor: function(){
        return this.board.getFieldArray().length - 1 > this.y;
    },

    // +PUBLIC
    hasUpperNeighbor: function(){
        return this.y > 0;
    },

    // +PUBLIC
    getRightNeighbor: function(){
        if (this.hasRightNeighbor()) {
            return this.board.getField(this.y, this.x + 1);
        }
    },

    // +PUBLIC
    getLeftNeighbor: function(){
        if (this.hasLeftNeighbor()) {
            return this.board.getField(this.y, this.x - 1);
        }
    },

    // +PUBLIC
    getLowerNeighbor: function(){
        if (this.hasLowerNeighbor()) {
            return this.board.getField(this.y + 1, this.x);
        }
    },

    // +PUBLIC
    getUpperNeighbor: function(){
        if (this.hasUpperNeighbor()){
            return this.board.getField(this.y -1, this.x);
        }
    },

    // +PUBLIC
    getRightUpperNeighbor: function(){
        var right = this.getRightNeighbor();
        if (typeof right !== 'undefined') {
            return right.getUpperNeighbor();
        }
    },

    // +PUBLIC
    getRightLowerNeighbor: function(){
        var lower = this.getLowerNeighbor();
        if (typeof lower !== 'undefined') {
            return lower.getRightNeighbor();
        };
    },

    // +PUBLIC
    getOppisiteField: function(){
        // calculate the opposite
        var y = 1 + (1 - this.y);
        var x = 1 + (1 - this.x);
        return this.board.getField(y, x);
    },

    // -PRIVATE
    update: function(){
        // update the HTML of this element
        var newHTML = (typeof this.value === 'undefined') ? '' : this.value.getSymbol();
        $('#ttt-row-' + this.y + ' #ttt-field-' + this.x).html(newHTML);
    },
});
