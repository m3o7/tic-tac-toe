// CONTROLLER ==================================================================
// represents the game board - usually a 3x3 board
var moveHistory = [];

var BoardController = function(width, height){

    var me = this;

    // -PRIVATE
    function init(width, height){
        me.width = width;
        me.height = height;
        me.fields = initFields(me.width, me.height);

        me.view = new BoardView(mePointer);
        me.tempFields = []; // used to keep track of simulated moves
    };

    // -PRIVATE
    function initFields(width, height){
        var fields = new Array(width);
        for (var y = 0; y < width; y++) {
            fields[y] = new Array(height);  
            for (var x = 0; x < fields[y].length; x++) {
                fields[y][x] = new Field(mePointer, undefined, x, y);
            };
        }
        return fields;
    };

    function clear(){
        // reset every field on the board
        getFields().forEach(function(field){
            field.setInstVar('value', undefined);
        });
    };

    // +PUBLIC
    function getWidth(){
        return me.width;
    };

    // +PUBLIC
    function getHeight(){
        return me.height;
    };

    // +PUBLIC
    function getView(){
        return me.view;
    };

    // +PUBLIC
    function getField(y, x){
        return me.fields[y][x];
    };

    // +PUBLIC
    function getFieldValue(y, x){
        return getField(y, x).getInstVar('value');
    };

    // +PUBLIC
    function setFieldValue(newValue, y, x){
        me.fields[y][x].setInstVar('value', newValue);

        // DEBUG ONLY - to keep the move history
        moveHistory.push(''+x+','+y+','+newValue.symbol);
    };

    // +PUBLIC
    function setTempFieldValue(newValue, y, x){
        // for simulation purposes - simulate future move(s)
        me.tempFields.push(me.fields[y][x]);
        me.fields[y][x].setInstVar('value', newValue);
    };

    // +PUBLIC
    function resetTempFields(){
        // for simulation purposes - reset the future fields
        me.tempFields.forEach(function(field){
            field.setInstVar('value', undefined);
        });
        me.tempFields = [];
    };

    // +PUBLIC
    function getFields(){
        // Return list of all fields, (for convinient iteration)
        var fieldIter = [];
        me.fields.forEach(function(row){
            row.forEach(function(field){
                fieldIter.push(field);
            });
        });
        return fieldIter;
    };

    // +PUBLIC
    function getFieldArray(){
        return me.fields;
    };

    // specify the public interface
    var mePointer = {
        clear               : clear,
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
    function init(controller){
        me.controller = controller;
    }

    // -PRIVATE
    function render(){
        // render initially
        getTemplate('board', {
                    board: me.controller.getFieldArray()
                }).then(function(base){
            // render the game
            me.base = $(base);
            me.tag.append(me.base);

            // send out that the board is ready
            window.dispatchEvent(new Event('board-ready'));

            // vertically center board
            function alignVertically(){
                var height = $('.ttt-game').height();
                $('.ttt-game').offset({top: (($(window).height() - height)/2)});
            }
            
            alignVertically();
            $(window).resize(function(){
                alignVertically();
            });
        });
    }

    // +PUBLIC
    function addTo(view){
        me.tag = view.getBase();
        render();
    }

    init(controller);
    // specify public interface
    return {
        addTo  : addTo,
    }
}
