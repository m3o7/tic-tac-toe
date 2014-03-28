var Field = function(board, value, x, y) {

    var me = this;

    // -PRIVATE
    var init = function(board, value, x, y){
        me.board = board;
        me.value = value;
        me.x = x;
        me.y = y;
    };

    // +PUBLIC
    var getInstVar = function(name){
        // return value of instance variable
        return me[name];
    };

    // PUBLIC
    var setInstVar = function(name, newValue){
        me[name] = newValue;
        update();
    };

    // +PUBLIC
    var hasRightNeighbor = function(){
        return me.board.getFieldArray()[me.y].length - 1 > me.x;
    };

    // +PUBLIC
    var hasLeftNeighbor = function(){
        return me.x > 0;
    };

    // +PUBLIC
    var hasLowerNeighbor = function(){
        return me.board.getFieldArray().length - 1 > me.y;
    };

    // +PUBLIC
    var hasUpperNeighbor = function(){
        return me.y > 0;
    };

    // +PUBLIC
    var getRightNeighbor = function(){
        if (hasRightNeighbor()) {
            return me.board.getField(me.y, me.x + 1);
        }
    };

    // +PUBLIC
    var getLeftNeighbor = function(){
        if (hasLeftNeighbor()) {
            return me.board.getField(me.y, me.x - 1);
        }
    };

    // +PUBLIC
    var getLowerNeighbor = function(){
        if (hasLowerNeighbor()) {
            return me.board.getField(me.y + 1, me.x);
        }
    };

    // +PUBLIC
    var getUpperNeighbor = function(){
        if (hasUpperNeighbor()){
            return me.board.getField(me.y -1, me.x);
        }
    };

    // +PUBLIC
    var getRightUpperNeighbor = function(){
        var right = getRightNeighbor();
        if (typeof right !== 'undefined') {
            return right.getUpperNeighbor();
        }
    };

    // +PUBLIC
    var getRightLowerNeighbor = function(){
        var lower = getLowerNeighbor();
        if (typeof lower !== 'undefined') {
            return lower.getRightNeighbor();
        };
    };

    // +PUBLIC
    var getOppisiteField = function(){
        // calculate the opposite
        var y = 1 + (1 - me.y);
        var x = 1 + (1 - me.x);
        return me.board.getField(y, x);
    };

    // -PRIVATE
    var update = function(){
        // update the HTML of this element
        var newHTML = (typeof me.value === 'undefined') ? '' : me.value.getSymbol();
        $('#ttt-row-' + me.y + ' #ttt-field-' + me.x).html(newHTML);
    }

    init(board, value, x, y);
    // specify public interface
    return {
        getInstVar              : getInstVar,
        setInstVar              : setInstVar,
        hasRightNeighbor        : hasRightNeighbor,
        hasLeftNeighbor         : hasLeftNeighbor,
        hasLowerNeighbor        : hasLowerNeighbor,
        hasUpperNeighbor        : hasUpperNeighbor,
        getRightNeighbor        : getRightNeighbor,
        getLeftNeighbor         : getLeftNeighbor,
        getLowerNeighbor        : getLowerNeighbor,
        getUpperNeighbor        : getUpperNeighbor,
        getRightUpperNeighbor   : getRightUpperNeighbor,
        getRightLowerNeighbor   : getRightLowerNeighbor,
        getOppisiteField        : getOppisiteField,
    };
}
