// vertically center board
function alignVertically(){
    var height = $('.ttt-game').height();
    $('.ttt-game').offset({top: (($(window).height() - height)/2)});
}

$(window).resize(function(){
    alignVertically();
});

function shuffle(oldArray) {
    var newArray = oldArray.slice();
    var len = newArray.length;
    var i = len;
    while (i--) {
        var p = parseInt(Math.random()*len);
        var t = newArray[i];
        newArray[i] = newArray[p];
        newArray[p] = t;
    }
    return newArray; 
};

function getTemplate(name, data) {
    return $.get('templates/'+name+'.hbs').then(function(src) {
       return Handlebars.compile(src)(data);
    });
};

Handlebars.registerHelper('symbol', function(field) {
    return new Handlebars.SafeString(
        field.getInstVar('value').getSymbol()
    );
});

Handlebars.registerHelper('hasSymbol', function(field, block) {
    var value = field.getInstVar('value');
    if(typeof value !== 'undefined') {
        return block.fn(field);
    } else {
        return block.inverse(field);
    }
});

Handlebars.registerHelper('hasWinner', function(player, block) {
    if(typeof player !== 'undefined') {
        return block.fn(player);
    } else {
        return block.inverse();
    }
});

Handlebars.registerHelper('isComputer', function(player, block) {
    if(player.isComputer()) {
        return block.fn();
    } else {
        return block.inverse(player.getName());
    }
});
