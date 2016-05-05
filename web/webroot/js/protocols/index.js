db.category = 'protocols';
db.main_container = $('#main-container');
db.bgload = $('#bgload');
$('[name = "date"]').datepicker(datepicker_options);

$.extend(db,
    {
        pad: $('#create-protocol-pad-wrap'),
        list: $('#protocol-list-wrap'),
        form: $('#protocol-form-wrap'),
        pad_toggle:  $('#create-protocol-menu-toggle'),
        console: $('.console'),
        paragraphmenu: $('.paragraph-menu')
    }
);

db.paragraphs = function(param1, param2, param3){
    var paragraphs = db.form.data('elements').paragraphs_container().find('.paragraph');
    var contents = db.form.data('elements').contents_container().find('.tab-pane');
    if (param1 === undefined) return paragraphs;
    if (param1 == 'tab') return paragraphs.find('[data-toggle = "tab"]');
    if (param1 == 'input') return paragraphs.find('.ajax-data');
    if (param1 == 'empty') {
        if (param2 == 'tab') return db.form.data('elements').paragraphs_container().find('.paragraph-empty').find('[data-toggle = "tab"]');
        return db.form.data('elements').paragraphs_container().find('.paragraph-empty');
    }
    if (param1 == 'text') {
        if (param3 === undefined) return paragraphs.has(this.paragraphs('tab').filter(paragraphTextToAttr(param2).aria_controls.wrapToAttr('aria-controls')));
        if (param3 == 'content' || param3 == 'state' || param3 == 'term' || param3 == 'executive' || param3 == 'class' || param3 == 'section' || param3 == 'status' || param3 == 'report') return $('#' + paragraphTextToAttr(param2).id).find('.ajax-data' + param3.wrapToAttr('name'));
    }
    if (param1 == 'content' || param1 == 'state' || param1 == 'term' || param1 == 'executive' || param1 == 'class' || param1 == 'section' || param1 == 'status' || param1 == 'report') return contents.find('.ajax-data' + param1.wrapToAttr('name'));
    if (param1 == 'contents') return contents.find('.ajax-data');
    if (param1 == 'current') {
        var paragraph = paragraphs.filter('.active');
        if (param2 === undefined) return paragraph;
        if (param2 == 'tab') return paragraph.find('[data-toggle = "tab"]');
        if (param2 == 'input') return paragraph.find('.ajax-data');
        if (param2 == 'content' || param2 == 'state' || param2 == 'term' || param2 == 'executive' || param2 == 'status') return contents.filter('.active').find('.ajax-data' + param2.wrapToAttr('name'));
        if (param2 == 'contents') return contents.filter('.active').find('.ajax-data');
    }

    var form_elements = db.form.data('elements');
    var options = form_elements.contents_container().find('.ajax-data[name = "status"] option');
    var collection = $(), a = db.paragraphs('tab');

    if (param1 == 'implemented') {
        options = options.filter(':selected[value = "2"]');
    }
    if (param1 == 'in-progress') {
        options = options.filter(':selected[value = "1"]');
    }
    if (param1 == 'not-implemented') {
        options = options.filter(':selected[value = "0"]');
    }

    options.each(function(){
        collection = collection.add(a.filter($(this).closest('.tab-pane').attr('id').wrapToAttr('aria-controls')).closest('.paragraph'));
    });

    return collection;

};

$(document).on('click', db.pad_toggle.selector, function(){

    if(!db.pad.data('shown')){
        db.pad.pad('show');
    }
});

console.log(db);

// C O N S O L E **********************************************************************
(function($){

    var options;

    var methods = {

        init: function(){

            this.data({
                init: true,
                shown: !this.is(':hidden'),
                elements: {
                    log: $('#protocol-log'),
                    stats: $('#protocol-stats')
                }
            });

            var elements = this.data('elements');

            $(document).on('click.console.stats', elements.stats.find('.stats-par').selector + ', ' + elements.log.find('.stats-par').selector, function(){
                db.form.data('elements').service.filter_button.find('option[value = "3"]').prop('selected', true);
                db.form.data('elements').service.filter_button.trigger('change');
                db.paragraphs('text', $(this).text()).paragraph('select');
            });

            return this;
        },
        log: function(msg, code){
            var now = new Date;
            var hours = String(now.getHours());
            var minutes = String(now.getMinutes());
            var seconds = String(now.getSeconds());

            var time = (hours.length > 1 ? hours : '0' + hours) + ':' + (minutes.length > 1 ? minutes : '0' + minutes) + ':' + (seconds.length > 1 ? seconds : '0' + seconds);
            var line = $('<div class = "console-log-line">').append('<span style = "display: inline-block; width: 75px">' + time, '<span style = "display: inline-block">' + msg);
            if(code === 0) line.addClass('bg-danger').find('span').addClass('text-danger');
            if(code === 1) line.addClass('bg-success').find('span').addClass('text-success');

            this.data('elements').log.find('.well-sm').prepend(line);
            return this;
        },
        stats: function(param1){

            var container = this.data('elements').stats;
            if(param1 == 'hide'){
                container.addClass('hidden');
                return this;
            }
            if(param1 == 'show'){
                container.removeClass('hidden');
                return this;
            }

            var paragraphs_container;
            container.find('.stats-value, .stats-par-value').empty();

            $.each(param1, function(i, val){
                container.find('.stats-' + i + ' .stats-value').text(val.count);
                paragraphs_container = container.find('.stats-' + i + ' .stats-par-value');
                if (val.count == 0) paragraphs_container.text(' отсутствуют');
                $.each(val.paragraphs, function(i1, val1){
                    paragraphs_container.append('<span class = "stats-par btn btn-xs" title = "' + param1.total.content[val1] + '">' + val1);
                });
            });



            return this;

        }
    };

    $.fn.console = function(method){

        if(!this.is('.console')){
            $.error( 'Элемент должен иметь класс console.' );
        }

        if ( methods[method] ) {

            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод "' +  method + '" не найден в плагине jQuery.console' );
        }
    };

})(jQuery);

// P A D **********************************************************************
(function($){

    var options;

    var methods = {
        init: function(){
            var $this = this;
            this.data({
                init: true,
                shown: !this.is(':hidden'),
                elements: {
                    create_button: $('#protocol-create'),
                    select_units: $('#protocol-unit'),
                    select_years: $('#protocol-year'),
                    select_date: $('#protocol-date'),
                    highlighted: function(){
                        return $this.find('.not-filled');
                    }
                }
            });
            var elements = this.data('elements');

            elements.create_button.on('click.pad.create', function(){
                cursor_hold();
                var id = elements.select_units.val();
                var year = elements.select_years.val();
                var date = elements.select_date.val();
                var parts = date.split('.');
                var count = 0;
                var valid = true;

                var msg = 'Нельзя создать протокол: ';
                if(id == -1){
                    msg += 'не заполнено поле' + '[Блок]'.emphasize('danger');
                    count++;
                    valid = false;
                    elements.select_units.addClass('not-filled');


                } else if(year == -1){
                    msg += 'не заполнено поле' + '[ППР]'.emphasize('danger');
                    count++;
                    valid = false;
                    elements.select_years.addClass('not-filled');
                } else if (year == -2){
                    msg += 'не заполнено поле' + '[ППР]'.emphasize('danger') + ('(для блока ' + elements.select_units.find('option:selected').text() + ' занят весь диапазон ППР)').emphasize('info');
                    count++;
                    valid = false;
                    elements.select_years.addClass('not-filled');
                } else if(date.length == 0){
                    msg += 'не заполнено поле' + '[Дата выдачи]'.emphasize('danger');
                    count++;
                    valid = false;
                    elements.select_date.addClass('not-filled');
                } else if (parts.length != 3 || parts[0].length != 2 || parts[1].length != 2 || parts[2].length != 4){
                    msg += 'неправильный формат даты в поле' + '[Дата выдачи]'.emphasize('danger') + '. ' + 'Формат даты: [ ДД, ММ, ГГГГ ]'.emphasize('info');
                    count++;
                    valid = false;
                    elements.select_date.addClass('not-filled');
                }

                if (!valid){
                    cursor_release();
                    return info('Ошибка!', msg).then(function(){
                        db.console.console('log', msg, 0);
                        return false;
                    });


                }


                var request_data = {
                    'id' : id,
                    'year' : year,
                    'date' : date
                };

                var is_first = false;

                $.request('create', request_data)
                    .then(function(){

                        if($DATA.form_data === false){

                            hold();

                            is_first = true;

                            return $.when($.request('get_protocols'), $.request('get_form_data', request_data), $.request('get_list'));
                        }
                        return $.when($.request('get_protocols'), $.request('get_form_data', request_data))
                    })
                    .then(function(){

                        $this.pad('change', 'unit', '-1').data('current_protocol', {id: id, year: year});

                        if(is_first){

                            db.console.console('stats', 'show');

                            $.each(db.form.data('elements').service, function(i, val){
                                val.prop('disabled', false);
                            });

                            $('#create-protocol-menu-toggle-wrap').append(db.pad_toggle);

                            $this.pad('fix', false).pad('hide');

                            release();
                            cursor_release();


                            db.list.list().list('open', year).list('load');

                        } else {

                            $this.pad('hide');

                            cursor_release();

                            db.list.list('refresh', 'create').list('open', year).list('load');

                        }



                    });
            });

            elements.select_units.on('change.pad', function(){

                cursor_hold();

                elements.select_years.prop('disabled', false);

                var id = elements.select_units.find(':selected').val();

                if(id == -1){
                    elements.select_years.prop('disabled', true).html('<option value = "-1">Блок не выбран</option>');

                    cursor_release();
                    return false;
                }

                $.request('get_years', id).done(function(data){
                    elements.select_years.html(data.years);

                    cursor_release();
                });
            });

        },
        show: function(){
            this.addClass('open').show();
            this.data('shown', true);
            var $this = this;
            if(!this.hasClass('static')){
                $(document).on('click.pad', function(){

                    if($this.data('shown')){
                        if(
                            !$this.data('not-hide') &&
                            $(event.target).closest(db.pad).length == 0 &&
                            $(event.target).closest('#ui-datepicker-div').length == 0 &&
                            $(event.target).closest('.ui-datepicker-prev').length == 0 &&
                            $(event.target).closest('.ui-datepicker-next').length == 0 &&
                            $(event.target).closest('.ui-dialog').length == 0 &&
                            $(event.target).closest('.ui-widget-overlay').length == 0
                        )
                        {
                            $this.pad('hide');

                        }
                    }
                });
            }

            return this;
        },
        hide: function(){
            this.removeClass('open').hide();
            this.data('shown', false);
            this.data('not-hide', false);
            $(document).off('click.pad');
            return this;
        },
        update: function(){
            var $this = this;
            var units = $DATA.units;
            var select_units = $this.data('elements').select_units;
            $.each(units, function(i, val){
                select_units.append($('<option>', {value: i, text: val.unit_name}));
            });
            return this;
        },
        fix: function(fix){
            if(fix) {
                this.addClass('static');
            } else {
                this.removeClass('static');
            }
            return this;
        },
        change: function(what, value){

            var elements = this.data('elements');
            var keys = Object.keys($DATA.units);
            var years_range = range($DATA.defaults.max_year, $DATA.defaults.min_year);
            var msg_units = '-1, ' + keys.join(', '),
                msg_years = years_range.join(', ');

            if(what == 'unit'){
                if($.inArray(value, keys) == -1 && value != -1) $.error( 'Неправильное значение аргумента value для функции change плагина jQuery.pad. Функция для selectbox "Блок" допускает значения ' + msg_units + '.' );
                elements.select_units.find('option' + value.wrapToAttr('value')).prop('selected', true).end().trigger('change.pad');
                return this;
            }

            if(what == 'year'){
                if($.inArray(value, years_range) == -1 && value != -1) $.error( 'Неправильное значение аргумента value для функции change плагина jQuery.pad. Функция для selectbox "ППР" допускает значения ' + msg_years + '.' );
                elements.select_years.find('option' + value.wrapToAttr('value')).prop('selected', true);
                return this;
            }

            $.error( 'Неправильное значение аргумента what для функции change плагина jQuery.pad. Функция допускает значения "unit" и "year".' );
        }

    };

    $.fn.pad = function(method, request){

        if(!this.is('#create-protocol-pad-wrap')){
            $.error( 'Плагин jQuery.pad нужно применять на элемент #create-protocol-pad-wrap' );
        }

        if ( methods[method] ) {
            if( method == 'request'){
                return methods[ method ][ request ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            }

            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод "' +  method + '" не найден в плагине jQuery.pad' );
        }
    };

})(jQuery);

// L I S T ************************************
(function($){

    var options;

    var methods = {

        init: function(){
            var $this = this;
            this.data({
                init: true,
                elements: {
                    panels: function(year){
                        if(year === undefined){
                            return $this.find('.panel');
                        } else {
                            return $this.find('.accordion-button' + year.wrapToAttr('data-year')).closest('.panel');
                        }
                    },
                    buttons: function(year){
                        var buttons = $this.find('.accordion-button');
                        if(year === undefined){
                            return buttons;
                        } else {
                            return buttons.filter(year.wrapToAttr('data-year'));
                        }
                    },
                    items: function(year, id){
                        var items = $this.find('.protocol-load');
                        if(id === undefined && year === undefined){
                            return $this.find('.protocol-load');
                        } else if (id === undefined){
                            return items.filter(year.wrapToAttr('data-year'));
                        } else {
                            return items.filter(id.wrapToAttr('data-id') + year.wrapToAttr('data-year'));
                        }
                    }
                }
            });

            this.html($DATA.list);

            var elements = this.data('elements');

            $(document).on('dblclick.list', elements.items().selector, function(){
                $this.list('load', $(this).attr('data-id'), $(this).attr('data-year'));
            }).on('show.bs.collapse', '#protocol-list .panel-collapse', function(){
                $('.accordion-button' + $(this).attr('id').wrapToAttr('aria-controls')).addClass('active').find('.accordion-icon').html('<span class = "glyphicon glyphicon-triangle-bottom">');
            }).on('hide.bs.collapse', '#protocol-list .panel-collapse', function(){
                $('.accordion-button' + $(this).attr('id').wrapToAttr('aria-controls')).removeClass('active').find('.accordion-icon').html('<span class = "glyphicon glyphicon-triangle-right">');
            });

            return this;
        },
        refresh: function(option){

            var elements = this.data('elements');

            if(option == 'create'){
                var year = $DATA.create.year;
                var id = $DATA.create.id;
                var keys = [];
                var before;
                var pos;
                if($DATA.create.refresh == 'item'){

                    $.each(elements.items(year), function(){
                        keys.push($(this).attr('data-id'));
                    });
                    pos = relative_position(id, keys);

                    if(pos == 'last'){
                        elements.items(year).last().after($DATA.create.item);
                    } else if (pos == 'first') {
                        elements.items(year).first().before($DATA.create.item);
                    } else {
                        elements.items(year, pos).before($DATA.create.item);
                    }

                    refresh_docs_count(elements.buttons(year));

                } else if ($DATA.create.refresh == 'panel'){

                    $.each(elements.buttons(), function(){
                        keys.push($(this).attr('data-year'));
                    });

                    pos = relative_position(year, keys);

                    if(pos == 'last'){
                        elements.panels().first().before($DATA.create.panel);
                    } else if (pos == 'first'){
                        elements.panels().last().after($DATA.create.panel);
                    } else {
                        elements.panels(pos).after($DATA.create.panel);
                    }
                }
            }

            if(option == 'archive'){
                if($DATA.archive.remove == 'item'){
                    this.data('elements').items($DATA.archive.year, $DATA.archive.id).remove();
                    refresh_docs_count(elements.buttons($DATA.archive.year));

                }
                if($DATA.archive.remove == 'panel'){
                    this.data('elements').panels($DATA.archive.year).remove();

                }
            }

            return this;

        },
        open: function(year){
            var button = this.data('elements').buttons(year);
            if(button.hasClass('collapsed')) button.trigger('click');
            return this;
        },
        load: function(id, year){

            db.form.form('hold', 'form').form('hold', 'service');
            cursor_hold();

            function load(){

                var msg = 'Протокол загружен: ' + ('[' + $DATA.units[$id].unit_name + ' ППР-' + $year + ']').emphasize('info');

                form_elements.service.filter_button.find('option[value = "3"]').prop('selected', true);
                form_elements.service.view_button.removeClass('text-muted').attr('title', 'Сканированная версия проткоола не загружена').prop('disabled', false);
                form_elements.header.html($DATA.form_data.form_header);
                form_elements.paragraphs_container().html($DATA.form_data.form_paragraphs).removeClass('paragraphs-container-bg-empty');
                form_elements.contents_container().html($DATA.form_data.form_contents);
                db.paragraphs('term').datepicker(datepicker_options);


                if($DATA.form_data.link === null){
                    form_elements.service.view_button.addClass('text-muted').prop('disabled', true);
                } else {
                    form_elements.service.view_button1.add(form_elements.service.view_button2).data('link', $DATA.form_data.link).attr('title', 'Смотреть сканированную версию протокола');
                    form_elements.service.view_button.prop('disabled', false);
                }

                db.form.data('current_protocol', {id: $id, year: $year});
                $this.find('.protocol-load.doc-active.current').removeClass('doc-active current');
                elements.items($year, $id).addClass('doc-active current');
                $this.list('open', $year);
                db.console.console('log', msg, 1);
                db.console.console('stats', $DATA.form_data.stats);

            }

            var $this = this;
            var $id, $year;

            var elements = this.data('elements');
            var form_elements = db.form.data('elements');

            if (id === undefined){
                $year = $DATA.form_data.year;
                $id = $DATA.form_data.id;

                load();
                db.paragraphs().paragraph().paragraph('edit', false, 'all').first().paragraph('select');
                db.form.form('release', 'form').form('release', 'service');

                cursor_release();
                return this;
            }

            $.request('get_form_data', {id: id, year: year}).done(function(){
                $id = id;
                $year = year;
                load();
                db.paragraphs().paragraph().paragraph('edit', false, 'all').first().paragraph('select');
                db.form.form('release', 'form').form('release', 'service');
                cursor_release();
            });
        }
    };

    function refresh_docs_count(button){
        button.find('.docs-count').text($DATA.protocols.by_year.regular[button.attr('data-year')].length);
    }

    $.fn.list = function(method, request){

        if(!this.is('#protocol-list-wrap')){
            $.error( 'Плагин jQuery.list нужно применять на элемент #protocol-list-wrap' );
        }

        if ( methods[method] ) {
            if( method == 'request'){
                return methods[ method ][ request ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            }
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод "' +  method + '" не найден в плагине jQuery.list' );
        }
    };

})(jQuery);

// F O R M **************************************************

(function($){

    var options;

    var methods = {

        init: function(){

            var $this = this;

            this.data({
                init: true,
                elements: {
                    service: {
                        container: $('.form-service-panel'),
                        save_button: $('#protocol-save'),
                        filter_button: $('#protocol-filter'),
                        upload_button: $('#protocol-upload'),
                        view_button: $('#protocol-view'),
                        view_button1: $('#protocol-view-1'),
                        view_button2: $('#protocol-view-2'),
                        archive_button: $('#protocol-archive')
                    },
                    header: $('#protocol-form-header-wrap'),
                    data_container: function(){
                        return $this.find('.protocol-input-group');
                    },
                    paragraphs_container: function(){
                        return $this.find('.nav-paragraph');
                    },
                    contents_container: function(){
                        return $this.find('.protocol-input-group .tab-content');
                    },
                    date: function(){
                        return this.header.find('.protocol-header-date');
                    }
                }
            });

            var elements = this.data('elements');

            $(document).on('click.form.save', elements.service.save_button.selector, function(){

                $this.form('save');

            }).on('click.form.archive', elements.service.archive_button.selector, function(){

                confirmAction('Перенести в архив?', 'Данный протокол будет перенесен в архив. Подтвердите действие.')
                    .then(function(data){
                        if(data){
                            $this.form('archive');
                        }
                    });

            }).on('click.form.view', elements.service.view_button1.selector, function(){

                window.open($(this).data('link'));

            }).on('click.form.view', elements.service.view_button2.selector, function(){

                window.open($(this).data('link'), "", "width=600, height=600, left=400, top=300");

            }).on('change.form.filter', elements.service.filter_button.selector, function(){

                $this.form('filter', $(this).val());

            }).on('click.form.date', elements.date().selector, function(){

                $(this).prop('contenteditable', true).addClass('editing').focus();

            }).on('keydown.form.date', elements.date().selector, function(){

                if(event.keyCode === 13){
                    event.preventDefault();
                    event.stopPropagation();
                    var current_protocol = $this.data('current_protocol');
                    $.request('save_date', {id: current_protocol.id, year: current_protocol.year, date: $(this).text().convertDate()}, {context: $(this)}).done(function(){

                        this.focusout();
                    });

                }

            }).on('focusout.form.date', elements.date().selector, function(){
                $(this).prop('contenteditable', false).removeClass('editing');
            }).on('change.form.status', elements.contents_container().find('[name = "status"]').selector, function(){
                cursor_hold();

                var current_protocol = $this.data('current_protocol');
                var status = $(this).val();
                var that = $(this);

                var paragraph = db.paragraphs('current', 'input').val();

                if (paragraph.length == 0){
                    db.console.console('log', 'Нельзя изменить статус пункта без номера', 0);
                    db.paragraphs('current', 'status').find('option' + '1'.wrapToAttr('value')).prop('selected', true);
                    db.paragraphs('current').paragraph('menu', 'edit');
                    cursor_release();
                    return false;
                }

                    $.request('save_status',
                        {
                            id: current_protocol.id,
                            year: current_protocol.year,
                            paragraph: db.paragraphs('current').find('.ajax-data').val(),
                            status: status
                        }
                    ).then(function(){
                        return $.request('get_stats', {id: current_protocol.id, year: current_protocol.year});
                    }).done(function(data){
                        db.console.console('stats', $DATA.stats);
                        var filter = $this.data('elements').service.filter_button.val();
                        if(filter == '3') {
                            cursor_release();
                            return false;
                        }

                        if(status != filter){
                            $(that.closest('.tab-pane').attr('id').wrapToAttr('aria-controls')).closest('.paragraph').hide();
                        }

                        var visible_paragraphs = db.paragraphs().not(':hidden');
                        if(visible_paragraphs.length == 0){
                            db.paragraphs('empty').paragraph('select', 'empty');
                            cursor_release();
                            return false;
                        }
                        visible_paragraphs.first().paragraph('select');
                        cursor_release();

                    });

            });

            return this;
        },
        hold: function(what){
            if (what == 'form') this.data('elements').data_container().addClass('holden').append('<div class = "holden-overlay holden-overlay-form">');
            if (what == 'service') this.data('elements').service.container.addClass('holden').append('<div class = "holden-overlay">');
            return this;
        },
        release: function(what){
            if (what == 'form') this.data('elements').data_container().removeClass('holden').find('.holden-overlay').remove();
            if (what == 'service') this.data('elements').service.container.removeClass('holden').find('.holden-overlay').remove();
            return this;
        },
        filter: function(status){
            cursor_hold();
            var $status;
            switch(status){
                case '0': $status = 'not-implemented';
                    break;
                case '1': $status = 'in-progress';
                    break;
                case '2': $status = 'implemented'
            }

            db.paragraphs().hide();
            var target = db.paragraphs($status);
            if(target.length == 0){
                db.paragraphs('empty').paragraph('select', 'empty');
            } else {
                target.show().first().paragraph('select');
            }
            cursor_release();

        },
        save: function(what){

            db.form.form('hold', 'form').form('hold', 'service');
            cursor_hold();

            var current_protocol = this.data('current_protocol');
            var request_data = {
                id: current_protocol.id,
                year: current_protocol.year,
                data: {}

            };
            var a, paragraph, fields, invalid_paragraphs, msg;
            var valid = true;

            if(what === undefined){

// ************************************** fields validation

                db.paragraphs('input').each(function(){
                    if(!$(this).val()){
                        valid = false;
                        $(this).effect({effect: 'highlight', complete: function(){
                            $(this).closest('.paragraph').paragraph('menu', 'edit');
                        }});
                        db.console.console('log', 'Нельзя сохранить пункт без номера', 0);
                        db.form.form('release', 'form').form('release', 'service');
                        cursor_release();
                        return false;
                    }

                });
                if (!valid) return false;

                invalid_paragraphs = [];

                // validate term fields for correctness
                msg = 'Нельзя сохранить протокол: неправильно установлен' + '[Срок]'.emphasize('danger') + '. Пункты: ';
                db.paragraphs('input').each(function(i, val){
                    var name = $(this).val();
                    var term = db.paragraphs('text', name, 'term').val();
                    var parts = term.split('.');
                    if (term.length != 0 && (parts.length != 3 || parts[0].length != 2 || parts[1].length != 2 || parts[2].length != 4)) {
                        valid = false;
                        invalid_paragraphs.push(name);
                        msg += name.consoleParagraph();
                    }

                });

                if (!valid) {
                    msg += 'Формат даты: [ ДД . ММ . ГГГГ ]'.emphasize('info');
                    db.console.console('log', msg, 0);
                    onClickAfterFormError();
                    return false;
                }


//************************** end of fields validation

                db.paragraphs().each(function(){
                    a = $(this).find('[data-toggle = "tab"]');
                    paragraph = a.find('.ajax-data').val();
                    fields = $(a.attr('data-target')).find('.ajax-data');

                    request_data.data[paragraph] = {};

                    fields.not('[name = "term"]').each(function(){
                        request_data.data[paragraph][$(this).attr('name')] = $(this).val();
                    });
                    request_data.data[paragraph]['term'] = fields.filter('[name = "term"]').val().convertDate();
                });

                $.request('save', request_data).then(function(){
                    return $.request('get_stats', {id: current_protocol.id, year: current_protocol.year})
                }).then(function(){
                    console.log($DATA.save);
                    console.log($DATA.stats);
                    if($DATA.save){
                        db.console.console('stats', $DATA.stats).console('log', 'Данные успешно сохранены. Протокол' + ('[' + $DATA.units[current_permission.id].unit_name + ' ППР-' + current_permission.year + ']').emphasize('info'), 1);
                        db.form.form('release', 'form').form('release', 'service');

                        cursor_release();

                    }

                });

            }

        },
        archive: function(){

            cursor_hold();
            var current_protocol = this.data('current_protocol');
            var request_data = {
                id: current_protocol.id,
                year: current_protocol.year
            };
            var unit_name = $DATA.form_data.unit_name;
            $.request('archive', request_data).then(function(){
                return $.request('get_protocols');
            }).then(function(){
                return $.request('get_form_data', 'first')
            }).then(function(){
                db.list.list('refresh', 'archive');
                if($DATA.form_data === false){
                    hold();
                    db.console.console('stats', 'hide');
                    db.pad_toggle.detach();
                    db.pad.pad('fix', true).pad('show');
                    db.form.data('elements').header.html('<h3 class = "database-header user-select-none empty-data-message-header">Протокол не загружен</h3>');
                    $.each(db.form.data('elements').service, function(i, val){
                        val.prop('disabled', true);
                    });
                    db.paragraphs().paragraph('empty').paragraph('select', 'empty');
                    release();
                    cursor_release();
                    db.console.console('log', 'Протокол' + ('[' + unit_name + ' ППР-' + current_protocol.year + ']').emphasize('info') + 'снят с учета', 1);
                    return false;
                }
                db.console.console('log', 'Протокол' + ('[' + unit_name + ' ППР-' + current_protocol.year + ']').emphasize('info') + 'снят с учета', 1);
                db.list.list('load');
                cursor_release();

            });

        }

    };

    $.fn.form = function(method, request){

        if(!this.is('#protocol-form-wrap')){
            $.error( 'Плагин jQuery.form нужно применять на элемент #protocol-form-wrap' );
        }

        if ( methods[method] ) {
            if( method == 'request'){
                return methods[ method ][ request ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            }
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод "' +  method + '" не найден в плагине jQuery.form' );
        }
    };

})(jQuery);

// P A R A G R A P H  M E N U

(function($){

    var options;

    var methods = {
        init: function(){
            var $this = this;
            this.data({
                init: true,
                shown: false,
                edit: false,
                elements: {
                    edit: this.find('.paragraph-menu-edit'),
                    remove: this.find('.paragraph-menu-remove'),
                    insert_below: this.find('.paragraph-menu-insert-below'),
                    insert_above: this.find('.paragraph-menu-insert-above')
                }
            });

            var elements = this.data('elements');

            $(document).on('contextmenu', '.paragraph', function(){
                event.preventDefault();
                if($this.data('edit')){
                    console.log('Paragraph-menu will not be invoked on paragraph which is being edited.');
                    return false;
                }
                $this.data('triggered', $(this));
                $this.paragraphmenu('open');

            }).on('click.paragraphmenu.edit', elements.edit.selector, function(){
                db.paragraphs().paragraph('edit', true);
                $(document).one('focusout.paragraph.edit', db.paragraphs('input').selector, function(){
                    db.paragraphs().paragraph('edit', false).paragraph('save');
                });
            }).on('keydown', db.paragraphs('input').selector, function(){
                if(event.ctrlKey && event.keyCode === 13){
                    $($(this).closest('[data-toggle = "tab"]').attr('data-target')).find('[name = "content"]').focus();
                }
            }).on('click.paragraphmenu.remove', elements.remove.selector, function(){
                confirmAction('Удалить пункт?', 'Пункт будет удален и все данные полей этого пункта будут утеряны.</br>Вы действительно хотите удалить этот пункт?')
                    .then(function(data){
                       if(data){
                           db.paragraphs().paragraph('remove');
                       }
                    });

            }).on('click.paragraphmenu.insert_below', elements.insert_below.selector, function(){
                db.paragraphs().paragraph('insert', 'below');
            }).on('click.paragraphmenu.insert_above', elements.insert_above.selector, function(){
                db.paragraphs().paragraph('insert', 'above');
            }).on('scroll.paragraphmenu', function(){
                $this.paragraphmenu('close');
            });

            db.form.data('elements').paragraphs_container().on('scroll', function(){$this.paragraphmenu('close')});

            return this;
        },
        open: function(){
            var $this = this;
            function reposition(){
                $this.css({
                    top: event.pageY - document.body.scrollTop,
                    left: event.pageX - document.body.scrollLeft
                });
            }
            reposition();
            this.show();
            $(document).on('click.paragraphmenu.click', function(){
                $this.paragraphmenu('close');
            });
            return this;
        },
        close: function(){
            this.hide();
            $(document).off('click.paragraphmenu.click');
            return this;
        }
    };

    $.fn.paragraphmenu = function(method, request){

        if(!this.is('.paragraph-menu')){
            $.error( 'Плагин jQuery.paragraph-menu нужно применять на элемент класса paragraph-menu' );
        }

        if ( methods[method] ) {
            if( method == 'request'){
                return methods[ method ][ request ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            }
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод "' +  method + '" не найден в плагине jQuery.paragraphmenu' );
        }
    };

})(jQuery);

// P A R A G R A P H

(function($){

    var options;

    var methods = {
        init: function(){
            this.data({
                init: true
            });

            var $this = this;

            $(document).on('click.paragraph focusin.paragraph', db.paragraphs().selector, function(){

                $(this).find('a').tab('show');

            }).on('click.emptyparagraph', db.paragraphs('empty').selector, function(){
                $(this).find('a').tab('show');

            }).on('keypress.paragraph', db.paragraphs('input').selector, function(){

                var range = [46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
                if($.inArray(event.keyCode, range) == -1){
                    return false;
                }

            }).on('show.bs.tab', db.paragraphs('empty', 'tab').selector, function(e){

                db.form.data('elements').paragraphs_container().addClass('paragraphs-container-bg-empty');
            }).on('hide.bs.tab', db.paragraphs('empty', 'tab').selector, function(e){

                db.form.data('elements').paragraphs_container().removeClass('paragraphs-container-bg-empty');
            });

            return this;
        },
        select: function(which){ // select returns single elements not .paragraph collection

            if(which === undefined) return this.trigger('click.paragraph');
            if(which == 'empty') return this.trigger('click.emptyparagraph');

        },
        edit: function(param1, param2){
            var input;
            if(param2 == 'all'){
                input = this.find('input');
            } else {
                input = db.paragraphmenu.data('triggered').find('input');
            }

            input.prop('readonly', function(){
                return !param1;
            });
            if(param1){
                this.data('paragraph_under_edit_val', input.val());
                input.focus();
                db.paragraphmenu.data('edit', true);
            } else {
                $(document).off('focusout.paragraph.edit');
                db.paragraphmenu.data('edit', false);
            }


            return this;
        },
        save: function(){
            cursor_hold();
            var $this = this;
            var input = db.paragraphmenu.data('triggered').find('.ajax-data');
            var current_protocol = db.form.data('current_protocol');
            var id = current_protocol.id;
            var year = current_protocol.year;
            var current_val = trim_paragraph(this.data('paragraph_under_edit_val'));
            var new_val = trim_paragraph(input.val());

            if(new_val == current_val){
                input.val(current_val);
                cursor_release();
                return false;
            }

            var request_data = {
                'current': current_val,
                'new': new_val,
                'year': year,
                'id': id
            };

            $.request('save_paragraph', request_data).then(function(){
                console.log($DATA.save_paragraph);
                return $.request('get_stats', {id: id, year: year});

            }).done(function(data){

                if($DATA.save_paragraph === true){

                    var li = db.paragraphmenu.data('triggered');
                    var tabpanel = $(li.find('a').attr('data-target'));
                    li.find('.ajax-data[name = "term"]').datepicker('destroy');
                    var new_li = li.clone();
                    new_li.find('.ajax-data[name = "term"]').datepicker(datepicker_options);
                    var new_tabpanel = tabpanel.clone();
                    var r = paragraphTextToAttr(new_val);
                    new_li.find('a').attr({'aria-controls': r.aria_controls, 'data-target': r.data_target}).find('input').text(new_val);
                    new_tabpanel.attr('id', r.id);
                    li.replaceWith(new_li);
                    tabpanel.replaceWith(new_tabpanel);

                    db.console.console('stats', $DATA.stats);

                } else {
                    input.val(current_val);
                    db.console.console('log', $DATA.save_paragraph, 0);

                }

                cursor_release();
                return $this;

            });
        },
        remove: function(){
            cursor_hold();
            var paragraph = db.paragraphmenu.data('triggered');
            var to_be_selected = paragraph.next().add(paragraph.prev()).not('.paragraph-empty').last();

            var request_data = {
                'id': db.form.data('current_protocol').id,
                'year': db.form.data('current_protocol').year,
                'paragraph': trim_paragraph(paragraph.find('input').val())
            };

            if(request_data.paragraph.length == 0){
                console.log('Cannot remove empty paragraph.');
                db.console.console('log', 'Нельзя удалить пустой пункт', 0);
                cursor_release();
                return false;
            }

            $.request('remove_paragraph', request_data)
                .then(function(){
                    return $.request('get_stats', request_data);
                })

                .then(function(){
                    if($DATA.remove_paragraph){
                        paragraph.add(paragraph.find('[data-toggle = "tab"]').attr('data-target')).remove();
                        if(db.paragraphs().length == 0){
                            var elements = db.form.data('elements');
                            var paragrahps_container = elements.paragraphs_container();
                            var contents_container = elements.contents_container();
                            paragrahps_container.append($DATA.form_templates.paragraph);
                            contents_container.append($DATA.form_templates.content);
                            db.console.console('stats', $DATA.stats);
                            db.form.data('elements').service.filter_button.find('option[value = "3"]').prop('selected', true);
                            db.form.data('elements').service.filter_button.trigger('change');
                            db.paragraphs().paragraph().paragraph('menu', 'edit');
                            cursor_release();
                            return false;
                        }
                        db.console.console('stats', $DATA.stats);
                        to_be_selected.paragraph('select');
                        cursor_release();
                        return false;
                    }
                    cursor_release();
                    return false;

            });
        },
        insert: function(where){

            cursor_hold();

            if(empty_paragraph_exists(this)){
                console.log('Can not add paragraph until empty one exists.');
                db.console.console('log', 'Ошибка. Нельзя добавить пункт, если есть с пустым названием', 0);
                cursor_release();
                return false;
            }
            var triggered_paragraph = db.paragraphmenu.data('triggered');
            var triggered_content = $(triggered_paragraph.find('a').attr('data-target'));
            var paragraph = $($DATA.form_templates.paragraph);
            var content = $($DATA.form_templates.content);

            if(where == 'above'){
                triggered_paragraph.before(paragraph);
                triggered_content.before(content);
            }

            if(where == 'below'){
                triggered_paragraph.after(paragraph);
                triggered_content.after(content);
            }

            db.paragraphs('term').datepicker(datepicker_options);

            paragraph.paragraph('select').paragraph('menu', 'edit');

            cursor_release();

            return this;
        },
        empty: function(){
            var elements = db.form.data('elements');
            elements.paragraphs_container().html($DATA.form_templates.paragraph_empty);
            elements.contents_container().html($DATA.form_templates.content_empty);

            return db.paragraphs('empty').paragraph();
        },
        menu: function(trigger){ // menu returns single elements not .paragraph collection

            var elements = db.paragraphmenu.data('elements');
            db.paragraphmenu.data('triggered', this);

            if(trigger == 'edit'){
                elements.edit.trigger('click.paragraphmenu.edit');
            }
            if(trigger == 'delete'){
                elements.delete.trigger('click.paragraphmenu.delete');
            }
            if(trigger == 'insert-below'){
                elements.insert_below.trigger('click.paragraphmenu.insert_below');
            }
            if(trigger == 'insert-above'){
                elements.insert_above.trigger('click.paragraphmenu.insert_above');
            }

            return this;

        }
    };

    function requi(par){
        var string = 'par_' + par.replace(/\.+/g, '_');

        return {
            'id': string,
            'aria_controls': string,
            'data_target': '#' + string
        }
    }

    function empty_paragraph_exists(paragraphs){

        var result = false;

        paragraphs.find('.ajax-data').each(function(){

            if($(this).val().length == 0){
                result = true;
                return false;
            }
        });

        return result;
    }

    $.fn.paragraph = function(method, request){

        if(!this.is('.paragraph') && !(this.is('.paragraph-empty') && (method == 'select' || !method)) && method != 'empty'){
            $.error( 'Плагин jQuery.paragraph нужно применять на элемент класса paragraph' );
        }

        if ( methods[method] ) {

            if( method == 'request'){
                return methods[ method ][ request ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            }
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод "' +  method + '" не найден в плагине jQuery.paragraph' );
        }
    };

})(jQuery);

$('#protocol-upload').on('click', function(){
    event.preventDefault();
    event.stopPropagation();
    $(this).siblings('[type = "file"]').trigger('click');
});

$('.upload-form').on('submit', function(){
    var current_protocol = db.form.data('current_protocol');
    $(this).attr('action', $(this).attr('action') + '&' + $.param({'id': current_protocol.id, 'year': current_protocol.year})) ;
});

$('[type = "file"]').on('change', function(){
    $('.upload-form').trigger('submit');
});

$.when(
        $.request('get_defaults'),
        $.request('get_protocols'),
        $.request('get_units'),
        $.request('get_form_data', 'first'),
        $.request('get_list'),
        $.request('get_form_templates')
    )
    .then(function(){

        console.log($DATA);
        db.pad.pad();

        db.form.form();

        db.console.console();

        db.paragraphmenu.paragraphmenu();

        if($DATA.form_data === false){

            db.console.console('stats', 'hide');

            db.pad_toggle.detach();

            db.form.data('elements').header.append('<h3 class = "database-header user-select-none empty-data-message-header">Протокол не загружен</h3>');
            $.each(db.form.data('elements').service, function(i, val){
                val.prop('disabled', true);
            });

            db.pad.pad('fix', true).pad('show');

            db.paragraphs().paragraph('empty').paragraph('select', 'empty');

            release();


        } else {

            db.list.list();

            release();

            db.list.list('open', $DATA.form_data.year);

            db.list.list('load');

        }
    });

