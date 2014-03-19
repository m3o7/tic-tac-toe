// represents the game board - usually a 3x3 board
function BoardController(width, height){
    this.width = width;
    this.height = height;
    this.fields = this.__init_field__(this.width, this.height);

    this.view = new BoardView();
}

BoardController.prototype.__init_field__ = function(width, height){
    var fields = new Array(width);
    for (var i = 0; i < width; i++) {
        fields[i] = new Array(height);
    }
    return fields;
}


function BoardView(tag){
    this.tag = tag;
}

BoardView.prototype.update = function(){
    this.__render__();
}

BoardView.prototype.__render__ = function(){
    var cl_this = this; // closure
    getTemplate('game').then(function(base){
        // render the game
        cl_this.base = $(base);
        $(cl_this.tag).append(cl_this.base);
    });
}