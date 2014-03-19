// represents the game board - usually a 3x3 board
function BoardController(width, height){
    this.width = width;
    this.height = height;
    this.fields = this.__init_field__(this.width, this.height);
}

BoardController.prototype.__init_field__ = function(width, height){
    // TODO: implement init
    return 
}
