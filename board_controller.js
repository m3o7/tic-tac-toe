// CONTROLLER ==================================================================
// represents the game board - usually a 3x3 board
var moveHistory = [];

var BoardController = Class.extend({

    // -PRIVATE
    init: function(width, height){
        this.width = width;
        this.height = height;
        this.fields = this.initFields(this.width, this.height);

        this.view = new BoardView(this);
        this.tempFields = []; // used to keep track of simulated moves
    },

    // -PRIVATE
    initFields: function(width, height){
        var fields = new Array(width);
        for (var y = 0; y < width; y++) {
            fields[y] = new Array(height);  
            for (var x = 0; x < fields[y].length; x++) {
                fields[y][x] = new Field(this, undefined, x, y);
            };
        }
        return fields;
    },

    clear: function(){
        // reset every field on the board
        this.getFields().forEach(function(field){
            field.setInstVar('value', undefined);
        });
    },

    // +PUBLIC
    getWidth: function(){
        return this.width;
    },

    // +PUBLIC
    getHeight: function(){
        return this.height;
    },

    // +PUBLIC
    getView: function(){
        return this.view;
    },

    // +PUBLIC
    getField: function(y, x){
        return this.fields[y][x];
    },

    // +PUBLIC
    getFieldValue: function(y, x){
        return this.getField(y, x).getInstVar('value');
    },

    // +PUBLIC
    setFieldValue: function(newValue, y, x){
        this.fields[y][x].setInstVar('value', newValue);

        // DEBUG ONLY - to keep the move history
        moveHistory.push(''+x+','+y+','+newValue.symbol);
    },

    // +PUBLIC
    setTempFieldValue: function(newValue, y, x){
        // for simulation purposes - simulate future move(s)
        this.tempFields.push(this.fields[y][x]);
        this.fields[y][x].setInstVar('value', newValue);
    },

    // +PUBLIC
    resetTempFields: function(){
        // for simulation purposes - reset the future fields
        this.tempFields.forEach(function(field){
            field.setInstVar('value', undefined);
        });
        this.tempFields = [];
    },

    // +PUBLIC
    getFields: function(){
        // Return list of all fields, (for convinient iteration)
        var fieldIter = [];
        this.fields.forEach(function(row){
            row.forEach(function(field){
                fieldIter.push(field);
            });
        });
        return fieldIter;
    },

    // +PUBLIC
    getFieldArray: function(){
        return this.fields;
    },
});

// VIEW ========================================================================
var BoardView = Class.extend({

    // -PRIVATE
    init: function(controller){
        this.controller = controller;
    },

    // -PRIVATE
    render: function(){
        var me = this;
        // render initially
        getTemplate('board', {
                    board: me.controller.getFieldArray()
                }).then(function(base){
            // render the game
            me.base = $(base);
            me.tag.append(me.base);

            // send out that the board is ready
            window.dispatchEvent(new Event('board-ready'));

            alignVertically();
        });
    },

    // +PUBLIC
    addTo: function(view){
        this.tag = view.getBase();
        this.render();
    },
});
