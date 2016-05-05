function changeCheckboxUnit(button, npp, checkbox, check){ //check - boolean: true - show, false - hide; npp - button 'АЭС', checkbox - boolean: checkbox alone
    if(checkbox){
        var target_selector = button.attr('toggle-aria');
        button.prop('checked', function(i, val){
            if(val){
                $(target_selector).removeClass('hidden');
            } else {
                $(target_selector).addClass('hidden');
            }
        });

    } else {
        var target_class = '.' + button.attr('class').split(' ')[0];
        if(npp){
            var text = button.text();
            if (event.ctrlKey) {
                $(target_class).not('.check-by-npp, .checkall, .uncheckall, input[type = "radio"]').prop("checked", !check);
            }
            $('.report-menu-unit-title:contains("' + text + '")').siblings('input[type = "checkbox"][class *= "checkbox-unit"]').prop("checked", check);
        } else {
            $(target_class).not('.check-by-npp, .checkall, .uncheckall, input[type = "radio"]').prop("checked", check);
        }
        $(target_class).not('.check-by-npp, .checkall, .uncheckall, input[type = "radio"]').each(function(){
            var target_select_id = $(this).attr('toggle-aria');
            $(this).prop('checked', function(i, val){
                if(val){
                    $(target_select_id).removeClass('hidden');
                } else {
                    $(target_select_id).addClass('hidden');
                }
            });
        });

        if(button.hasClass('report-menu-pm')){
            if(button.hasClass('checkall')){
                $('div.checkbox-pm').each(function(){
                    $(this).find('input.checkbox-pm-unit').prop('checked', true);
                    $(this).find('div.report-menu-pm-unit-drop').find('label.pm-units-select').trigger('click');
                });
            }

            if(button.hasClass('uncheckall')){
                $('div.checkbox-pm').each(function(){
                    $(this).find('input.checkbox-pm-unit').prop('checked', false);
                    var tip = $(this).find('label.label-tip');
                    if(!tip.hasClass('hidden')){
                        tip.addClass('hidden');
                    }
                });
            }
        }
    }
}

$(document).ready(function(){

    $('#report-menu table td:has(.report-menu-unit)').css('width', '155px');
//    $('#report-menu table div.checkbox-pm').css('width', '155px');
//    $('#report-menu table td:has(div.checkbox-pm)').css('width', '155px');
    $('#report-menu input[name = "report-term"]').datepicker({dateFormat: "dd-mm-yy"});

    $(this).on('click', '#report-menu .uncheckall', function(){
        changeCheckboxUnit($(this), false, false, false);
    });


    $(this).on('click', '#report-menu .checkall', function(){
        if ( $(this).hasClass('report-menu-condition') ){
            changeCheckboxUnit($(this), false, false, true);
            return false;
        }
        var radio_class = $(this).attr('radio-class');
        if ($('input.'+radio_class+'[type = "radio"]').prop('checked') ){
            changeCheckboxUnit($(this), false, false, true);
        }
    });


    $(this).on('click', '#report-menu .check-by-npp', function(){
        var radio_class = $(this).attr('radio-class');
        if ($('input.'+radio_class+'[type = "radio"]').prop('checked')){
            changeCheckboxUnit($(this), true, false, true);
        }
    });


    $(this).on('change', 'input.checkbox-unit', function(){
        changeCheckboxUnit($(this), true, true, true);
    });


    $(this).on('change', 'input.checkbox-pm', function(){
        var target_drop = $($(this).attr('toggle-aria'));
        var tip = $(this).closest('label').siblings('label.label-tip');
        $(this).prop('checked', function(i, val){
            if(val){
                if(target_drop.hasClass('hidden')){
                    target_drop.removeClass('hidden');
                }

            } else {
                if(!target_drop.hasClass('hidden')){
                    target_drop.addClass('hidden');
                }
                if(!tip.hasClass('hidden')){
                    tip.addClass('hidden');
                }

            }
        });
    });


    $(this).on('click', 'label.pm-units-select', function(){
        var target_drop = $($(this).attr('toggle-aria'));
        var checked = false;
        target_drop.find('input.checkbox-pm-unit').each(function(){
            if($(this).prop('checked')){
                checked = true;
            }
        });

        if(!checked){
            return false;
        }

        if(!target_drop.hasClass('hidden')){
            target_drop.addClass('hidden');
        }

        if(target_drop.siblings('.label-tip').hasClass('hidden')){
            target_drop.siblings('.label-tip').removeClass('hidden');
        }
    });


    $(this).on('click', 'label.pm-units-cancel', function(){
        var target_drop = $($(this).attr('toggle-aria'));
        var toggle_aria = $(this).attr('toggle-aria');
        if(!target_drop.hasClass('hidden')){
            target_drop
                .addClass('hidden')
                .find('input.checkbox-pm-unit').prop('checked', false);
        }
        if(!target_drop.siblings('.label-tip').hasClass('hidden')){
            target_drop.siblings('.label-tip').addClass('hidden');
        }
        $('input[type = "checkbox"][toggle-aria = "' + toggle_aria + '"]').prop('checked', false);
    });


    $(this).on('change', 'input.checkbox-pm', function(){
        var pm_checkbox = $(this);
        var pm_unit_checkbox_container_id = $(this).attr('toggle-aria');
        $(pm_unit_checkbox_container_id + ' input.checkbox-pm-unit').prop('checked', function(){
             if(!(pm_checkbox).prop('checked')){
                 return false;
             }
        });

    });


    $(this).on('mousedown', '#report-menu input[name = "report-term"]', function(){

        $('.report-menu-condition-term').prop('checked', function(i, val){
            if(!$('.report-menu-condition-term').prop('checked')){
                return !val;
            }
        });
    });


    $(this).on('click', '#report-menu label:has(.report-menu-condition-term)', function(){

        if($('#report-menu input[name = "report-term"]').prop('readonly')){
            $(this).find('input[name = "report-term"]').focus();
        }
        $('#report-menu .report-menu-condition-term').prop('checked', function(i, val){
           $('#report-menu input[name = "report-term"]').prop('readonly', function(i1, val1){
               if(!val){
                   $(this).val(today);
               }
               return !val;
           });
        });
    });


    $(this).on('change', 'input[type = "radio"][name = "report_option"]', function(){
        $('#report-option-NPP, #report-option-PM').prop('checked', function(i, val){

            var radio = $(this);
            var aria_controls = $(this).attr('aria-controls');
            var target_selector = '.' + aria_controls;

            $('input'+target_selector+',select'+target_selector).prop(
                {
                    'disabled': !val,
                    'checked': function(){
                        if(!radio.prop('checked')){
                            return false;
                        }
                    }
                }
            );

            $('select'+target_selector).prop('class', function(){
                var this_class = $(this).attr('class').replace('hidden', '');
                if(!radio.prop('checked')){
                    return this_class + ' hidden';
                }
            });

            if(!$('#report-option-PM').prop('checked')){
                $('label.pm-units-cancel').trigger('click');

            }

            $('input.checkbox-pm-unit').prop('checked', function(){
                if(!$('#report-option-PM').prop('checked')){
                    return false;
                }
            });
        });


    });


    $(this).on('mouseenter mouseleave', 'label.label-tip', function(){
        var target_drop = $($(this).attr('toggle-aria'));
        if(event.type == 'mouseover'){
            if(target_drop.hasClass('hidden')){
                target_drop.find('label.pm-units-cancel, label.pm-units-select').addClass('hidden');
                target_drop.removeClass('hidden');
            }
        }

        if(event.type == 'mouseout'){
            if(!target_drop.hasClass('hidden')){
                target_drop.addClass('hidden');
                target_drop.find('label.pm-units-cancel, label.pm-units-select').removeClass('hidden');
            }
        }
    });


    $(this).on('click', '#all-generate', function(){

        var data = {
            'selected': {},
            'exec-params': [],
            'flag': ''
        };

        var validate_selected = $('input.checkbox-unit:checked, input.checkbox-pm:checked').length > 0;
        var validate_exec = $('input.report-menu-condition:checked').length > 0;
        var all_drops_closed = true;

        $('div.report-menu-pm-unit-drop').each(function(){
            if(!$(this).hasClass('hidden')){
                all_drops_closed = false;
                return false;
            }
        });

        if(!validate_exec){
            $('input.report-menu-condition').each(function(){
                data['exec-params'].push($(this).attr('execstate'));
            });
        }


        if(!validate_selected || !all_drops_closed){
            return false;
        }

        if($('#report-option-NPP').prop('checked')){
            $('input.checkbox-unit:checked').each(function(){
                data['selected'][String($(this).attr('unit-id'))] = $(this).siblings('select.checkbox-unit').val();
            });
            data['flag'] = 'npp';
        }

        if($('#report-option-PM').prop('checked')){
            $('input.checkbox-pm:checked').each(function(){
                var pm = $(this).siblings('span.report-menu-pm-title').text();
                data['selected'][String(pm)] = [];
                $(this).closest('div.checkbox-pm').find('div.report-menu-pm-unit-drop').find('input.checkbox-pm-unit:checked').each(function(){
                    data['selected'][String(pm)].push($(this).attr('unit-id'));
                });
            });
            data['flag'] = 'pm';
        }

        $('input.report-menu-condition:checked').each(function(){
            data['exec-params'].push($(this).attr('execstate'));
        });
        if($('input.report-menu-condition-term').prop('checked')){
            data['term-params'] = $('#report-menu input[name = "report-term"]').val();
        }

        var params = $.param(data);
        var url = '/reports/createdoc/' + params;
        location.replace(url);
    });


});