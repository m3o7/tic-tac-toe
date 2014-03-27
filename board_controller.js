// CONTROLLER ==================================================================
// represents the game board - usually a 3x3 board
var move_history = [];

function BoardController(width, height){
    this.width = width;
    this.height = height;
    this.fields = this.__init_field__(this.width, this.height);

    this.view = new BoardView(this);

    this.temp_fields = [];
}

BoardController.prototype.__init_field__ = function(width, height){
    var fields = new Array(width);
    for (var y = 0; y < width; y++) {
        fields[y] = new Array(height);  
        for (var x = 0; x < fields[y].length; x++) {
            fields[y][x] = new Field(this, undefined, x, y);
        };
    }
    return fields;
}

BoardController.prototype.get_field = function(y, x){
    return this.fields[y][x];
}

BoardController.prototype.get_field_value = function(y, x){
    return this.get_field(y, x).value;
}

BoardController.prototype.set_field_value = function(new_value, y, x){
    // TODO: remove - DEBUG ONLY
    move_history.push(''+x+','+y+','+new_value.symbol);

    this.fields[y][x].value = new_value;
}

BoardController.prototype.set_temp_field_value = function(new_value, y, x){
    // for simulation purposes - simulate future move(s)
    this.temp_fields.push(this.fields[y][x]);
    this.fields[y][x].value = new_value;
}

BoardController.prototype.reset_temp_fields = function(){
    // for simulation purposes - reset the future fields
    this.temp_fields.forEach(function(field){
        field.value = undefined;
    });
    this.temp_fields = [];
}

BoardController.prototype.get_fields = function(){
    var field_iter = [];
    for (var y = 0; y < this.fields.length; y++) {
        for (var x = 0; x < this.fields[y].length; x++) {
            field_iter.push(this.fields[y][x]);
        }
    }
    return field_iter;
}

// VIEW ========================================================================
function BoardView(controller){
    this.controller = controller;
}

BoardView.prototype.__render__ = function(){
    // render initially
    var cl_this = this; // closure
    getTemplate('board', this).then(function(base){
        // render the game
        cl_this.base = $(base);
        cl_this.tag.append(cl_this.base);

        // send out that the board is ready
        window.dispatchEvent(new Event('board-ready'));
    });
}

BoardView.prototype.add_to = function(view){
    this.tag = view.base;
    this.__render__();
}

BoardView.prototype.update = function(){
    // remove old field
    this.base.remove();
    // render new state
    this.__render__();
}