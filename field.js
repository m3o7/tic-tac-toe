function Field (board, value, x, y) {
    this.board = board;
    this.value = value;
    this.x = x;
    this.y = y;
}

Field.prototype.has_right_neighbor = function(){
    return this.board.fields[this.y].length - 1 > this.x;
}

Field.prototype.has_left_neighbor = function(){
    return this.x > 0;
}

Field.prototype.has_lower_neighbor = function(){
    return this.board.fields.length - 1 > this.y;
}

Field.prototype.has_upper_neighbor = function(){
    return this.y > 0;
}

Field.prototype.get_right_neighbor = function(){
    if (this.has_right_neighbor()) {
        return this.board.fields[this.y][this.x + 1];
    }
}

Field.prototype.get_left_neighbor = function(){
    if (this.has_left_neighbor()) {
        return this.board.fields[this.y][this.x - 1];
    }
}

Field.prototype.get_lower_neighbor = function(){
    if (this.has_lower_neighbor()) {
        return this.board.fields[this.y + 1][this.x];
    }
}

Field.prototype.get_upper_neighbor = function(){
    if (this.has_upper_neighbor()){
        return this.board.fields[this.y -1][this.x];
    }
}

Field.prototype.get_right_upper_neighbor = function(){
    var right = this.get_right_neighbor();
    if (typeof right !== 'undefined') {
        return right.get_upper_neighbor();
    }
}

Field.prototype.get_right_lower_neighbor = function(){
    var lower = this.get_lower_neighbor();
    if (typeof lower !== 'undefined') {
        return lower.get_right_neighbor();
    };
}

Field.prototype.get_oppisite_field = function(){
    // calculate the opposite
    var y = 1 + (1 - this.y);
    var x = 1 + (1 - this.x);
    return this.board.get_field(y, x);
}