db.category = 'start';
$(document).on('click', '#start-protocols-list-dropdown a', function(){

    $.request('get_list', {db: $(this).data('db'), year: $(this).data('year')}, {context: $('#start-protocols-list-container')}).done(function(data){

        this.html(data.list);

    });
}).on('click', '#start-permissions-list-dropdown a', function(){

    $.request('get_list', {db: $(this).data('db'), year: $(this).data('year')}, {context: $('#start-permissions-list-container')}).done(function(data){

        this.html(data.list);

    });
}).on('click', '#start-programs-list-dropdown a', function(){
    $.request('get_list', {db: $(this).data('db'), year: $(this).data('year')}, {context: $('#start-programs-list-container')}).done(function(data){

        this.html(data.list);

    });
});
release();