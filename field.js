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
    };

    // +PUBLIC
    var has_right_neighbor = function(){
        return me.board.getFieldArray()[me.y].length - 1 > me.x;
    };

    // +PUBLIC
    var has_left_neighbor = function(){
        return me.x > 0;
    };

    // +PUBLIC
    var has_lower_neighbor = function(){
        return me.board.getFieldArray().length - 1 > me.y;
    };

    // +PUBLIC
    var has_upper_neighbor = function(){
        return me.y > 0;
    };

    // +PUBLIC
    var get_right_neighbor = function(){
        if (has_right_neighbor()) {
            return me.board.getFieldArray()[me.y][me.x + 1];
        }
    };

    // +PUBLIC
    var get_left_neighbor = function(){
        if (has_left_neighbor()) {
            return me.board.getFieldArray()[me.y][me.x - 1];
        }
    };

    // +PUBLIC
    var get_lower_neighbor = function(){
        if (has_lower_neighbor()) {
            return me.board.getFieldArray()[me.y + 1][me.x];
        }
    };

    // +PUBLIC
    var get_upper_neighbor = function(){
        if (has_upper_neighbor()){
            return me.board.getFieldArray()[me.y -1][me.x];
        }
    };

    // +PUBLIC
    var get_right_upper_neighbor = function(){
        var right = get_right_neighbor();
        if (typeof right !== 'undefined') {
            return right.get_upper_neighbor();
        }
    };

    // +PUBLIC
    var get_right_lower_neighbor = function(){
        var lower = get_lower_neighbor();
        if (typeof lower !== 'undefined') {
            return lower.get_right_neighbor();
        };
    };

    // +PUBLIC
    var get_oppisite_field = function(){
        // calculate the opposite
        var y = 1 + (1 - me.y);
        var x = 1 + (1 - me.x);
        return me.board.getField(y, x);
    };

    init(board, value, x, y);
    // specify public interface
    return {
        getInstVar                  : getInstVar,
        setInstVar                  : setInstVar,
        has_right_neighbor          : has_right_neighbor,
        has_left_neighbor           : has_left_neighbor,
        has_lower_neighbor          : has_lower_neighbor,
        has_upper_neighbor          : has_upper_neighbor,
        get_right_neighbor          : get_right_neighbor,
        get_left_neighbor           : get_left_neighbor,
        get_lower_neighbor          : get_lower_neighbor,
        get_upper_neighbor          : get_upper_neighbor,
        get_right_upper_neighbor    : get_right_upper_neighbor,
        get_right_lower_neighbor    : get_right_lower_neighbor,
        get_oppisite_field          : get_oppisite_field,
    };
}
