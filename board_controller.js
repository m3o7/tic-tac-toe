// CONTROLLER ==================================================================
// represents the game board - usually a 3x3 board
var moveHistory = [];

var BoardController = function(width, height){

    var me = this;

    // -PRIVATE
    var init = function(width, height){
        me.width = width;
        me.height = height;
        me.fields = initFields(me.width, me.height);

        me.view = new BoardView(mePointer);
        me.temp_fields = []; // used to keep track of simulated moves
    };

    // -PRIVATE
    var initFields = function(width, height){
        var fields = new Array(width);
        for (var y = 0; y < width; y++) {
            fields[y] = new Array(height);  
            for (var x = 0; x < fields[y].length; x++) {
                fields[y][x] = new Field(mePointer, undefined, x, y);
            };
        }
        return fields;
    };

    // +PUBLIC
    var getWidth = function(){
        return me.width;
    };

    // +PUBLIC
    var getHeight = function(){
        return me.height;
    };

    // +PUBLIC
    var getView = function(){
        return me.view;
    };

    // +PUBLIC
    var getField = function(y, x){
        return me.fields[y][x];
    };

    // +PUBLIC
    var getFieldValue = function(y, x){
        return getField(y, x).value;
    };

    // +PUBLIC
    var setFieldValue = function(new_value, y, x){
        me.fields[y][x].value = new_value;

        // DEBUG ONLY - to keep the move history
        moveHistory.push(''+x+','+y+','+new_value.symbol);
    };

    // +PUBLIC
    var setTempFieldValue = function(new_value, y, x){
        // for simulation purposes - simulate future move(s)
        me.temp_fields.push(me.fields[y][x]);
        me.fields[y][x].value = new_value;
    };

    // +PUBLIC
    var resetTempFields = function(){
        // for simulation purposes - reset the future fields
        me.temp_fields.forEach(function(field){
            field.value = undefined;
        });
        me.temp_fields = [];
    };

    // +PUBLIC
    var getFields = function(){
        // Return list of all fields, (for convinient iteration)
        var field_iter = [];
        me.fields.forEach(function(row){
            row.forEach(function(field){
                field_iter.push(field);
            });
        });
        return field_iter;
    };

    // +PUBLIC
    var getFieldArray = function(){
        return me.fields;
    };

    // specify the public interface
    var mePointer = {
        getWidth            : getWidth,
        getHeight           : getHeight,
        getView             : getView,
        getField            : getField,
        getFieldValue       : getFieldValue,
        setFieldValue       : setFieldValue,
        setTempFieldValue   : setTempFieldValue,
        resetTempFields     : resetTempFields,
        getFields           : getFields,
        getFieldArray       : getFieldArray,
    };

    init(width, height);

    return mePointer;
}

// VIEW ========================================================================
var BoardView = function(controller){

    var me = this;

    // -PRIVATE
    var init = function(controller){
        me.controller = controller;
    }

    // -PRIVATE
    var render = function(){
        // render initially
        getTemplate('board', {
                    board: me.controller.getFieldArray()
                }).then(function(base){
            // render the game
            me.base = $(base);
            me.tag.append(me.base);

            // send out that the board is ready
            window.dispatchEvent(new Event('board-ready'));
        });
    }

    // +PUBLIC
    var add_to = function(view){
        me.tag = view.getBase();
        render();
    }

    // +PUBLIC
    var update = function(){
        // remove old field
        me.base.remove();
        // render new state
        render();
    }

    init(controller);
    // specify public interface
    return {
        add_to  : add_to,
        update  : update,
    }
}
