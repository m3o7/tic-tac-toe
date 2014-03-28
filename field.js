var Field = function(board, value, x, y) {

    var me = this;

    // -PRIVATE
    function init(board, value, x, y){
        me.board = board;
        me.value = value;
        me.x = x;
        me.y = y;
    };

    // +PUBLIC
    function getInstVar(name){
        // return value of instance variable
        return me[name];
    };

    // PUBLIC
    function setInstVar(name, newValue){
        me[name] = newValue;
        update();
    };

    // +PUBLIC
    function hasRightNeighbor(){
        return me.board.getFieldArray()[me.y].length - 1 > me.x;
    };

    // +PUBLIC
    function hasLeftNeighbor(){
        return me.x > 0;
    };

    // +PUBLIC
    function hasLowerNeighbor(){
        return me.board.getFieldArray().length - 1 > me.y;
    };

    // +PUBLIC
    function hasUpperNeighbor(){
        return me.y > 0;
    };

    // +PUBLIC
    function getRightNeighbor(){
        if (hasRightNeighbor()) {
            return me.board.getField(me.y, me.x + 1);
        }
    };

    // +PUBLIC
    function getLeftNeighbor(){
        if (hasLeftNeighbor()) {
            return me.board.getField(me.y, me.x - 1);
        }
    };

    // +PUBLIC
    function getLowerNeighbor(){
        if (hasLowerNeighbor()) {
            return me.board.getField(me.y + 1, me.x);
        }
    };

    // +PUBLIC
    function getUpperNeighbor(){
        if (hasUpperNeighbor()){
            return me.board.getField(me.y -1, me.x);
        }
    };

    // +PUBLIC
    function getRightUpperNeighbor(){
        var right = getRightNeighbor();
        if (typeof right !== 'undefined') {
            return right.getUpperNeighbor();
        }
    };

    // +PUBLIC
    function getRightLowerNeighbor(){
        var lower = getLowerNeighbor();
        if (typeof lower !== 'undefined') {
            return lower.getRightNeighbor();
        };
    };

    // +PUBLIC
    function getOppisiteField(){
        // calculate the opposite
        var y = 1 + (1 - me.y);
        var x = 1 + (1 - me.x);
        return me.board.getField(y, x);
    };

    // -PRIVATE
    function update(){
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
