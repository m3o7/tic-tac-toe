// CONTROLLER ==================================================================
// represents the game board - usually a 3x3 board
function BoardController(width, height){
    this.width = width;
    this.height = height;
    this.fields = this.__init_field__(this.width, this.height);

    this.view = new BoardView(this);
}

BoardController.prototype.__init_field__ = function(width, height){
    var fields = new Array(width);
    for (var i = 0; i < width; i++) {
        fields[i] = new Array(height);
    }
    return fields;
}

// VIEW ========================================================================
function BoardView(controller){
    this.controller = controller;
}

BoardView.prototype.add_to = function(view){
    this.tag = view.base;
    
    // render initially
    var cl_this = this; // closure
    getTemplate('board', this).then(function(base){
        // render the game
        cl_this.base = $(base);
        cl_this.tag.append(cl_this.base);
    });
}

// BoardView.prototype.update = function(){
//     var cl_this = this; // closure
//     getTemplate('board', this).then(function(base){
//         // render the game
//         cl_this.base = $(base);
//     });
// }
