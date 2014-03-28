function getTemplate(name, data) {
    return $.get('/templates/'+name+'.hbs').then(function(src) {
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
        return block.fn(player.getName());
    } else {
        return block.inverse();
    }
});
