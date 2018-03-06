function libraryHelper(type, container) {
    this.container = container;
    this.library_list = {};
    this.library_permissions = {};
    // Variables to link the view with the controller
    this.type = type;
    this.library_id = 0;
    this.library_names = {}; // I know this should not be here :p
    //this.library_html_strings ={};

    this.init();
    this.append_modals();
    this.add_events();
    //$('#modal-share-library').modal('show');


}

//  //if ($('#library-select').val() != undefined) Needs to be removed from every function where it appears. Ensure we always pass the library id

/***********************************
 * Methods called in the constructor
 ***********************************/

libraryHelper.prototype.init = function () {
    this.load_user_libraries(); // Populates this.library_list
    this.get_library_permissions(); // Populates this.library_permissions
    this.library_names = {
        'elements': 'Fabric elements',
        'systems': 'Energy systems',
        'elements_measures': 'Fabric elements measures',
        'draught_proofing_measures': 'Draught proofing measures',
        'ventilation_systems_measures': 'Ventilation system measures',
        'ventilation_systems': 'Ventilation systems',
        'extract_ventilation_points': 'Extract ventilation points',
        //'extract_ventilation_points_measures': 'Extract ventilation points measures',
        'intentional_vents_and_flues': 'Intentional vents and flues',
        'intentional_vents_and_flues_measures': 'Intentional vents and flues measures',
        'water_usage': 'Water usage',
        'storage_type': 'Type of storages',
        'storage_type_measures': 'Type of storage measure',
        'appliances_and_cooking': 'Appliances and Cooking',
        'heating_control': "Heating controls",
        'heating_systems': "Heating systems",
        'heating_systems_measures': "Heating systems mesaures",
        'pipework_insulation': "Pipework insulation measures",
        'hot_water_control_type': "Storage control types",
        space_heating_control_type: 'Space heating control types',
        'clothes_drying_facilities': "Clothes drying facilities",
        'generation_measures': 'Generation measures'
    };
};
libraryHelper.prototype.add_events = function () {
    var myself = this;
    this.container.on('click', '.add-from-lib', function () {
        myself.init(); // Reload the lobrary before we display it
        myself.onAddItemFromLib($(this));
    });
    this.container.on('click', '#open-share-library', function () {
        myself.onOpenShareLib($(this).attr('library-id'));
    });
    this.container.on('click', "#share-library", function () {
        var library = null;
        if ($(this).attr('library-id') != '')
            library_id = $(this).attr('library-id');
        myself.onShareLib(library_id);
    });
    this.container.on('click', '.remove-user', function () {
        myself.onRemoveUserFromSharedLib($(this).attr('username'), $(this).attr('library-id'));
    });
    this.container.on('change', '#library-select', function () {
        myself.onSelectingLibraryToShow($(this));
    });
    this.container.on('change', "[name='empty_or_copy_library']", function () {
        myself.onChangeEmptyOrCopyLibrary();
    });
    this.container.on('click', '#newlibrary', function () {
        myself.onCreateNewLibrary();
    });
    this.container.on('click', '.use-from-lib', function () {
        $('.modal').modal('hide');
    });
    this.container.on('click', '#create-in-library', function () {
        library_id = $(this).attr('library-id');
        myself.onCreateInLibrary(library_id);
    });
    this.container.on('click', '#create-in-library-ok', function () {
        library_id = $(this).attr('library-id');
        myself.onCreateInLibraryOk(library_id);
    });
    this.container.on('change', "[name=empty_or_copy_item]", function () {
        myself.onChangeEmptyOrCopyItem();
    });
    this.container.on('change', "#origin-library-select", function () {
        myself.onChangeOriginLibrarySelect();
    });
    this.container.on('change', '#item-to-copy-select', function () {
        myself.onChangeItemToCopySelect();
    });
    this.container.on('click', '.edit-library-item', function () {
        myself.onEditLibraryItem($(this));
    });
    this.container.on('click', '.edit-library-item-ok', function () {
        var library_id = null;
        if ($(this).attr('library-id') != '')
            library_id = $(this).attr('library-id');
        myself.onEditLibraryItemOk(library_id);
    });
    this.container.on('click', '.edit-item', function () {
        // myself.onEditItem($(this));
        myself.init(); // Reload the lobrary before we display it
        myself.onAddItemFromLib($(this));
    });
    this.container.on('click', '.edit-item-ok', function () {
        myself.onEditItemOk();
    });
    this.container.on('click', '.apply-measure', function () {
        myself.onApplyMeasure($(this));
    });
    this.container.on('click', '#apply-measure-ok', function () {
        myself.onApplyMeasureOk($(this));
    });
    this.container.on('change', '[name=radio-type-of-measure]', function () {
        myself.onChangeApplyMeasureWhatToDo();
    });
    this.container.on('change', '#replace-from-lib', function () {
        myself.onChangeApplyMeasureReplaceFromLib($(this).attr('library_type')); // This one to populate the select for items();
    });
    this.container.on('change', '#replace-from-lib-items', function () {
        myself.onChangeApplyMeasureReplaceFromLibItem($(this).attr('library_type'));
    });
    this.container.on('change', '#modal-create-in-library .create-element-type', function () {
        myself.onChangeTypeOnCreateElementLibItem();
    });
    this.container.on('click', '.edit-library-name', function () {
        myself.onEditLibraryName($(this));
    });
    this.container.on('click', '#edit-library-name-ok', function () {
        myself.onEditLibraryNameOk();
    });
    this.container.on('click', '.show-items', function () {
        myself.init(); // Reload the lobrary before we display it
        myself.onShowLibraryItems($(this).attr('library-id'));
    });
    this.container.on('click', '.show-items-edit-mode', function () {
        myself.init(); // Reload the lobrary before we display it
        myself.onShowLibraryItemsEditMode($(this).attr('library-id'));
    });
    this.container.on('change', '#show-library-items-modal .element-type select', function () {
        myself.onChangeTypeOfElementsToShow($(this));
    });
    this.container.on('click', '#create-in-library-finish', function () {
        $('#modal-create-in-library').modal('hide');
        $('#modal-create-in-library .new-item-in-library').html('');
        $('#modal-create-in-library #create-in-library-message').html('');
        myself.show_temporally_hidden_modals();
    });

    this.container.on('click', '.manage-users', function () {
        myself.init(); // Reload the lobrary before we display it
        myself.onOpenShareLib($(this).attr('library-id'));
    });
    this.container.on('click', '.create-new-library', function () {
        myself.type = $(this).attr('library-type');
        myself.onNewLibraryOption();
    });
    this.container.on('click', '.delete-library', function () {
        myself.onDeleteLibrary($(this).attr('library-id'));
    });
    this.container.on('click', '#delete-library-ok', function () {
        myself.onDeleteLibraryOk($(this).attr('library-id'));
    });
    this.container.on('click', '.add-item', function () {
        myself.init(); // Reload the lobrary before we display it
        var library_id = $(this).attr('library-id');
        myself.type = myself.get_library_by_id(library_id).type;
        myself.onCreateInLibrary(library_id);
    });
    this.container.on('click', '.delete-library-item', function () {
        $('#delete-library-item-ok').attr('library-id', $(this).attr('library'));
        $('#delete-library-item-ok').attr('tag', $(this).attr('tag'));
        $('#confirm-delete-library-item-modal .message').html("");
        myself.hide_modals_temporaly();
        $('#confirm-delete-library-item-modal').modal('show');
    });
    this.container.on('click', '#confirm-delete-library-item-modal #delete-library-item-ok', function () {
        myself.delete_library_item($(this).attr('library-id'), $(this).attr('tag'));
        myself.show_temporally_hidden_modals();
    });
    this.container.on('change', '.item-ventilation_type', function () {
        var newVS = $('.item-ventilation_type').val();
        if (newVS == 'DEV' || newVS == 'MEV' || newVS == 'MV' || newVS == 'MVHR')
        {
            $('.item-air_change_rate').parent().parent().show('fast');
            $('.item-specific_fan_power').parent().parent().show('fast');
        }
        else {
            $('.item-air_change_rate').parent().parent().hide('fast');
            $('.item-air_change_rate').val(0);
            $('.item-specific_fan_power').parent().parent().hide('fast');
            $('.item-specific_fan_power').val(0);
        }
        if (newVS == 'MVHR')
            $('.item-heat_recovery_efficiency').parent().parent().show('fast');
        else {
            $('.item-heat_recovery_efficiency').parent().parent().hide('fast');
            $('.item-heat_recovery_efficiency').val(0);
        }
        if (newVS == 'NV' || newVS == 'IE' || newVS == 'PS') {
            $('.item-intermitent_fans').parent().parent().show('fast');
            $('.item-passive_vents').parent().parent().show('fast');
        }
        else {
            $('.item-intermitent_fans').parent().parent().hide('fast');
            $('.item-passive_vents').parent().parent().hide('fast');
            $('.item-intermitent_fans').val(0);
            $('.item-passive_vents').val(0);
        }
    });
    this.container.on('change', '.item-declared_loss_factor_known', function () {
        var a = $(this).prop("checked");
        if ($(this).prop('checked') === true) {
            $('.if-declared-loss-factor').show('slow');
            $('.if-not-declared-loss-factor').hide('slow');
        }
        else {
            $('.if-declared-loss-factor').hide('slow');
            $('.if-not-declared-loss-factor').show('slow');
        }
    });
    this.container.on('change', '.heating_systems.item-category', function () {
        if ($('.item-category').val() != 'Warm air systems') {
            $('.item-fans_and_supply_pumps').parent().parent().show();
            $('.item-sfp').parent().parent().hide();
        }
        else {
            $('.item-fans_and_supply_pumps').parent().parent().hide();
            $('.item-sfp').parent().parent().show();
        }
    });
    this.container.on('click', '#show-library-modal-edit-mode #save', function () {
        var library_id = $(this).attr('library-id');
        myself.onSaveLibraryEditMode('#show-library-modal-edit-mode', library_id);
    });
};
libraryHelper.prototype.append_modals = function () {
    var html;
    var myself = this;
    $.ajax({url: path + "Modules/assessment/js/library-helper/library-helper.html", datatype: "json", success: function (result) {
            html = result;
            myself.container.append(html);
        }});
};
/************************************
 * Events methods
 *************************************/
libraryHelper.prototype.onAddItemFromLib = function (origin) {
    // Check if the user has a library of this type and if not create it. THIS HAS BEEN IMPLEMENTED IN projects.php
    /* if (this.library_list[this.type] === undefined) {
     this.library_list[this.type] = [];
     var library_name = "StandardLibrary - " + p.author;
     var myself = this;
     $.ajax({url: path + "assessment/newlibrary.json", data: "name=" + library_name + '&type=' + myself.type, datatype: "json", async: false, success: function (result) {
     library_id = result;
     myself.library_list[myself.type] = [{id: library_id, name: library_name, type: myself.type, data: standard_library[myself.type]}];
     myself.library_permissions[library_id] = {write: 1};
     $.ajax({type: "POST", url: path + "assessment/savelibrary.json", data: "id=" + library_id + "&data=" + JSON.stringify(standard_library[myself.type]), success: function (result) {
     console.log("save library result: " + result);
     }});
     }});
     }*/
    this.populate_library_modal(origin);
    $("#show-library-modal").modal('show');
};
libraryHelper.prototype.onOpenShareLib = function (selected_library) {
    //if ($('#library-select').val() != undefined)
    //selected_library = $('#library-select').val();
    this.display_library_users(selected_library);
    $('#modal-share-library #share-library').attr('library-id', selected_library);
    $('.modal').modal('hide');
    $('#modal-share-library').modal('show');
};
libraryHelper.prototype.onShareLib = function (selected_library) {
    $('#return-message').html('');
    var username = $("#sharename").val();
    var write_permissions = $('#write_permissions').is(":checked");
    //if ($('#library-select').val() != undefined)
    //selected_library = $('#library-select').val();
    var myself = this;
    if (selected_library != -1) {
        $.ajax({
            url: path + "assessment/sharelibrary.json",
            data: "id=" + selected_library + "&name=" + username + "&write_permissions=" + write_permissions,
            success: function (data) {
                $('#return-message').html(data);
                myself.display_library_users(selected_library);
            }});
    }
};
libraryHelper.prototype.onEditLibraryName = function (original_element) {
    console.log(original_element);
    $('#edit-library-name-modal #new-library-name').attr('placeholder', original_element.attr('library-name'));
    $('#edit-library-name-modal #edit-library-name-ok').attr('library-id', original_element.attr('library-id'));
    $('#edit-library-name-modal').modal('show');
};
libraryHelper.prototype.onEditLibraryNameOk = function () {
    var library_id = $('#edit-library-name-modal #edit-library-name-ok').attr('library-id');
    var library_new_name = $('#edit-library-name-modal #new-library-name').val();
    var myself = this;
    this.set_library_name(library_id, library_new_name, function (result) {
        console.log(myself);
        if (result == 1) {
            var library = myself.get_library_by_id(library_id);
            library.name = library_new_name;
            UpdateUI(data);
            $('.modal').modal('hide');
        }
        else
            $('#edit-library-name-modal #message').html('Library name could not be changed: ' + result);
    });
    //this.set_library_name(library_id, library_new_name);
};
libraryHelper.prototype.onRemoveUserFromSharedLib = function (user_to_remove, selected_library) {
    $('#return-message').html('');
    //var selected_library = $('#library-select').val();
    var myself = this;
    $.ajax({url: path + "assessment/removeuserfromsharedlibrary.json", data: 'library_id=' + selected_library + '&user_to_remove=' + user_to_remove, success: function (result) {
            $('#return-message').html(result);
            myself.display_library_users(selected_library);
        }});
};
libraryHelper.prototype.onSelectingLibraryToShow = function (origin) {
    var id = $('#library-select').val();
    if (id == -1)  // id is -1 when choosing "Create new"
        this.onNewLibraryOption();
    else {
        $('#library_table').html('');
        var function_name = this.type + '_library_to_html';
        out = this[function_name](origin, id);
        $("#library_table").html(out);
        $('#create-in-library').attr('library-id', id);
        // Hide/show "share" option according to the permissions
        if (this.library_permissions[id].write == 0)
            $('.if-write').hide('fast');
        else
            $('.if-write').show('fast');
    }
};
libraryHelper.prototype.onNewLibraryOption = function () {
    $('#new-library-modal #new-library-type').html(this.library_names[this.type]);
    $('#create-library-message').html('');
    // Populate the select to choose library to copy
    var out = '';
    this.library_list[this.type].forEach(function (library) {
        out += "<option value=" + library.id + ">" + library.name + "</option>";
    });
    $("#library-to-copy-select").html(out);
    $('#new-library-name').val('New name');
    $(".modal").modal('hide');
    $('#new-library-modal .btn').show('fast');
    $('#new-library-modal #finishcreatelibrary').hide('fast');
    $("#new-library-modal").modal('show');
};
libraryHelper.prototype.onChangeEmptyOrCopyLibrary = function () {
    if ($("input[name=empty_or_copy_library]:checked").val() == 'empty')
        $('#library-to-copy').hide('fast');
    else
        $('#library-to-copy').show('fast');
};
libraryHelper.prototype.onCreateNewLibrary = function () {
    $("#create-library-message").html('');
    var myself = this;
    var callback = function (resultado) {
        if (resultado == '0' || resultado == 0)
            $("#create-library-message").html('Library could not be created');
        if (typeof resultado == 'number') {
            myself.load_user_libraries();
            myself.get_library_permissions();
            $("#create-library-message").html('Library created');
            $('#cancelnewlibrary').hide('fast');
            $('#newlibrary').hide('fast');
            $('#finishcreatelibrary').show('fast');
            UpdateUI(data);
        }
        else
            $("#create-library-message").html(resultado)
    };
    var name = $("#new-library-name").val();
    if (name === '')
        $("#create-library-message").html('User name cannot be empty');
    else {
        console.log("newlibrary:" + name);
        if ($("input[name=empty_or_copy_library]:checked").val() == 'copy') {
            var id = $('#library-to-copy-select').val();
            $.ajax({url: path + "assessment/copylibrary.json", data: "name=" + name + "&id=" + id + "&type=" + this.type, datatype: "json", success: function (result) {
                    callback(result);
                }});
        } else {
            $.ajax({url: path + "assessment/newlibrary.json", data: "name=" + name + "&type=" + this.type, datatype: "json", success: function (result) {
                    callback(result);
                }});
        }
    }
};
libraryHelper.prototype.onCreateInLibrary = function (library_id) {
    $('#modal-create-in-library .modal-header h3').html('Create ' + page);
    $('#modal-create-in-library .btn').show('fast');
    $('#modal-create-in-library #create-in-library-finish').hide('fast');
    // Populate the select to choose library to copy from
    var out = '';
    this.library_list[this.type].forEach(function (library) {
        out += "<option value=" + library.id + ">" + library.name + "</option>";
    });
    $("#origin-library-select").html(out);
    // Populate the select to choose item to copy from
    out = '';
    var selected_library = this.get_library_by_id($('#origin-library-select').val());
    for (item in selected_library.data) {
        out += "<option value=" + item + ">" + item + "</option>";
    }
    $("#item-to-copy-select").html(out);
    // Item fields
    // Call to specific function for the type
    var function_name = this.type + '_item_to_html';
    out = this[function_name]();
    $('.new-item-in-library').html(out);
    // Ensure the tag input is editable
    $('.item-tag').removeAttr("disabled");
    $('.editable-field').removeAttr("disabled");
    this.hide_modals_temporaly();
    $('.modal').modal('hide');
    if (library_id != undefined)
        $('#create-in-library-ok').attr('library-id', library_id);
    // Preselect create empty one
    $('input:radio[name=empty_or_copy_item]').val(['empty']);
    $('#copy-item-from').hide('fast');
    $('#modal-create-in-library').modal('show');
};
libraryHelper.prototype.onCreateInLibraryOk = function (library_id) {
    $("#create-in-library-message").html('');
    //if ($('#library-select').val() != undefined)
    //library_id = $('#library-select').val();
    var selected_library = this.get_library_by_id(library_id);
    var item = {};
    // Call to specific function for the type
    var function_name = this.type + '_get_item_to_save';
    item = this[function_name]();
    // Add item to library and save it
    for (tag in item) {
        if (tag === '')
            $("#create-in-library-message").html("Tag cannot be empty");
        else if (selected_library.data[tag] != undefined)
            $("#create-in-library-message").html("Tag already exist, choose another one");
        else {
            //selected_library.data[tag] = item[tag];
            var item_string = JSON.stringify(item[tag]);
            item_string = item_string.replace(/&/g, 'and');
            $.ajax({type: "POST", url: path + "assessment/additemtolibrary.json", data: "library_id=" + selected_library.id + "&tag=" + tag + "&item=" + item_string, success: function (result) {
                    if (result == true) {
                        $("#create-in-library-message").html("Item added to the library");
                        $('#modal-create-in-library button').hide('fast');
                        $('#create-in-library-finish').show('fast');
                    }
                    else
                        $("#create-in-library-message").html("There were problems saving the library");
                }});
        }
    }
};
libraryHelper.prototype.onChangeEmptyOrCopyItem = function () {
    var out;
    if ($('[name=empty_or_copy_item]:checked').val() == 'empty') {
        var function_name = this.type + '_item_to_html';
        out = this[function_name]();
        $('.new-item-in-library').html(out);
        $('#copy-item-from').hide('fast');
    }
    else {
        $('#copy-item-from').show('fast');
        // Display the item
        var selected_library = this.get_library_by_id($('#origin-library-select').val());
        var selected_item = selected_library.data[$('#item-to-copy-select').val()];
        var function_name = this.type + '_item_to_html';
        out = this[function_name](selected_item);
        $('.new-item-in-library').html(out);
        $('#modal-create-in-library .item-tag').val('New tag')

    }
};
libraryHelper.prototype.onChangeOriginLibrarySelect = function () {
    // Populate the select to choose item to copy from
    var out = '';
    var selected_library = this.get_library_by_id($('#origin-library-select').val());
    for (item in selected_library.data) {
        out += "<option value=" + item + ">" + item + "</option>";
    }
    $("#item-to-copy-select").html(out);
    // Display the item
    var selected_item = selected_library.data[$('#item-to-copy-select').val()];
    var function_name = this.type + '_item_to_html';
    out = this[function_name](selected_item);
    $('.new-item-in-library').html(out);
};
libraryHelper.prototype.onChangeItemToCopySelect = function () {
    var out;
    // Display the item
    var selected_library = this.get_library_by_id($('#origin-library-select').val());
    var selected_item = selected_library.data[$('#item-to-copy-select').val()];
    var function_name = this.type + '_item_to_html';
    out = this[function_name](selected_item, "");
    $('.new-item-in-library').html(out);
    //$('#create-element-type').val(selected_item.tags[0]);

}

libraryHelper.prototype.onEditLibraryItem = function (origin) {
//var selected_library = this.get_library_by_id($('#library-select').val());
    var selected_library = this.get_library_by_id(origin.attr('library'));
    var library_name = selected_library.name;
    $('#library-to-edit-item').html(library_name);
    var tag = origin.attr('tag');
    var item = selected_library.data[tag];
    // Call to specific function for the type
    var function_name = this.type + '_item_to_html';
    var out = this[function_name](item, tag);
    $('#library-to-edit-item').parent().show('fast');
    $('.edit-item-in-library').html(out);
    $('#edit-item-ok').attr('class', "btn edit-library-item-ok");
    $('#edit-item-ok').attr('library-id', selected_library.id);
    $('.item-tag').attr('disabled', 'true');
    $('.editable-field').removeAttr("disabled");
    $("#edit-item-message").html('');
    $('#modal-edit-item button').show('fast');
    $('#edit-item-finish').hide('fast');
    $('.modal').modal('hide');
    $('#modal-edit-item').modal('show');
};
libraryHelper.prototype.onEditLibraryItemOk = function (library_id) {
    $("#edit-item-message").html('');
    //if ($('#library-select').val() != undefined)
    //library_id = $('#library-select').val();
    var selected_library = this.get_library_by_id(library_id);
    var item = {};
    // Call to specific function for the type
    var function_name = this.type + '_get_item_to_save';
    item = this[function_name]();
    for (tag in item) {
        var item_string = JSON.stringify(item[tag]).replace('+', '/plus'); // For a reason i have not been able to find why the character + becomes a carrier return when it is accesed in $_POST in the controller, because of this we escape + with \plus
        item_string = item_string.replace(/&/g, 'and');
        //item[tag].number_of_intermittentfans="\\+2";
        $.ajax({type: "POST", url: path + "assessment/edititeminlibrary.json", data: "library_id=" + selected_library.id + "&tag=" + tag + "&item=" + item_string, success: function (result) {
                if (result == true) {
                    $("#edit-item-message").html("Item edited and library saved");
                    $('#modal-edit-item button').hide('fast');
                    $('#edit-item-finish').show('fast');
                }
                else
                    $("#edit-item-message").html("There were problems saving the library - " + result);
            }});
    }
};

// called from elements.js edit-item on fabric element
libraryHelper.prototype.onEditItem = function (origin) {
    var item = JSON.parse(origin.attr('item'));
    var tag = origin.attr('tag');
    // Call to specific function for the type
    var function_name = this.type + '_item_to_html';
    var out = this[function_name](item, tag); // e.g: function_name: elements_item_to_html
    $('.edit-item-in-library').html(out);
    $('#library-to-edit-item').parent().hide('fast');
    $('.item-tag').attr('disabled', 'true'); // comment to enable change of tag
    $('.editable-field').attr('disabled', 'true'); // comment to enable change of tag
    $('#edit-item-ok').attr('class', "btn edit-item-ok");
    $("#edit-item-message").html('');
    $('#edit-item-ok').attr('row', origin.attr('row'));
    $('#edit-item-ok').attr('type-of-item', origin.attr('type-of-item'));
    $('#modal-edit-item button').show('fast');
    $('#edit-item-finish').hide('fast');
    $('.modal').modal('hide');
    $('#modal-edit-item').modal('show');
};
libraryHelper.prototype.onEditItemOk = function () {
    $("#edit-item-message").html('');
    // Call to specific function for the type
    var function_name = this.type + '_get_item_to_save';
    var item = this[function_name]();
    var index = $('#edit-item-ok').attr('row');
    var item_subsystem = $('#edit-item-ok').attr('type-of-item');
    edit_item(item, index, item_subsystem); // This function is declared in the view
    $('.modal').modal('hide');
};
libraryHelper.prototype.onApplyMeasure = function (origin) {
    // Add attributes to the "Ok" button
    $('#apply-measure-ok').attr('library', origin.attr('library'));
    $('#apply-measure-ok').attr('tag', origin.attr('tag'));
    $('#apply-measure-ok').attr('row', origin.attr('row'));
    $('#apply-measure-ok').attr('item_id', origin.attr('item_id'));
    $('#apply-measure-ok').attr('item', origin.attr('item'));
    $('#apply-measure-ok').attr('type-of-item', origin.attr('type-of-item')); // Used for energy_systems
    //// Check replacefrom library manually (option by default)
    $('[name=radio-type-of-measure]').filter('[value=replace]').click();
    $('[name=radio-type-of-measure]').filter('[value=replace_from_measure_library]').click();
    // Populate the selects library to choose a library and an item (used when replace the item with one from library)
    //Moved to onChangeApplyMeasureWhatToDo
    /*var out = '';
     this.library_list[this.type].forEach(function (library) {
     out += "<option value=" + library.id + ">" + library.name + "</option>";
     });
     $("#replace-from-lib").html(out);
     this.onChangeApplyMeasureReplaceFromLib(); // This one to populate the select for items
     */

    // Show/hide modals
    $('#apply-measure-finish').hide('fast');
    $('.modal').modal('hide');
    $('[name=radio-type-of-measure]').each(function (index) {
        // $(this).parent().show('fast');
    });
    //If we are in fabric Systems remove show the option to Apply Measure from Measures Library
    if (this.type == 'systems')
        $('.replace_from_measure_library').hide();
    $('#apply-measure-modal').modal('show');
};
libraryHelper.prototype.onApplyMeasureOk = function (origin) {
    var measure = {
        row: origin.attr('row'),
        item_id: origin.attr('item_id'),
        type: $('[name=radio-type-of-measure]:checked').val(),
        requirement: origin.attr('type-of-item') // Used for energy_systems
    };
    switch (measure.type) {
        case 'remove':
            // do nothing
            break;
        case 'edit':
        case 'replace':
            var function_name = this.type + '_get_item_to_save';
            measure.item = this[function_name]();
            break;
        case'replace_from_measure_library':
            var function_name = this.type + '_measures_get_item_to_save';
            measure.item = this[function_name]();
            break;
    }
    apply_measure(measure);
    $('#apply-measure-modal').modal('hide');
};
libraryHelper.prototype.onChangeApplyMeasureWhatToDo = function () {
    switch ($('[name=radio-type-of-measure]:checked').val()) {
        case 'remove':
            $('#apply-measure-replace').hide('fast');
            $('#apply-measure-item-fields').hide('fast');
            break;
        case 'replace':
            this.populate_selects_in_apply_measure_modal(this.type);
            this.onChangeApplyMeasureReplaceFromLib(this.type);
            this.onChangeApplyMeasureReplaceFromLibItem(this.type);
            $('#apply-measure-replace').show('fast');
            $('#apply-measure-item-fields').show('fast');
            break;
        case 'replace_from_measure_library':
            if (this.type == 'elements')
                var type = 'elements_measures';
            else
                var type = this.type;
            this.populate_selects_in_apply_measure_modal(type);
            this.onChangeApplyMeasureReplaceFromLib(type);
            this.onChangeApplyMeasureReplaceFromLibItem(type);
            $('#apply-measure-replace').show('fast');
            $('#apply-measure-item-fields').show('fast');
            break;
        case 'edit':
            var original_item = JSON.parse($('#apply-measure-ok').attr('item'));
            var tag = $('#apply-measure-ok').attr('tag');
            $('#apply-measure-item-fields').html('');
            var function_name = this.type + "_item_to_html";
            var out = this[function_name](original_item, tag);
            $('#apply-measure-item-fields').html(out);
            $("#apply-measure-item-fields .create-element-type").prop('disabled', true);
            $('#apply-measure-replace').hide('fast');
            $('#apply-measure-item-fields').show('fast');
            break;
    }
};
libraryHelper.prototype.onChangeApplyMeasureReplaceFromLib = function (type_of_library) {
    var out = "";
    var original_item = JSON.parse($('#apply-measure-ok').attr('item'));
    var library = this.get_library_by_id($('#replace-from-lib').val()).data;
    for (item in library) {
        if (type_of_library == 'elements' || type_of_library == 'elements_measures') {
            if (library[item].tags[0].toUpperCase() == original_item.type.toUpperCase())
                out += '<option value="' + item + '">' + item + ': ' + library[item].name + '</option>';
        }
        else
            out += '<option value="' + item + '">' + item + ': ' + library[item].name + '</option>';
    }

    $('#replace-from-lib-items').html(out);
    $("#replace-from-lib-items").attr('library_type', type_of_library);
    this.populate_measure_new_item(type_of_library);
};
libraryHelper.prototype.onChangeApplyMeasureReplaceFromLibItem = function (type_of_library) {
    this.populate_measure_new_item(type_of_library);
    //disable the possibility to change the type of the element
    $("#apply-measure-item-fields .create-element-type").prop('disabled', true);
};
libraryHelper.prototype.onChangeTypeOnCreateElementLibItem = function () {
    var type = $('#modal-create-in-library .create-element-type').val();
    // Show window specific fields for a given type
    if (type == 'Window' || type == 'Door' || type == 'Roof_light')
        $('.window-element').show('fast');
    else
        $('.window-element').hide('fast');
    if (type == "Wall" && this.type == 'elements_measures')
        $('#modal-create-in-library .EWI-row').show('fast');
    else
        $('#modal-create-in-library .EWI-row').hide('fast');
    // Populate elements dropdown
    $('#modal-create-in-library #item-to-copy-select').html('');
    var library = this.get_library_by_id($('#modal-create-in-library #origin-library-select').val());
    var out = '';
    for (i in library.data) {
        if (type.toUpperCase() == library.data[i].tags[0].toUpperCase())
            out += '<option value="' + i + '">' + i + '</option>';
    }
    $('#modal-create-in-library #item-to-copy-select').html(out);
    if ($('#modal-create-in-library [name="empty_or_copy_item"]:checked').val() == 'empty') {
        out = this.elements_item_to_html();
    } else { // Copy from existing one
        // Replace item with the first one in the list
        $('#modal-create-in-library #new-item-in-library').html('');
        var tag = $('#modal-create-in-library #item-to-copy-select').val();
        out = this.elements_item_to_html(library.data[tag]);
        $('#modal-create-in-library .new-item-in-library').html(out);
        $('#modal-create-in-library .item-tag').val('New tag');
    }
};
libraryHelper.prototype.onShowLibraryItems = function (library_id) {
    var library = this.get_library_by_id(library_id);
    this.type = library.type;
    //Header
    $("#show-library-items-header").html(this.library_names[this.type]);
    $('#show-library-items-library-name').html(library.name);
    // Items
    var function_name = library.type + '_library_to_html';
    var out = this[function_name](null, library_id);
    $("#show-library-items-modal #show-library-items-table").html(out);
    // Add Library id to edit buttons

    // Hide the Use buttons
    $("#show-library-items-modal .use-from-lib").hide('fast');
    // Hide Write options if no write access
    if (this.library_permissions[library.id].write != 1)
        $("#show-library-items-modal .if-write").hide('fast');
    // Show the select to choose the type of fabric elements when library is "elements"
    if (this.type == 'elements' || this.type == 'elements_measures')
        $('#show-library-items-modal .element-type').show('fast');
    // Add library id to Create new item and Save
    $('#show-library-items-modal #create-in-library').attr('library-id', library_id);
    $('#show-library-items-modal #save').attr('library-id', library_id);
    // Show modal
    $("#show-library-items-modal").modal('show');
};
libraryHelper.prototype.onChangeTypeOfElementsToShow = function (origin) {
    origin.attr('tags', [origin.val()]); //this is the type of elements to display
    var library_id = origin.attr('library_id');
    //var out = this.elements_library_to_html(origin, library_id);
    var function_name = this.type + '_library_to_html';
    var out = this[function_name](origin, library_id);
    // Items
    $("#show-library-items-modal #show-library-items-table").html(out);
    // Add Library id to edit buttons

    // Hide the Use buttons
    $("#show-library-items-modal .use-from-lib").hide('fast');
    // Hide Write options if no write access
    if (this.library_permissions[library_id].write != 1)
        $("#show-library-items-modal .if-write").hide('fast');
    // Show the select to choose the type of fabric elements when library is "elements"
    $('#show-library-items-modal .element-type').show('fast');
};
libraryHelper.prototype.onManageUsers = function (library_id) {

}
libraryHelper.prototype.onDeleteLibrary = function (library_id) {
    $('#confirm-delete-library-modal #delete-library-ok').attr('library-id', library_id);
    $('#confirm-delete-library-modal').modal('show');
}
libraryHelper.prototype.onDeleteLibraryOk = function (library_id) {
    var myself = this;
    $.ajax({url: path + "assessment/deletelibrary.json", data: "library_id=" + library_id, async: false, datatype: "json", success: function (result) {
            if (result == 1) {
                $('#confirm-delete-library-modal').modal('hide');
                myself.init();
                UpdateUI();
            }
            else
                $('#confirm-delete-library-modal .message').html('Library could not be deleted - ' + result);
        }});
}
libraryHelper.prototype.onShowLibraryItemsEditMode = function (library_id) {
    var library = this.get_library_by_id(library_id);
    this.type = library.type;

    //Header
    $("#show-library-modal-edit-mode #show-library-header").html(this.library_names[this.type]);
    $('#show-library-modal-edit-mode #show-library-name').html(library.name);
    // Items
    var function_name = library.type + '_library_to_html_edit_mode';
    var out = this[function_name](null, library_id);
    $("#show-library-modal-edit-mode .modal-body").html(out);
    // Hide Write options if no write access
    if (this.library_permissions[library.id].write != 1)
        $("#show-library-modal-edit-mode .if-write").hide('fast');
    // Add library id to "Create new item" and "Save" buttons
    $('#show-library-modal-edit-mode #create-in-library').attr('library-id', library_id);
    $('#show-library-modal-edit-mode #save').attr('library-id', library_id);
    // Disable save button
    $('#show-library-modal-edit-mode #save').attr('disabled', 'disabled');
    // Empty message 
    $('#show-library-modal-edit-mode #message').html('');
    // Modal dimensions
    var width = 1415;
    switch (library.type) {
        case 'intentional_vents_and_flues':
            width = 1200;
            break;
        case 'elements':
        case 'ventilation_systems':
        case 'appliances_and_cooking':
            width = 1415;
            break;
        case 'elements_measures':
        case 'ventilation_systems_measures':
        case 'draught_proofing_measures':
        case 'extract_ventilation_points':
        case 'generation_measures':
        case 'heating_systems':
        case 'heating_systems_measures':
        case 'clothes_drying_facilities':
        case 'space_heating_control_type':
        case 'hot_water_control_type':
        case 'intentional_vents_and_flues_measures':
        case 'pipework_insulation':
        case 'water_usage':
        case 'storage_type': 
        case 'storage_type_measures':    
            width = 1600;
            break;
    }
    var a = width + 'px';
    $("#show-library-modal-edit-mode").css({'width': width + 'px', 'margin-left': -width / 2 + 'px'});
    // Show modal
    $("#show-library-modal-edit-mode").modal('show');
    $("#show-library-modal-edit-mode").resizable({});
    $('#show-library-modal-edit-mode').draggable();
    $("#show-library-modal-edit-mode").resize(function () {
        var new_height = $("#show-library-modal-edit-mode").height() - 150;
        $('#show-library-modal-edit-mode .modal-body').height(new_height);
    })
    // Add events
    $('#show-library-modal-edit-mode input').on('change', function () {
        $(this).parent().parent().attr('changed', 'true');
        $('#show-library-modal-edit-mode #save').removeAttr('disabled');
        $('#show-library-modal-edit-mode #message').html('');
    });
};
libraryHelper.prototype.onSaveLibraryEditMode = function (selector, library_id) {
    var data = {};
    $(selector + ' .item').each(function () {
        var tag = $(this).find('[index="tag"] input')[0].value;
        data[tag] = {tags: [$(this).attr('tags')]};
        $(this).children('td').each(function () {
            var key = $(this).attr('index');
            if (key != undefined) {
                if ($(this).children('input')[0] != undefined) {
                    if ($(this).children('input')[0].type == 'text' || $(this).children('input')[0].type == 'number')
                        data[tag][key] = $(this).children('input')[0].value;
                    else if ($(this).children('input')[0].type == 'checkbox') {
                        if ($(this).children('input').is(":checked"))
                            data[tag][key] = true;
                        else
                            data[tag][key] = false;
                    }
                    else
                        console.error("Type of input not recognized: " + $(this).children('input')[0].type);
                }
                else if ($(this).children('select')[0] != undefined) {
                    data[tag][key] = $(this).children('select')[0].value;
                }
                else
                    console.error("Type of input not recognized: ");
                /*if(element.type)
                 data[tag][key] = $(this).find('input')[0].value;
                 */
            }
        });
    });

    $.ajax({url: path + "assessment/savelibrary.json", method: 'post', data: 'data=' + JSON.stringify(data) + '&id=' + library_id, async: false, datatype: "json", success: function (result) {
            if (result != true)
                alert("Library could not be saved. The server said: " + result);
            else {
                $('#show-library-modal-edit-mode #save').attr('disabled', 'disabled');
                $('#show-library-modal-edit-mode #message').html('Saved');
            }
        }});

}

/**********************************************
 * Libraries to html
 **********************************************/

libraryHelper.prototype.default_library_to_html = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    this.orderObjectsByKeys(selected_library.data);
    for (z in selected_library.data) {
        out += "<tr><td>" + z + ': ' + selected_library.data[z].name + "</td>";
        out += "<td style='text-align:right;width:250px'>";
        out += "<button tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn add-system use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
        out += "</td>";
        out += "</tr>";
    }
    return out;
};
libraryHelper.prototype.default_library_by_category_to_html = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    this.orderObjectsByKeys(selected_library.data);
    // order by category
    var ordered_by_categories = {};
    for (z in selected_library.data) {
        var category = selected_library.data[z].category;
        if (ordered_by_categories[category] == undefined)
            ordered_by_categories[category] = {};
        ordered_by_categories[category][z] = selected_library.data[z];
    }

    // Prepare the output string
    for (category in ordered_by_categories) {
        out += "<tr><th colspan='2'>" + category + "</th></tr>";
        for (z in ordered_by_categories[category]) {
            out += "<tr><td style='padding-left:50px'>" + z + ': ' + selected_library.data[z].name + "</td>";
            out += "<td style='text-align:right;width:250px'>";
            out += "<button tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
            out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
            out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn add-system use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
            out += "</td>";
            out += "</tr>";
        }
    }
    return out;
};
libraryHelper.prototype.systems_library_to_html = function (origin, library_id) {
    var eid = '';
    if (origin != undefined)
        eid = $(origin).attr('eid');
    else
        eid = '';
    //if ($('#library-select').val() != undefined)
    //library_id = $('#library-select').val();
    var selected_library = this.get_library_by_id(library_id);
    this.orderObjectsByKeys(selected_library.data);
    $('#library-select').attr('eid', eid);
    var out = "";
    for (z in selected_library.data) {
        out += "<tr><td>" + z + ': ' + selected_library.data[z].name + "<br>";
        out += "<span style='font-size:80%'>";
        out += "<b>Efficiency:</b> " + Math.round(selected_library.data[z].efficiency * 100) + "%, ";
        out += "<b>Winter:</b> " + Math.round(selected_library.data[z].winter * 100) + "%, ";
        out += "<b>Summer:</b> " + Math.round(selected_library.data[z].summer * 100) + "%, ";
        out += "<b>Fuel:</b> " + selected_library.data[z].fuel;
        out += "</span></td>";
        out += "<td></td>";
        out += "<td style='text-align:right;width:250px'>";
        out += "<button eid='" + eid + "' system='" + z + "' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
        out += "<button style='margin-left:10px' eid='" + eid + "' system='" + z + "' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
        out += "<button style='margin-left:10px' eid='" + eid + "' system='" + z + "' library='" + selected_library.id + "' class='btn add-system use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
        out += "</td>";
        out += "</tr>";
    }
    return out;
};
libraryHelper.prototype.elements_library_to_html = function (origin, library_id) {
    var tag = [];
    var selected_lib = false;
    var element_row = false;
    
    if (origin != undefined) {
        tag = $(origin).attr('tags').split(',');
        element_row = $(origin).attr('row');
        selected_lib = data.fabric.elements[element_row].lib;
        
        if (selected_lib==undefined) selected_lib = false;
    } else {
        tag = ['Wall'];
    }
        
    //if ($('#library-select').val() != undefined)
    //library_id = $('#library-select').val();
    var element_library = this.get_library_by_id(library_id).data;
    this.orderObjectsByKeys(element_library);
    $('#library-select').attr('tags', tag);
    var out = "";
    //Select to choose the type of element to display, not always used and is hidden by default
    out = '<div class="input-prepend element-type" style="display:none" ><span class="add-on">Type</span><select library_id="' + library_id + '" >';
    out += tag[0] == 'Wall' ? '<option value="Wall" selected>Wall</option>' : '<option value = "Wall" > Wall </option>';
    if (tag[0] == 'party_wall' || tag[0] == 'Party_wall')
        out += '<option value="Party_wall" selected>Party wall</option>';
    else
        out += '<option value="Party_wall">Party wall</option>';
    out += tag[0] == 'Roof' ? '<option value="Roof" selected>Roof</option>' : '<option value="Roof">Roof</option>';
    out += tag[0] == 'Loft' ? '<option value="Loft" selected>Loft</option>' : '<option value="Loft">Loft</option>';
    out += tag[0] == 'Floor' ? '<option value="Floor" selected>Floor</option>' : '<option value="Floor">Floor</option>';
    out += tag[0] == 'Window' ? ' <option value = "Window" selected > Window </option>' : '<option value="Window">Window</option> ';
    out += tag[0] == 'Door' ? ' <option value = "Door" selected > Door </option>' : '<option value="Door">Door</option> ';
    out += tag[0] == 'Roof_light' ? ' <option value = "Roof_light" selected > Roof light </option>' : '<option value="Roof_light">Roof light</option> ';
    out += tag[0] == 'Hatch' ? ' <option value = "Hatch" selected > Hatch </option>' : '<option value="Hatch">Hatch</option> ';
    out += '</select></div>';
    // Elements
    out += '<table>';
    for (z in element_library) {
        if (tag.indexOf(element_library[z].tags[0]) != -1) {
            var selected_class = ""; if (z==selected_lib) selected_class = "selected_lib";
            out += "<tr class='librow "+selected_class+"' lib='" + z + "' type='" + tag + "'>";
            out += "<td>" + z + "</td>";
            out += "<td>" + element_library[z].name;
            out += "<br><span style='font-size:13px'><b>Source:</b> " + element_library[z].source + "</span>";
            /*if (element_library[z].criteria.length)
             out += "<br><span style='font-size:13px'><b>Measure criteria:</b> " + element_library[z].criteria.join(", ") + "</span>";
             */
            out += "</td>";
            out += "<td style='font-size:13px'>";
            out += "<b>U-value:</b> " + element_library[z].uvalue + " W/m<sup>2</sup>.K";
            out += "<br><b>k-value:</b> " + element_library[z].kvalue + " kJ/m<sup>2</sup>.K";
            if (element_library[z].tags[0] == "Window" || element_library[z].tags[0] == "Door" || element_library[z].tags[0] == "Roof_light") {
                out += "<br><b>g:</b> " + element_library[z].g + ", ";
                out += "<b>gL:</b> " + element_library[z].gL + ", ";
                out += "<b>ff:</b> " + element_library[z].ff;
            }
            out += "</td>";
            out += "<td >";
            out += "<i style='cursor:pointer' class='icon-pencil if-write edit-library-item' library='" + library_id + "' lib='" + z + "' type='" + element_library[z].tags[0] + "' tag='" + z + "'></i>";
            out += "<i style='cursor:pointer;margin-left:20px' class='icon-trash if-write delete-library-item' library='" + library_id + "' lib='" + z + "' type='" + element_library[z].tags[0] + "' tag='" + z + "'></i>";
            // out += "<i class='icon-trash' style='margin-left:20px'></i>";
            
            // add-element & change-element handled in elements.js
            var action = "add-element";
            var row_attr = "";
            if (selected_lib) { 
                action = "change-element";
                row_attr = "row="+element_row;
            }
            out += "<button class='"+action+" use-from-lib btn' style='margin-left:20px' "+row_attr+" library='" + library_id + "' lib='" + z + "' type='" + element_library[z].tags[0] + "'>use</button</i>";
            out += "</td>";
            out += "</tr>";
        }
    }
    out += '</table>';
    return out;
};
libraryHelper.prototype.elements_measures_library_to_html = function (origin, library_id) {
    var out = this.elements_library_to_html(origin, library_id);
    return out;
};
libraryHelper.prototype.draught_proofing_measures_library_to_html = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    this.orderObjectsByKeys(selected_library.data);
    for (z in selected_library.data) {
        out += "<tr><td>" + z + ': ' + selected_library.data[z].name + "</td>";
        out += "<td><b>q50:</b> " + selected_library.data[z].q50 + " m<sup>3</sup>/hm<sup>2</sup></td>";
        out += "<td style='text-align:right;width:250px'>";
        out += "<button tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn add-system use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
        out += "</td>";
        out += "</tr>";
    }
    return out;
};
libraryHelper.prototype.ventilation_systems_measures_library_to_html = function (origin, library_id) {
    return this.default_library_to_html(origin, library_id);
};
libraryHelper.prototype.ventilation_systems_library_to_html = function (origin, library_id) {
    var out = this.default_library_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-ventilation-system');
    return out;
};
libraryHelper.prototype.extract_ventilation_points_library_to_html = function (origin, library_id) {
    var out = this.default_library_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-EVP');
    return out;
};
libraryHelper.prototype.intentional_vents_and_flues_library_to_html = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    this.orderObjectsByKeys(selected_library.data);
    for (z in selected_library.data) {
        out += "<tr><td>" + z + ': ' + selected_library.data[z].name + "</td>";
        out += "<td><b>Ventilation rate:</b> " + selected_library.data[z].ventilation_rate + " m<sup>3</sup>/hm<sup>2</sup></td>";
        out += "<td style='text-align:right;width:150px'>";
        out += "<button tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn add-IVF use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
        out += "</td>";
        out += "</tr>";
    }
    return out;
};
libraryHelper.prototype.intentional_vents_and_flues_measures_library_to_html = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    this.orderObjectsByKeys(selected_library.data);
    for (z in selected_library.data) {
        out += "<tr><td>" + z + ': ' + selected_library.data[z].name + "</td>";
        out += "<td><b>Ventilation rate:</b> " + selected_library.data[z].ventilation_rate + " m<sup>3</sup>/hm<sup>2</sup></td>";
        out += "<td style='text-align:right;width:150px'>";
        out += "<button tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn add-IVF-measure use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
        out += "</td>";
        out += "</tr>";
    }
    return out;
};
libraryHelper.prototype.water_usage_library_to_html = function (origin, library_id) {
    var out = this.default_library_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-water_usage');
    return out;
};
libraryHelper.prototype.storage_type_library_to_html = function (origin, library_id) {
    var out = this.default_library_by_category_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-storage-type');
    return out;
};
libraryHelper.prototype.storage_type_measures_library_to_html = function (origin, library_id) {
    var out = this.default_library_by_category_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-storage-type-measure');
    return out;
};
libraryHelper.prototype.appliances_and_cooking_library_to_html = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    this.orderObjectsByKeys(selected_library.data);
    // order by category
    var ordered_by_categories = {};
    for (z in selected_library.data) {
        var category = selected_library.data[z].category;
        if (ordered_by_categories[category] == undefined)
            ordered_by_categories[category] = {};
        ordered_by_categories[category][z] = selected_library.data[z];
    }

    // Prepare the output string
    for (category in ordered_by_categories) {
        out += "<tr><th colspan='2'>" + category + "</th></tr>";
        for (z in ordered_by_categories[category]) {
            out += "<tr><td style='padding-left:50px'>" + z + ': ' + selected_library.data[z].name + "</td>";
            out += "<td style='text-align:right;width:250px'>";
            out += "<button tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
            out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
            out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn add-item-CarbonCoop use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
            out += "</td>";
            out += "</tr>";
        }
    }
    return out;
};
libraryHelper.prototype.heating_control_library_to_html = function (origin, library_id) {
    var out = this.default_library_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-heating-control');
    return out;
};
libraryHelper.prototype.heating_systems_library_to_html = function (origin, library_id) {
    var out = this.default_library_by_category_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-heating-system');
    return out;
};
libraryHelper.prototype.heating_systems_measures_library_to_html = function (origin, library_id) {
    var out = this.default_library_by_category_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-heating-system-measure');
    return out;
};
libraryHelper.prototype.pipework_insulation_library_to_html = function (origin, library_id) {
    var out = this.default_library_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-pipework-insulation');
    return out;
};
libraryHelper.prototype.hot_water_control_type_library_to_html = function (origin, library_id) {
    var out = this.default_library_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-storage-control-type');
    return out;
};
libraryHelper.prototype.space_heating_control_type_library_to_html = function (origin, library_id) {
    var out = this.default_library_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-space-heating-control-type');
    return out;
};
libraryHelper.prototype.clothes_drying_facilities_library_to_html = function (origin, library_id) {
    var out = this.default_library_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-clothes-drying-facilities');
    return out;
};
libraryHelper.prototype.generation_measures_library_to_html = function (origin, library_id) {
    var out = this.default_library_to_html(origin, library_id);
    out = out.replace(/add-system/g, 'add-generation');
    return out;
};
/**********************************************
 * Libraries to html - Edit mode (for lilbraries manager)
 **********************************************/
libraryHelper.prototype.measure_fields_for_library_to_html_edit_mode = function (item) {
    var out = '<td index="description" title="' + item.description + '"><input type="text" value="' + item.description + '" /></td>';
    out += '<td index="performance" title="' + item.performance + '"><input class="w100" type="text" value="' + item.performance + '" /></td>';
    out += '<td index="benefits" class="" title="' + item.benefits + '"><input type="text" value="' + item.benefits + '" /></td>';
    out += '<td index="cost"><input class="w50" type="text" value="' + item.cost + '" /></td>';
    out += '<td index="cost_units">' + this.get_cost_units_select(item) + '</td>';
    out += '<td index="who_by" class="" title="' + item.who_by + '"><input type="text" value="' + item.who_by + '" /></td>';
    out += '<td index="disruption" title="' + item.disruption + '"><input class="w100" type="text" value="' + item.disruption + '" /></td>';
    out += '<td index="associated_work" class="" title="' + item.associated_work + '"><input type="text" value="' + item.associated_work + '" /></td>';
    out += '<td index="key_risks" class="" title="' + item.key_risks + '"><input type="text" value="' + item.key_risks + '" /></td>';
    out += '<td index="notes" class="" title="' + item.notes + '"><input type="text" value="' + item.notes + '" /></td>';
    out += '<td index="maintenance" title="' + item.maintenance + '"><input class="w100" type="text" value="' + item.maintenance + '" /></td>';
    return out;
};
libraryHelper.prototype.elements_library_to_html_edit_mode = function (origin, library_id) {
    var tag = [];
    if (origin != undefined)
        tag = $(origin).attr('tags').split(',');
    else
        tag = ['Wall'];
    //if ($('#library-select').val() != undefined)
    //library_id = $('#library-select').val();
    var element_library = this.get_library_by_id(library_id).data;
    this.orderObjectsByKeys(element_library);
    var out = "";
    // Elements
    out += html('Walls', 'Wall');
    out += html('Party walls', 'Party_wall');
    out += html('Roofs', 'Roof');
    out += html('Lofts', 'Loft');
    out += html('Floors', 'Floor');
    out += html('Windows', 'Window');
    out += html('Doors', 'Door');
    out += html('Roof lights', 'Roof_light');
    out += html('Hatches', 'Hatch');
    return out;
    function html(heading, tag) {
        var out = '<div id="' + tag + '"><h4 style="margin-top:25px">' + heading + '</h4><table>';
        if (Object.keys(element_library).length == 0)
            out += '';
        else {
            out += '<tr><th>Tag</th><th>Name</th><th>Source</th><th>U-value</th><th>k-value</th>';
            if (tag == 'Window' || tag == 'Door' || tag == 'Roof_light' || tag == 'Hatch')
                out += '<th>g</th><th>gL</th><th>ff</th>';
            out += '<th>Description</th>';
            out += '<th></th></tr>';
            for (z in element_library) {
                var item = element_library[z];
                if (item.tags.indexOf(tag) !== -1) {
                    out += '<tr tag="' + z + '" tags="' + tag + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
                    out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
                    out += '<td index="source" title="' + item.source + '"><input class="w200" type="text" value="' + item.source + '" /></td>';
                    out += '<td index="uvalue"><input class="w50" type="number" min="0" step="0.01" value="' + item.uvalue + '" /></td>';
                    out += '<td index="kvalue"><input class="w50" type="number" min="0" step="1" value="' + item.kvalue + '" /></td>';
                    if (tag == 'Window' || tag == 'Door' || tag == 'Roof_light' || tag == 'Hatch') {
                        out += '<td index="g"><input class="w50" type="number" min="0" step="0.01" value="' + item.g + '" /></td>';
                        out += '<td index="gL"><input class="w50" type="number" min="0" step="0.01" value="' + item.gL + '" /></td>';
                        out += '<td index="ff"><input class="w50" type="number" min="0" step="0.01" value="' + item.ff + '" /></td>';
                    }
                    out += '<td index="description" title="' + item.description + '"><input clas="w300" type="text" value="' + item.description + '" /></td>';
                    out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
                    out += '</tr>';
                }
            }
        }
        out += '</table></div>';
        return out;
    }
};
libraryHelper.prototype.elements_measures_library_to_html_edit_mode = function (origin, library_id) {
    var myself = this;
    var tag = [];
    if (origin != undefined)
        tag = $(origin).attr('tags').split(',');
    else
        tag = ['Wall'];
    //if ($('#library-select').val() != undefined)
    //library_id = $('#library-select').val();
    var element_library = this.get_library_by_id(library_id).data;
    this.orderObjectsByKeys(element_library);
    var out = "";
    // Elements
    out += html('Walls', 'Wall');
    out += html('Party walls', 'Party_wall');
    out += html('Roofs', 'Roof');
    out += html('Lofts', 'Loft');
    out += html('Floors', 'Floor');
    out += html('Windows', 'Window');
    out += html('Doors', 'Door');
    out += html('Roof lights', 'Roof_light');
    out += html('Hatches', 'Hatch');
    return out;
    function html(heading, tag) {
        var out = '<div id="' + tag + '"><h4 style="margin-top:25px">' + heading + '</h4><table><tr><th>Tag</th><th>Name</th><th>Source</th><th>U-value</th><th>k-value</th>';

        if (Object.keys(element_library).length == 0)
            out += '';
        else {
            if (tag == 'Window' || tag == 'Door' || tag == 'Roof_light' || tag == 'Hatch')
                out += '<th>g</th><th>gL</th><th>ff</th>';
            if (tag == 'Wall')
                out += '<th>EWI<i class="icon-question" title="Ticking this box will increase the area of the wall by 1.15" /></th>';
            out += '<th>Minimum cost <icon class="icon-question-sign" title="Total cost of measure = minimum cost + (area x unit cost)" /></th><th>Description</th>';
            out += '<th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th>';
            out += '<th></th></tr>';
            for (z in element_library) {
                var item = element_library[z];
                if (item.tags.indexOf(tag) !== -1) {
                    out += '<tr tag="' + z + '" tags="' + tag + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
                    out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
                    out += '<td index="source" title="' + item.source + '"><input class="w200" type="text" value="' + item.source + '" /></td>';
                    out += '<td index="uvalue"><input class="w50" type="number" min="0" step="0.01" value="' + item.uvalue + '" /></td>';
                    out += '<td index="kvalue"><input class="w50" type="number" min="0" step="1" value="' + item.kvalue + '" /></td>';
                    if (tag == 'Window' || tag == 'Door' || tag == 'Roof_light' || tag == 'Hatch') {
                        out += '<td index="g"><input class="w50" type="number" min="0" step="0.01" value="' + item.g + '" /></td>';
                        out += '<td index="gL"><input class="w50" type="number" min="0" step="0.01" value="' + item.gL + '" /></td>';
                        out += '<td index="ff"><input class="w50" type="number" min="0" step="0.01" value="' + item.ff + '" /></td>';
                    }
                    if (tag == 'Wall')
                        out += '<td index="EWI"><input type="checkbox"' + (item.EWI === true ? 'checked' : '') + ' /></td>';
                    out += '<td index="min_cost"><input class="w100" type="number" min="0" step="1" value="' + item.min_cost + '" /></td>';
                    out += myself.measure_fields_for_library_to_html_edit_mode(item);
                    out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
                    out += '</tr>';
                }
            }
        }
        out += '</table></div>';
        return out;
    }
};
libraryHelper.prototype.ventilation_systems_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Ventilation type</th><th>Air change rate - ach</th><th>Specific Fan Power - W/(litre.sec)</th><th>Balanced heat recovery efficiency (%)</th><th>Source</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="ventilation_type"><select class="w200" value="' + item.ventilation_type + '">'
            out += item.ventilation_type == 'NV' ? '<option value="NV" selected>Natural ventilation only (NV)</option>' : '<option value="NV">Natural ventilation only (NV)</option>';
            out += item.ventilation_type == 'IE' ? '<option value="IE" selected>Intermittent extract ventilation (IE)</option>' : '<option value="IE">Intermittent extract ventilation (IE)</option>';
            out += item.ventilation_type == 'DEV' ? '<option value="DEV" selected>Continuous decentralised mechanical extract ventilation (DEV)</option>' : '<option value="DEV">Continuous decentralised mechanical extract ventilation (DEV)</option>';
            out += item.ventilation_type == 'MEV' ? '<option value="MEV" selected>Continuous whole house extract ventilation (MEV)</option>' : '<option value="MEV">Continuous whole house extract ventilation (MEV)</option>';
            out += item.ventilation_type == 'MV' ? '<option value="MV" selected>Balanced mechanical ventilation without heat recovery (MV)</option>' : '<option value="MV">Balanced mechanical ventilation without heat recovery (MV)</option>';
            out += item.ventilation_type == 'MVHR' ? '<option value="MVHR" selected>Balanced mechanical ventilation with heat recovery (MVHR)</option>' : '<option value="MVHR">Balanced mechanical ventilation with heat recovery (MVHR)</option>';
            out += item.ventilation_type == 'PS' ? '<option value="PS" selected>Whole House Passive Stack Ventilation System (PS)</option>' : '<option value="PS">Whole House Passive Stack Ventilation System (PS)</option>';
            out += '</select></td>';
            out += '<td index="system_air_change_rate"><input class="w100" type="number" min="0" step="0.1" value="' + item.system_air_change_rate + '" /></td>';
            out += '<td index="specific_fan_power"><input class="w100" type="number" min="0" step="0.1" value="' + item.specific_fan_power + '" /></td>';
            out += '<td index="balanced_heat_recovery_efficiency"><input class="w100" type="number" min="0" max="100" step="1" value="' + item.balanced_heat_recovery_efficiency + '" /></td>';
            out += '<td index="source" title="' + item.source + '"><input type="text" value="' + item.source + '" /></td>';
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.ventilation_systems_measures_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Ventilation type</th><th>Air change rate - ach</th><th>Specific Fan Power - W/(litre.sec)</th><th>Balanced heat recovery efficiency (%)</th><th>Source</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="ventilation_type"><select class="w200" value="' + item.ventilation_type + '">'
            out += item.ventilation_type == 'NV' ? '<option value="NV" selected>Natural ventilation only (NV)</option>' : '<option value="NV">Natural ventilation only (NV)</option>';
            out += item.ventilation_type == 'IE' ? '<option value="IE" selected>Intermittent extract ventilation (IE)</option>' : '<option value="IE">Intermittent extract ventilation (IE)</option>';
            out += item.ventilation_type == 'DEV' ? '<option value="DEV" selected>Continuous decentralised mechanical extract ventilation (DEV)</option>' : '<option value="DEV">Continuous decentralised mechanical extract ventilation (DEV)</option>';
            out += item.ventilation_type == 'MEV' ? '<option value="MEV" selected>Continuous whole house extract ventilation (MEV)</option>' : '<option value="MEV">Continuous whole house extract ventilation (MEV)</option>';
            out += item.ventilation_type == 'MV' ? '<option value="MV" selected>Balanced mechanical ventilation without heat recovery (MV)</option>' : '<option value="MV">Balanced mechanical ventilation without heat recovery (MV)</option>';
            out += item.ventilation_type == 'MVHR' ? '<option value="MVHR" selected>Balanced mechanical ventilation with heat recovery (MVHR)</option>' : '<option value="MVHR">Balanced mechanical ventilation with heat recovery (MVHR)</option>';
            out += item.ventilation_type == 'PS' ? '<option value="PS" selected>Whole House Passive Stack Ventilation System (PS)</option>' : '<option value="PS">Whole House Passive Stack Ventilation System (PS)</option>';
            out += '</select></td>';
            out += '<td index="system_air_change_rate"><input class="w100" type="number" min="0" step="0.1" value="' + item.system_air_change_rate + '" /></td>';
            out += '<td index="specific_fan_power"><input class="w100" type="number" min="0" step="0.1" value="' + item.specific_fan_power + '" /></td>';
            out += '<td index="balanced_heat_recovery_efficiency"><input class="w100" type="number" min="0" max="100" step="1" value="' + item.balanced_heat_recovery_efficiency + '" /></td>';
            out += '<td index="source" title="' + item.source + '"><input class="w150" type="text" value="' + item.source + '" /></td>';
           out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.draught_proofing_measures_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>q50 (m<sup>3</sup>/hm<sup>2</sup>)</th><th>Source</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="q50"><input class="w100" type="number" min="0" step="1" value="' + item.q50 + '" /></td>';
            out += '<td index="source" title="' + item.source + '"><input type="text" value="' + item.source + '" /></td>';
            out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.extract_ventilation_points_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Ventilation rate</th><th>Type</th><th>Source</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="ventilation_rate"><input class="w100" type="number" min="0" step="1" value="' + item.ventilation_rate + '" /></td>';
            out += '<td index="type"><select class="w200" value="' + item.type + '">'
            out += item.type === 'Intermittent fan' ? '<option value="Intermittent fan" selected>Intermittent fan</option>' : '<option value="Intermittent fan">Intermittent fan</option>';
            out += item.type === 'Passive vent' ? '<option value="Passive vent" selected>Passive vent</option>' : '<option value="Passive vent">Passive vent</option>';
            out += '</select></td>';
            out += '<td index="source" title="' + item.source + '"><input type="text" value="' + item.source + '" /></td>';
            out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.generation_measures_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>kWp</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="kWp"><input class="w50" type="number" min="0" step="0.1" value="' + item.kWp + '" /></td>';
            out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.heating_systems_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);
    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Category</th><th>Winter efficiency (space heating)</th><th>Summer efficiency (water heating)</th><th>Central heating pump (kWh/year)</th><th>Fans and supply pumps (kWh/year)<i class="icon-question-sign" title="Taken into account for Warm air systems" /></th><th>Responsiveness</th><th>Combi loss</th><th>Primary circuit loss<i class="icon-question-sign" title="No primary loss for the following:\n\   - Electric inmersion heater.\n\   - Combi boiler\n\   - CPSU(including electric CPSU)\n\   - Boiler and thermal store within a single casing\n\   - Separate boiler and thermal store connected by no more than 1.5m of insulated pipework\n\ \n\For other cases (indirect cylinders and thermal stores connected by unsinsulated pipework or more than 1.5m of insulated pipework) the loss is calculated according to the amount of insulated pipework and the type of storage heating controls (in the Hot Water System section) - SAP2012 table 3, p. 199" /></th><th>Description</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="category"><select class="w200" value="' + item.category + '">'
            var categories = ['Combi boilers', 'System boilers', 'Heat pumps', 'Room heaters', 'Warm air systems', 'Hot water only'];
            for (index in categories) {
                if (item.category == categories[index])
                    out += '<option value="' + categories[index] + '" selected>' + categories[index] + '</option>';
                else
                    out += '<option value="' + categories[index] + '">' + categories[index] + '</option>';
            }
            out += '</select></td>';
            out += '<td index="winter_efficiency"><input class="w150" type="number" min="0" max="100" step="1" value="' + item.winter_efficiency + '" /></td>';
            out += '<td index="summer_efficiency"><input class="w150" type="number" min="0" max="100" step="1" value="' + item.summer_efficiency + '" /></td>';
            out += '<td index="central_heating_pump"><input class="w150" type="number" min="0" step="1" value="' + item.central_heating_pump + '" /></td>';
            out += '<td index="fans_and_supply_pumps"><input class="w150" type="number" min="0" step="1" value="' + item.fans_and_supply_pumps + '" /></td>';
            out += '<td index="responsiveness"><input class="w100" type="number" min="0" step="0.1" value="' + item.responsiveness + '" /></td>';
            out += '<td index="combi_loss"><select class="w200" value="' + item.combi_loss + '">'
            var options = ['0', 'Instantaneous, without keep hot-facility', 'Instantaneous, with keep-hot facility controlled by time clock', 'Instantaneous, with keep-hot facility not controlled by time clock', 'Storage combi boiler >= 55 litres', 'Storage combi boiler < 55 litres'];
            for (index in options) {
                if (item.instantaneous_water_heating == options[index])
                    out += '<option value="' + options[index] + '" selected>' + options[index] + '</option>';
                else
                    out += '<option value="' + options[index] + '">' + options[index] + '</option>';
            }
            out += '</select></td>';
            out += '<td index="primary_circuit_loss"><select class="w150" value="' + item.primary_circuit_loss + '">'
            var options = ['Yes', 'No'];
            for (index in options) {
                if (item.primary_circuit_loss == options[index])
                    out += '<option value="' + options[index] + '" selected>' + options[index] + '</option>';
                else
                    out += '<option value="' + options[index] + '">' + options[index] + '</option>';
            }
            out += '</select></td>';
            out += '<td index="source" title="' + item.name + '"><input class="w300" type="text" value="' + item.source + '" /></td>';
            //out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.heating_systems_measures_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);
    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Category</th><th>Winter efficiency (space heating)</th><th>Summer efficiency (water heating)</th><th>Central heating pump (kWh/year)</th><th>Fans and supply pumps (kWh/year)<i class="icon-question-sign" title="Taken into account for Warm air systems" /></th><th>Responsiveness</th><th>Combi loss</th><th>Primary circuit loss<i class="icon-question-sign" title="No primary loss for the following:\n\   - Electric inmersion heater.\n\   - Combi boiler\n\   - CPSU(including electric CPSU)\n\   - Boiler and thermal store within a single casing\n\   - Separate boiler and thermal store connected by no more than 1.5m of insulated pipework\n\ \n\For other cases (indirect cylinders and thermal stores connected by unsinsulated pipework or more than 1.5m of insulated pipework) the loss is calculated according to the amount of insulated pipework and the type of storage heating controls (in the Hot Water System section) - SAP2012 table 3, p. 199" /></th><th>Source</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="category"><select class="w200" value="' + item.category + '">'
            var categories = ['Combi boilers', 'System boilers', 'Heat pumps', 'Room heaters', 'Warm air systems', 'Hot water only'];
            for (index in categories) {
                if (item.category == categories[index])
                    out += '<option value="' + categories[index] + '" selected>' + categories[index] + '</option>';
                else
                    out += '<option value="' + categories[index] + '">' + categories[index] + '</option>';
            }
            out += '</select></td>';
            out += '<td index="winter_efficiency"><input class="w150" type="number" min="0" max="100" step="1" value="' + item.winter_efficiency + '" /></td>';
            out += '<td index="summer_efficiency"><input class="w150" type="number" min="0" max="100" step="1" value="' + item.summer_efficiency + '" /></td>';
            out += '<td index="central_heating_pump"><input class="w150" type="number" min="0" step="1" value="' + item.central_heating_pump + '" /></td>';
            out += '<td index="fans_and_supply_pumps"><input class="w150" type="number" min="0" step="1" value="' + item.fans_and_supply_pumps + '" /></td>';
            out += '<td index="responsiveness"><input class="w100" type="number" min="0" step="0.1" value="' + item.responsiveness + '" /></td>';
            out += '<td index="combi_loss"><select class="w200" value="' + item.combi_loss + '">'
            var options = ['0', 'Instantaneous, without keep hot-facility', 'Instantaneous, with keep-hot facility controlled by time clock', 'Instantaneous, with keep-hot facility not controlled by time clock', 'Storage combi boiler >= 55 litres', 'Storage combi boiler < 55 litres'];
            for (index in options) {
                if (item.instantaneous_water_heating == options[index])
                    out += '<option value="' + options[index] + '" selected>' + options[index] + '</option>';
                else
                    out += '<option value="' + options[index] + '">' + options[index] + '</option>';
            }
            out += '</select></td>';
            out += '<td index="primary_circuit_loss"><select class="w150" value="' + item.primary_circuit_loss + '">'
            var options = ['Yes', 'No'];
            for (index in options) {
                if (item.primary_circuit_loss == options[index])
                    out += '<option value="' + options[index] + '" selected>' + options[index] + '</option>';
                else
                    out += '<option value="' + options[index] + '">' + options[index] + '</option>';
            }
            out += '</select></td>';
            out += '<td index="source" title="' + item.name + '"><input class="w300" type="text" value="' + item.source + '" /></td>';
            out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.appliances_and_cooking_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Category</th><th>Norm demand</th><th>Units</th><th>Utilisation factor</th><th>Frequency</th><th>Reference quantity</th><th>Type of fuel</th><th>Efficiency</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w200" type="text" value="' + item.name + '" /></td>';
            out += '<td index="category"><select class="w150" value="' + item.category + '">'
            var categories = ['Computing', 'Cooking', 'Food storage', 'Other kitchen / cleaning', 'Laundry', 'Miscelanea', 'TV'];
            for (index in categories) {
                if (item.category == categories[index])
                    out += '<option value="' + categories[index] + '" selected>' + categories[index] + '</option>';
                else
                    out += '<option value="' + categories[index] + '">' + categories[index] + '</option>';
            }
            out += '</select></td>';
            out += '<td index="norm_demand"><input class="w100" type="number" min="0" step="1" value="' + item.norm_demand + '" /></td>';
            out += '<td index="units" title="' + item.units + '"><input class="w100" type="text" value="' + item.units + '" /></td>';
            out += '<td index="utilisation_factor"><input class="w100" type="number" min="0" step="1" value="' + item.utilisation_factor + '" /></td>';
            out += '<td index="frequency"><input class="w100" type="number" min="0" step="1" value="' + item.frequency + '" /></td>';
            out += '<td index="reference_quantity"><input class="w100" type="number" min="0" step="1" value="' + item.reference_quantity + '" /></td>';
            out += '<td index="type_of_fuel"><select class="w100" value="' + item.type_of_fuel + '">'
            var types_of_fuel = ['Gas', 'Oil', 'Solid fuel', 'Electricity'];
            for (index in types_of_fuel) {
                if (item['type_of_fuel'] == types_of_fuel[index])
                    out += '<option value="' + types_of_fuel[index] + '" selected>' + types_of_fuel[index] + '</option>';
                else
                    out += '<option value="' + types_of_fuel[index] + '">' + types_of_fuel[index] + '</option>';
            }
            out += '</select></td>';
            out += '<td index="efficiency"><input class="w50" type="number" min="0" max="1" step="0.01" value="' + item.efficiency + '" /></td>';
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.clothes_drying_facilities_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Source</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="source" title="' + item.source + '"><input class="w200" type="text" value="' + item.source + '" /></td>';
            out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.space_heating_control_type_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Control type</th><th>Source</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="control_type"><input class="w100" type="number" min="0" step="0.1" value="' + item.control_type + '" /></td>';

            out += '<td index="source" title="' + item.source + '"><input class="w200" type="text" value="' + item.source + '" /></td>';
            out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.hot_water_control_type_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Hot water storage control type</th><th>Source</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="control_type"><select class="w200" value="' + item.control_type + '">'
            out += item.control_type == 'Cylinder thermostat, water heating not separately timed' ? '<option value="Cylinder thermostat, water heating not separately timed" selected>Cylinder thermostat, water heating not separately timed</option>' : '<option value="Cylinder thermostat, water heating not separately timed">Cylinder thermostat, water heating not separately timed</option>';
            out += item.control_type == 'Cylinder thermostat, water heating separately timed' ? '<option value="Cylinder thermostat, water heating separately timed" selected>Cylinder thermostat, water heating separately timed</option>' : '<option value="Cylinder thermostat, water heating separately timed">Cylinder thermostat, water heating separately timed</option>';
            out += '</select></td>';
            out += '<td index="source" title="' + item.source + '"><input class="w200" type="text" value="' + item.source + '" /></td>';
            out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.intentional_vents_and_flues_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Source</th><th>Type</th><th>Ventilation rate (m<sup>3</sup>/h)</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="source" title="' + item.source + '"><input class="w200" type="text" value="' + item.source + '" /></td>';
            out += '<td index="type"><select class="w200" value="' + item.type + '">'
            out += item.type === 'Chimney' ? '<option value="Chimney" selected>Chimney</option>' : '<option value="Chimney">Chimney</option>';
            out += item.type === 'Open Flue' ? '<option value="Open flue" selected>Open Flue</option>' : '<option value="Open Flue">Open Flue</option>';
            out += item.type === 'Flueless gas fire' ? '<option value="Flueless gas fire" selected>Flueless gas fire</option>' : '<option value="Flueless gas fire">Flueless gas fire</option>';
            out += item.type === 'Measure' ? '<option value="Measure" selected>Measure</option>' : '<option value="Measure">Measure</option>';
            out += '</select></td>';
            out += '<td index="ventilation_rate"><input class="w100" type="number" min="0" step="1" value="' + item.ventilation_rate + '" /></td>';
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.intentional_vents_and_flues_measures_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Source</th><th>Type</th><th>Ventilation rate (m<sup>3</sup>/h)</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="source" title="' + item.source + '"><input class="w200" type="text" value="' + item.source + '" /></td>';
            out += '<td index="type"><select class="w200" value="' + item.type + '">'
            out += item.type === 'Chimney' ? '<option value="Chimney" selected>Chimney</option>' : '<option value="Chimney">Chimney</option>';
            out += item.type === 'Open Flue' ? '<option value="Open flue" selected>Open Flue</option>' : '<option value="Open Flue">Open Flue</option>';
            out += item.type === 'Flueless gas fire' ? '<option value="Flueless gas fire" selected>Flueless gas fire</option>' : '<option value="Flueless gas fire">Flueless gas fire</option>';
            out += item.type === 'Measure' ? '<option value="Measure" selected>Measure</option>' : '<option value="Measure">Measure</option>';
            out += '</select></td>';
            out += '<td index="ventilation_rate"><input class="w100" type="number" min="0" step="1" value="' + item.ventilation_rate + '" /></td>';
            out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.pipework_insulation_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Amount of pipework insulation</th><th>Source</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="SELECT"><select class="w200" value="' + item.SELECT + '">'
            out += item.pipework_insulation == 'First 1m from cylinder insulated' ? '<option value="First 1m from cylinder insulated" selected>First 1m from cylinder insulated</option>' : '<option value="First 1m from cylinder insulated">First 1m from cylinder insulated</option>';
            out += item.pipework_insulation == 'All accesible piperwok insulated' ? '<option value="All accesible piperwok insulated" selected>All accesible piperwok insulated</option>' : '<option value="All accesible piperwok insulated">All accesible piperwok insulated</option>';
            out += item.pipework_insulation == 'Fully insulated primary pipework' ? '<option value="Fully insulated primary pipework" selected>Fully insulated primary pipework</option>' : '<option value="Fully insulated primary pipework">Fully insulated primary pipework</option>';
            out += '</select></td>';
            out += '<td index="source" title="' + item.source + '"><input class="w200" type="text" value="' + item.source + '" /></td>';
            out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.storage_type_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Category</th><th>Storage volume</th><th>Manufacturer\' declared loss factor known</th><th>Hot water storage loss factor (kWh/litre/day)</th><th>Volume factor</th><th>Temperature factor</th><th>Source</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="category"><select class="w200" value="' + item.category + '">'
            var categories = ['Cylinders with inmersion', 'Indirectly heated cylinders'];
            for (index in categories) {
                if (item.category == categories[index])
                    out += '<option value="' + categories[index] + '" selected>' + categories[index] + '</option>';
                else
                    out += '<option value="' + categories[index] + '">' + categories[index] + '</option>';
            }
            out += '</select></td>';
            out += '<td index="storage_volume"><input class="w100" type="number" min="0" step="0.1" value="' + item.storage_volume + '" /></td>';
            out += '<td index="manufacturer_loss_factor"><input type="checkbox"' + (item.manufacturer_loss_factor === true ? 'checked' : '') + ' /></td>';
            out += '<td index="loss_factor_b"><input class="w350" type="number" min="0" step="0.001" value="' + item.loss_factor_b + '" /></td>';
            out += '<td index="volume_factor_b"><input class="w50" type="number" min="0" step="0.1" value="' + item.volume_factor_b + '" /></td>';
            out += '<td index="temperature_factor_b"><input class="w50" type="number" min="0" step="0.1" value="' + item.temperature_factor_b + '" /></td>';
            out += '<td index="source" title="' + item.source + '"><input class="w200" type="text" value="' + item.source + '" /></td>';
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.storage_type_measures_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Category</th><th>Storage volume</th><th>Manufacturer\' declared loss factor known</th><th>Hot water storage loss factor (kWh/litre/day)</th><th>Volume factor</th><th>Temperature factor</th><th>Source</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="category"><select class="w200" value="' + item.category + '">'
            var categories = ['Cylinders with inmersion', 'Indirectly heated cylinders'];
            for (index in categories) {
                if (item.category == categories[index])
                    out += '<option value="' + categories[index] + '" selected>' + categories[index] + '</option>';
                else
                    out += '<option value="' + categories[index] + '">' + categories[index] + '</option>';
            }
            out += '</select></td>';
            out += '<td index="storage_volume"><input class="w100" type="number" min="0" step="0.1" value="' + item.storage_volume + '" /></td>';
            out += '<td index="manufacturer_loss_factor"><input type="checkbox"' + (item.manufacturer_loss_factor === true ? 'checked' : '') + ' /></td>';
            out += '<td index="loss_factor_b"><input class="w350" type="number" min="0" step="0.001" value="' + item.loss_factor_b + '" /></td>';
            out += '<td index="volume_factor_b"><input class="w50" type="number" min="0" step="0.1" value="' + item.volume_factor_b + '" /></td>';
            out += '<td index="temperature_factor_b"><input class="w50" type="number" min="0" step="0.1" value="' + item.temperature_factor_b + '" /></td>';
            out += '<td index="source" title="' + item.source + '"><input class="w200" type="text" value="' + item.source + '" /></td>';
            out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};
libraryHelper.prototype.water_usage_library_to_html_edit_mode = function (origin, library_id) {
    var out = "";
    var selected_library = this.get_library_by_id(library_id);
    var library = selected_library.data;
    var library_id = selected_library.id;
    this.orderObjectsByKeys(library);

    var out = '<div><table><tr><th>Tag</th><th>Name</th><th>Source</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Cost units</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th><th></th></tr>';
    if (Object.keys(library).length == 0)
        out += '';
    else {
        for (z in library) {
            var item = library[z];
            out += '<tr tag="' + z + '" title="' + z + '" class="item"><td index="tag"><input class="w100" type="text" value="' + z + '" /></td>';
            out += '<td index="name" title="' + item.name + '"><input class="w350" type="text" value="' + item.name + '" /></td>';
            out += '<td index="source" title="' + item.source + '"><input class="w200" type="text" value="' + item.source + '" /></td>';
            out += this.measure_fields_for_library_to_html_edit_mode(item);
            out += '<td><i class="icon-trash if-write delete-library-item" tag="' + z + '" library="' + library_id + '" style="cursor:pointer;margin-left:10px;margin-right:20px"></i></td>';
            out += '</tr>';
        }
    }
    out += '</table></div>';
    return out;
};

/**********************************************
 * Items to html
 **********************************************/
libraryHelper.prototype.systems_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: 'name', efficiency: 1.0, winter: 1.0, summer: 1.0, fuel: 'electric', fans_and_pumps: 0, combi_keep_hot: 0, description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>System tag</td><td><input type="text" class="edit-system-tag item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="edit-system-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>Default efficiency</td><td><input type="text" class="edit-system-efficiency editable-field" value="' + item.efficiency + '" /></td></tr>';
    out += '<tr><td>Winter efficiency</td><td><input type="text" class="edit-system-winter editable-field" value="' + item.winter + '" /></td></tr>';
    out += '<tr><td>Summer efficiency</td><td><input type="text" class="edit-system-summer editable-field" value="' + item.summer + '" /></td></tr>';
    out += '<tr><td>Pumps and fans (kWh/year) <i class="icon-question-sign" title="Include here electricity for central heating pump, oil boiler pump, any flue fan and/or warm air heating systems"></i></td><td><input type="text" class="edit-system-fans_and_pumps editable-field" value="' + item.fans_and_pumps + '" /></td></tr>';
    out += '<tr><td>Keep hot facility, combi boilers only (kWh/year)</td><td><input type="text" class="editable-field edit-system-combi_keep_hot" value="' + item.combi_keep_hot + '" /></td></tr>';
    out += '<tr><td>Fuel</td><td><select class="edit-system-fuel editable-field" default="' + item.fuel + '">';
    for (fuel in datasets.fuels) {
        if (fuel == item.fuel)
            out += '<option value="' + fuel + '" selected>' + fuel + '</option>';
        else
            out += '<option value="' + fuel + '">' + fuel + '</option>';
    }
    out += '</select></td></tr>';
    out += '<tr><td colspan="2">Fields to be taken into account when using the element as a Measure</td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="edit-system-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="edit-system-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="edit-system-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="edit-system-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="edit-system-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="edit-system-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="edit-system-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="edit-system-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="edit-system-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="edit-system-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.elements_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: 'New name', EWI: false, uvalue: 1.0, kvalue: 1.0, tags: ['Wall'], location: '',
            source: "", description: "", performance: "", benefits: "", cost: "",
            who_by: "", disruption: "", associated_work: "", key_risks: "", notes: "",
            maintenance: "", };
    else if (tag != undefined)
        item.tag = tag;
    var type = "";
    if (item.tags != undefined)
        type = item.tags[0];
    else if (item.type != undefined) {
        type = item.type.charAt(0).toUpperCase() + item.type.slice(1); // Ensure first letter is capital
        item.tags = [type];
    }
    else {
        item.tags = ['Wall'];
        type = 'Wall';
    }
    /*if (item.tags != undefined)
     var type = item.tags[0];
     else {
     var type = 'Wall';
     item.tags = ['Wall'];
     }*/

    var out = '<div class="input-prepend"><span class="add-on">Type</span><select class="create-element-type editable-field">';
    out += type == 'Wall' ? '<option value="Wall" selected>Wall</option>' : '<option value = "Wall" > Wall </option>';
    if (type == 'party_wall' || type == 'Party_wall')
        out += '<option value="Party_wall" selected>Party wall</option>';
    else
        out += '<option value="Party_wall">Party wall</option>';
    out += type == 'Roof' ? '<option value="Roof" selected>Roof</option>' : '<option value="Roof">Roof</option>';
    out += type == 'Loft' ? '<option value="Loft" selected>Loft</option>' : '<option value="Loft">Loft</option>';
    out += type == 'Floor' ? '<option value="Floor" selected>Floor</option>' : '<option value="Floor">Floor</option>';
    out += type == 'Window' ? ' <option value = "Window" selected > Window </option>' : '<option value="Window">Window</option> ';
    out += type == 'Door' ? ' <option value = "Door" selected > Door </option>' : '<option value="Door">Door</option> ';
    out += type == 'Roof_light' ? ' <option value = "Roof_light" selected > Roof light </option>' : '<option value="Roof_light">Roof light</option> ';
    out += type == 'Hatch' ? ' <option value = "Hatch" selected > Hatch </option>' : '<option value="Hatch">Hatch</option> ';
    out += '</select></div>';
    out += '<table class="table">';
    out += '<tr><td>Tag</td><td><input type="text" class="create-element-tag item-tag" value="' + item.tag + '" /></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="create-element-name" value="' + item.name + '" /></td></tr>';
    //out += '<tr><td>Description</td><td><input type="text" class="create-element-description" value="' + item.description + '" /></td></tr>';
    //out += '<tr><td>Location</td><td><input type="text" class="create-element-location" value="' + item.location + '" /></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="create-element-source" value="' + item.source + '" /></td></tr>';
    out += '<tr><td>U-value</td><td><input type="text" class="create-element-uvalue editable-field" value="' + item.uvalue + '" /></td></tr>';
    out += '<tr><td>K-value</td><td><input type="text" class="create-element-kvalue editable-field" value="' + item.kvalue + '" /></td></tr>';
    if (type == 'Window' || type == 'Door' || type == 'Roof_light') {
        out += '<tr><td>g</td><td><input type="text" class="create-element-g window-element editable-field" value="' + item.g + '" /></td></tr>';
        out += '<tr><td>gL</td><td><input type="text" class="create-element-gL window-element editable-field" value="' + item.gL + '" /></td></tr>';
        out += '<tr><td>Frame factor (ff)</td><td><input type="text" class="create-element-ff editable-field window-element" value="' + item.ff + '" /></td></tr>';
    }
    else {
        out += '<tr class="window-element" style="display:none"><td>g</td><td><input type="text" class="create-element-g window-element editable-field" value="1" /></td></tr>';
        out += '<tr class="window-element" style="display:none"><td>gL</td><td><input type="text" class="create-element-gL window-element editable-field" value="1" /></td></tr>';
        out += '<tr class="window-element" style="display:none" ><td>Frame factor (ff)</td><td><input type="text" class="create-element-ff editable-field window-element" value="1" /></td></tr>';
    }
    out += '</table>';
    return out;
};
libraryHelper.prototype.elements_measures_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: 'New name', EWI: false, uvalue: 1.0, kvalue: 1.0, tags: ['Wall'], location: '',
            source: "", description: "", performance: "", benefits: "", cost: "",
            who_by: "", disruption: "", associated_work: "", key_risks: "", notes: "",
            maintenance: "", };
    else if (tag != undefined)
        item.tag = tag;
    var type = "";
    if (item.tags != undefined)
        type = item.tags[0];
    else if (item.type != undefined) {
        type = item.type.charAt(0).toUpperCase() + item.type.slice(1); // Ensure first letter is capital
        item.tags = [type];
    }
    else {
        item.tags = ['Wall'];
        type = 'Wall';
    }

    var out = this.elements_item_to_html(item, tag);
    out += '<table><tr><td colspan="2">Fields to be taken into account when using the element as a Measure</td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="create-element-description" >' + item.description + '</textarea></td></tr>';
    if (item.tags[0] == 'Wall' || item.tags[0] == 'wall') {
        if (item.EWI === true)
            out += '<tr class="EWI-row"><td>EWI <i class="icon-question" title="Ticking this box will increase the area of the wall by 1.15" /></td><td><input style="margin-bottom:10px" type="checkbox" class="create-element-ewi" checked /></td></tr>';
        else
            out += '<tr class="EWI-row"><td>EWI <i class="icon-question" title="Ticking this box will increase the area of the wall by 1.15" /></td><td><input style="margin-bottom:10px" type="checkbox" class="create-element-ewi"  /></td></tr>';
    }
    out += '<tr><td>Performance</td><td><input type="text" class="create-element-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="create-element-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Minimum cost  <icon class="icon-question-sign" title="Total cost of measure = minimum cost + (area x unit cost)" /></td><td><input type="number" min="0" step="1" class="create-element-min_cost" value="' + item.min_cost + '" /></td></tr>';
    out += '<tr><td>Cost per unit</td><td><input type="numer" min="0" step="1" class="create-element-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="create-element-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="create-element-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="create-element-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="create-element-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="create-element-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="create-element-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</table>';
    return out;
};
libraryHelper.prototype.draught_proofing_measures_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: 'name', q50: 1.0, description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>q50 (m<sup>3</sup>/hm<sup>2</sup>)</td><td><input type="text" class="item-q50" value="' + item.q50 + '" /></td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.ventilation_systems_measures_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: 'name', ventilation_type: 'NV', system_air_change_rate: 0, heat_recovery_efficiency: 0, specific_fan_power: 3, source: '--', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>Ventilation type</td><td><select class="item-ventilation_type">';
    out += item.ventilation_type == 'NV' ? '<option value="NV" selected>Natural ventilation only (NV)</option>' : '<option value="NV">Natural ventilation only (NV)</option>';
    out += item.ventilation_type == 'IE' ? '<option value="IE" selected>Intermittent extract ventilation (IE)</option>' : '<option value="IE">Intermittent extract ventilation (IE)</option>';
    out += item.ventilation_type == 'DEV' ? '<option value="DEV" selected>Continuous decentralised mechanical extract ventilation (DEV)</option>' : '<option value="DEV">Continuous decentralised mechanical extract ventilation (DEV)</option>';
    out += item.ventilation_type == 'MEV' ? '<option value="MEV" selected>Continuous whole house extract ventilation (MEV)</option>' : '<option value="MEV">Continuous whole house extract ventilation (MEV)</option>';
    out += item.ventilation_type == 'MV' ? '<option value="MV" selected>Balanced mechanical ventilation without heat recovery (MV)</option>' : '<option value="MV">Balanced mechanical ventilation without heat recovery (MV)</option>';
    out += item.ventilation_type == 'MVHR' ? '<option value="MVHR" selected>Balanced mechanical ventilation with heat recovery (MVHR)</option>' : '<option value="MVHR">Balanced mechanical ventilation with heat recovery (MVHR)</option>';
    out += item.ventilation_type == 'PS' ? '<option value="PS" selected>Whole House Passive Stack Ventilation System (PS)</option>' : '<option value="PS">Whole House Passive Stack Ventilation System (PS)</option>';
    out += '</select></td></tr>';
    if (item.ventilation_type == 'DEV' || item.ventilation_type == 'MEV' || item.ventilation_type == 'MVHR' || item.ventilation_type == 'MV') {
        out += '<tr><td>Air change rate - ach</td><td><input type="text" class="item-air_change_rate" value="' + item.system_air_change_rate + '" /></td></tr>';
        out += '<tr><td>Specific Fan Power - W/(litre.sec)</td><td><input type="text" class="item-specific_fan_power" value="' + item.specific_fan_power + '" /></td></tr>';
    }
    else
    {
        out += '<tr style="display:none"><td>Air change rate - ach</td><td><input type="text" class="item-air_change_rate" value="' + item.system_air_change_rate + '" /></td></tr>';
        out += '<tr style="display:none"><td>Specific Fan Power - W/(litre.sec)</td><td><input type="text" class="item-specific_fan_power" value="' + item.specific_fan_power + '" /></td></tr>';
    }
    if (item.ventilation_type == 'MVHR')
        out += '<tr><td>Balanced heat recovery efficiency (%)</td><td><input type="text" class="item-heat_recovery_efficiency" value="' + item.balanced_heat_recovery_efficiency + '" /></td></tr>';
    else
        out += '<tr style="display:none"><td>Heat recovery efficiency</td><td><input type="text" class="item-heat_recovery_efficiency" value="' + item.balanced_heat_recovery_efficiency + '" /></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" required value="' + item.source + '"/></td></tr>';
    out += '<tr><td colspan="2">Fields to be taken into account when using the element as a Measure</td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    // Show hide "air change rate", "specific fan power" and "heat recovery efficiannecy" accordint to the ventilation system
    if (item.ventilation_type == 'DEV' || item.ventilation_type == 'MEV' || item.ventilation_type == 'MVHR' || item.ventilation_type == 'MV')
    {
        $('.item-air_change_rate').parent().parent().show('fast');
        $('.item-specific_fan_power').parent().parent().show('fast');
    }
    else
    {
        $('.item-air_change_rate').parent().parent().hide('fast');
        $('.item-specific_fan_power').parent().parent().hide('fast');
    }
    if (item.ventilation_type == 'MVHR')
        $('.item-heat_recovery_efficiency').parent().parent().show('fast');
    else
        $('.item-heat_recovery_efficiency').parent().parent().hide('fast');
    return out;
};
libraryHelper.prototype.ventilation_systems_item_to_html = function (item, tag) {
    console.log('asd');
    if (item == undefined)
        item = {tag: '', name: 'name', ventilation_type: 'NV', system_air_change_rate: 0, heat_recovery_efficiency: 0, specific_fan_power: 3, source: '--', };
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>Ventilation type</td><td><select class="item-ventilation_type">';
    out += item.ventilation_type == 'NV' ? '<option value="NV" selected>Natural ventilation only (NV)</option>' : '<option value="NV">Natural ventilation only (NV)</option>';
    out += item.ventilation_type == 'IE' ? '<option value="IE" selected>Intermittent extract ventilation (IE)</option>' : '<option value="IE">Intermittent extract ventilation (IE)</option>';
    out += item.ventilation_type == 'DEV' ? '<option value="DEV" selected>Continuous decentralised mechanical extract ventilation (DEV)</option>' : '<option value="DEV">Continuous decentralised mechanical extract ventilation (DEV)</option>';
    out += item.ventilation_type == 'MEV' ? '<option value="MEV" selected>Continuous whole house extract ventilation (MEV)</option>' : '<option value="MEV">Continuous whole house extract ventilation (MEV)</option>';
    out += item.ventilation_type == 'MV' ? '<option value="MV" selected>Balanced mechanical ventilation without heat recovery (MV)</option>' : '<option value="MV">Balanced mechanical ventilation without heat recovery (MV)</option>';
    out += item.ventilation_type == 'MVHR' ? '<option value="MVHR" selected>Balanced mechanical ventilation with heat recovery (MVHR)</option>' : '<option value="MVHR">Balanced mechanical ventilation with heat recovery (MVHR)</option>';
    out += item.ventilation_type == 'PS' ? '<option value="PS" selected>Whole House Passive Stack Ventilation System (PS)</option>' : '<option value="PS">Whole House Passive Stack Ventilation System (PS)</option>';
    out += '</select></td></tr>';
    if (item.ventilation_type == 'DEV' || item.ventilation_type == 'MEV' || item.ventilation_type == 'MVHR' || item.ventilation_type == 'MV')
    {
        out += '<tr><td>Air change rate - ach</td><td><input type="text" class="item-air_change_rate" value="' + item.system_air_change_rate + '" /></td></tr>';
        out += '<tr><td>Specific Fan Power - W/(litre.sec)</td><td><input type="text" class="item-specific_fan_power" value="' + item.specific_fan_power + '" /></td></tr>';
    }
    else
    {
        out += '<tr style="display:none"><td>Air change rate - ach</td><td><input type="text" class="item-air_change_rate" value="' + item.system_air_change_rate + '" /></td></tr>';
        out += '<tr style="display:none"><td>Specific Fan Power - W/(litre.sec)</td><td><input type="text" class="item-specific_fan_power" value="' + item.specific_fan_power + '" /></td></tr>';
    }
    if (item.ventilation_type == 'MVHR')
        out += '<tr><td>Balanced heat recovery efficiency (%)</td><td><input type="text" class="item-heat_recovery_efficiency" value="' + item.balanced_heat_recovery_efficiency + '" /></td></tr>';
    else
        out += '<tr style="display:none"><td>Heat recovery efficiency</td><td><input type="text" class="item-heat_recovery_efficiency" value="' + item.balanced_heat_recovery_efficiency + '" /></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" required value="' + item.source + '"/></td></tr>';
    out += '</tbody></table>';
    // Show hide "air change rate" and "heat recovery efficiannecy" accordint to the ventilation system
    if (item.ventilation_type == 'DEV' || item.ventilation_type == 'MEV' || item.ventilation_type == 'MVHR' || item.ventilation_type == 'MV')
    {
        // $('.item-air_change_rate').parent().parent().show('fast');
        $('.item-specific_fan_power').parent().parent().show('fast');
    }
    else
    {
        //$('.item-air_change_rate').parent().parent().hide('fast');
        $('.item-specific_fan_power').parent().parent().hide('fast');
    }
    if (item.ventilation_type == 'MVHR')
        $('.item-heat_recovery_efficiency').parent().parent().show('fast');
    else
        $('.item-heat_recovery_efficiency').parent().parent().hide('fast');
    return out;
};
libraryHelper.prototype.extract_ventilation_points_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: 'name', ventilation_rate: 25, description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" value="' + item.name + '" /></td></tr>';
    //out += '<tr><td>Location</td><td><input type="text" class="item-location" value="' + item.location + '" /></td></tr>';
    out += '<tr><td>Type</td><td><select class="item-type">';
    out += item.type === 'Intermittent fan' ? '<option value="Intermittent fan" selected>Intermittent fan</option>' : '<option value="Intermittent fan">Intermittent fan</option>';
    out += item.type === 'Passive vent' ? '<option value="Passive vent" selected>Passive vent</option>' : '<option value="Passive vent">Passive vent</option>';
    out += '</select></td></tr>';
    out += '<tr><td>Ventilation rate</td><td><input type="number" class="item-ventilation-rate" value="' + item.ventilation_rate + '" /></td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
/*libraryHelper.prototype.extract_ventilation_points_measures_item_to_html = function (item, tag) {
 if (item == undefined)
 item = {tag: '', name: 'name', number_of_intermittentfans_to_add: 1, description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
 else if (tag != undefined)
 item.tag = tag;
 var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
 out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
 out += '<tr><td>Name</td><td><input type="text" class="item-name" value="' + item.name + '" /></td></tr>';
 out += '<tr><td>Number of intermittent fans to add</td><td><input type="number" class="item-intermitent_fans" value="' + item.number_of_intermittentfans_to_add + '" /></td></tr>';
 out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
 out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
 out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
 out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
 out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
 out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
 out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
 out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
 out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
 out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
 out += '</tbody></table>';
 return out;
 };*/
libraryHelper.prototype.intentional_vents_and_flues_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: 'name', source: '--', type: 'Chimney', ventilation_rate: 40, description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" value="' + item.source + '" /></td></tr>';
    out += '<tr><td>Type</td><td><select class="item-type">';
    out += item.type === 'Chimney' ? '<option value="Chimney" selected>Chimney</option>' : '<option value="Chimney">Chimney</option>';
    out += item.type === 'Open Flue' ? '<option value="Open flue" selected>Open Flue</option>' : '<option value="Open Flue">Open Flue</option>';
    out += item.type === 'Flueless gas fire' ? '<option value="Flueless gas fire" selected>Flueless gas fire</option>' : '<option value="Flueless gas fire">Flueless gas fire</option>';
    out += item.type === 'Measure' ? '<option value="Measure" selected>Measure</option>' : '<option value="Measure">Measure</option>';
    out += '</select></td></tr>';
    out += '<tr><td>Ventilation rate (m<sup>3</sup>/h)</td><td><input type="number" class="item-ventilation_rate" value="' + item.ventilation_rate + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.intentional_vents_and_flues_measures_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: 'name', source: '--', type: 'Chimney', ventilation_rate: 40, description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" value="' + item.source + '" /></td></tr>';
    out += '<tr><td>Type</td><td><select class="item-type">';
    out += item.type === 'Chimney' ? '<option value="Chimney" selected>Chimney</option>' : '<option value="Chimney">Chimney</option>';
    out += item.type === 'Open Flue' ? '<option value="Open flue" selected>Open Flue</option>' : '<option value="Open Flue">Open Flue</option>';
    out += item.type === 'Flueless gas fire' ? '<option value="Flueless gas fire" selected>Flueless gas fire</option>' : '<option value="Flueless gas fire">Flueless gas fire</option>';
    out += item.type === 'Measure' ? '<option value="Measure" selected>Measure</option>' : '<option value="Measure">Measure</option>';
    out += '</select></td></tr>';
    out += '<tr><td>Ventilation rate (m<sup>3</sup>/h)</td><td><input type="number" class="item-ventilation_rate" value="' + item.ventilation_rate + '" /></td></tr>';
    out += '<tr><td colspan="2">Fields to be taken into account when using the item as a Measure</td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.water_usage_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: 'name', source: '--', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="water-efficiency-item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="water-efficiency-item-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="water-efficiency-item-source" value="' + item.source + '" /></td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="water-efficiency-item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="water-efficiency-item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="water-efficiency-item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="water-efficiency-item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="water-efficiency-item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="water-efficiency-item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="water-efficiency-item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="water-efficiency-item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="water-efficiency-item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="water-efficiency-item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.storage_type_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: "name", manufacturer_loss_factor: 0, temperature_factor_a: 0, storage_volume: 0, loss_factor_b: 0, volume_factor_b: 0, temperature_factor_b: 0, insulation_type: 'very thick', declared_loss_factor_known: true, source: '--', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>Category </td><td><select class="item-category">';
    var categories = ['Cylinders with inmersion', 'Indirectly heated cylinders'];
    for (index in categories) {
        if (item.category == categories[index])
            out += '<option value="' + categories[index] + '" selected>' + categories[index] + '</option>';
        else
            out += '<option value="' + categories[index] + '">' + categories[index] + '</option>';
    }
    out += '</select></td></tr>';
    out += '<tr><td>Storage volume</td><td><input type="number" min="0" class="item-storage_volume" value="' + item.storage_volume + '" /></td></tr>';
    out += '<tr><td>Insulation type</td><td><input type="text" class="item-insulation_type" value="' + item.insulation_type + '" /></td></tr>';
    if (item.declared_loss_factor_known === true)
        out += '<tr><td>Manufacturer\' declared loss factor known</td><td><input type="checkbox" class="item-declared_loss_factor_known" checked  /></td></tr>';
    else
        out += '<tr><td>Manufacturer\' declared loss factor known</td><td><input type="checkbox" class="item-declared_loss_factor_known" /></td></tr>';
    out += '<tr class="if-declared-loss-factor"><td>Manufacturer\'s declared loss factor (kWh/day)</td><td><input type="number" min="0" class="item-manufacturer_loss_factor" value="' + item.manufacturer_loss_factor + '" /></td></tr>';
    out += '<tr class="if-declared-loss-factor"><td>Temperature factor</td><td><input type="number" min="0" class="item-temperature_factor_a" value="' + item.temperature_factor_a + '" /></td></tr>';
    out += '<tr class="if-not-declared-loss-factor"><td>Hot water storage loss factor (kWh/litre/day)</td><td><input type="text" class="item-loss_factor_b" value="' + item.loss_factor_b + '" /></td></tr>';
    out += '<tr class="if-not-declared-loss-factor"><td>Volume factor</td><td><input type="text" class="item-volume_factor_b" value="' + item.volume_factor_b + '" /></td></tr>';
    out += '<tr class="if-not-declared-loss-factor"><td>Temperature factor</td><td><input type="text" class="item-temperature_factor_b" value="' + item.temperature_factor_b + '" /></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" value="' + item.source + '" /></td></tr>';
    out += '</tbody></table>';
    if (item.declared_loss_factor_known === true) {
        out = out.replace(/class="if-declared-loss-factor"/g, ' class="if-declared-loss-factor" style="display:table-row"');
        out = out.replace(/class="if-not-declared-loss-factor"/g, ' class="if-not-declared-loss-factor" style="display:none"');
    }
    else {
        out = out.replace(/class="if-declared-loss-factor"/g, ' class="if-declared-loss-factor" style="display:none"');
        out = out.replace(/class="if-not-declared-loss-factor"/g, ' class="if-not-declared-loss-factor" style="display:table-row"');
    }
    return out;
};
libraryHelper.prototype.storage_type_measures_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: "name", manufacturer_loss_factor: 0, temperature_factor_a: 0, storage_volume: 0, loss_factor_b: 0, volume_factor_b: 0, temperature_factor_b: 0, insulation_type: 'very thick', declared_loss_factor_known: true, source: '--', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>Category </td><td><select class="item-category">';
    var categories = ['Cylinders with inmersion', 'Indirectly heated cylinders'];
    for (index in categories) {
        if (item.category == categories[index])
            out += '<option value="' + categories[index] + '" selected>' + categories[index] + '</option>';
        else
            out += '<option value="' + categories[index] + '">' + categories[index] + '</option>';
    }
    out += '</select></td></tr>';
    out += '<tr><td>Storage volume</td><td><input type="number" min="0" class="item-storage_volume" value="' + item.storage_volume + '" /></td></tr>';
    out += '<tr><td>Insulation type</td><td><input type="text" class="item-insulation_type" value="' + item.insulation_type + '" /></td></tr>';
    if (item.declared_loss_factor_known === true)
        out += '<tr><td>Manufacturer\' declared loss factor known</td><td><input type="checkbox" class="item-declared_loss_factor_known" checked  /></td></tr>';
    else
        out += '<tr><td>Manufacturer\' declared loss factor known</td><td><input type="checkbox" class="item-declared_loss_factor_known" /></td></tr>';
    out += '<tr class="if-declared-loss-factor"><td>Manufacturer\'s declared loss factor (kWh/day)</td><td><input type="number" min="0" class="item-manufacturer_loss_factor" value="' + item.manufacturer_loss_factor + '" /></td></tr>';
    out += '<tr class="if-declared-loss-factor"><td>Temperature factor</td><td><input type="number" min="0" class="item-temperature_factor_a" value="' + item.temperature_factor_a + '" /></td></tr>';
    out += '<tr class="if-not-declared-loss-factor"><td>Hot water storage loss factor (kWh/litre/day)</td><td><input type="text" class="item-loss_factor_b" value="' + item.loss_factor_b + '" /></td></tr>';
    out += '<tr class="if-not-declared-loss-factor"><td>Volume factor</td><td><input type="text" class="item-volume_factor_b" value="' + item.volume_factor_b + '" /></td></tr>';
    out += '<tr class="if-not-declared-loss-factor"><td>Temperature factor</td><td><input type="text" class="item-temperature_factor_b" value="' + item.temperature_factor_b + '" /></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" value="' + item.source + '" /></td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    if (item.declared_loss_factor_known === true) {
        out = out.replace(/class="if-declared-loss-factor"/g, ' class="if-declared-loss-factor" style="display:table-row"');
        out = out.replace(/class="if-not-declared-loss-factor"/g, ' class="if-not-declared-loss-factor" style="display:none"');
    }
    else {
        out = out.replace(/class="if-declared-loss-factor"/g, ' class="if-declared-loss-factor" style="display:none"');
        out = out.replace(/class="if-not-declared-loss-factor"/g, ' class="if-not-declared-loss-factor" style="display:table-row"');
    }
    return out;
};
libraryHelper.prototype.appliances_and_cooking_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: "name", category: "Miscelanea", "norm_demand": 0, "units": "kWh", "utilisation_factor": 1, "frequency": 1, "reference_quantity": 1, "type_of_fuel": "Electricity", "efficiency": 1};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>Category</td><td><select class="item-category">';
    var categories = ['Computing', 'Cooking', 'Food storage', 'Other kitchen / cleaning', 'Laundry', 'Miscelanea', 'TV'];
    for (index in categories) {
        if (item.category == categories[index])
            out += '<option value="' + categories[index] + '" selected>' + categories[index] + '</option>';
        else
            out += '<option value="' + categories[index] + '">' + categories[index] + '</option>';
    }
    out += '</select></td></tr>';
    out += '<tr><td>Norm demand</td><td><input type="number" min="0" class="item-norm-demand" value="' + item['norm_demand'] + '" /></td></tr>';
    out += '<tr><td>Units</td><td><input type="text" min="0" class="item-units" value="' + item.units + '" /></td></tr>';
    out += '<tr><td>Utilisation factor</td><td><input type="number" class="item-utilisation-factor" value="' + item['utilisation_factor'] + '" /></td></tr>';
    out += '<tr><td>Frequency</td><td><input type="number" min="0" class="item-frequency" value="' + item.frequency + '" /></td></tr>';
    out += '<tr><td>Reference quantity</td><td><input type="number" min="0" class="item-reference-quantity" value="' + item['reference_quantity'] + '" /></td></tr>';
    out += '<tr><td>Type of fuel</td><td><select class="item-type-of-fuel">';
    var types_of_fuel = ['Gas', 'Oil', 'Solid fuel', 'Electricity'];
    for (index in types_of_fuel) {
        if (item['type_of_fuel'] == types_of_fuel[index])
            out += '<option value="' + types_of_fuel[index] + '" selected>' + types_of_fuel[index] + '</option>';
        else
            out += '<option value="' + types_of_fuel[index] + '">' + types_of_fuel[index] + '</option>';
    }
    out += '</select></td></tr>';
    out += '<tr><td>Efficiency</td><td><input type="number" min="0" max="1" step="0.01" class="item-efficiency" value="' + item.efficiency + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.heating_control_item_to_html = function (item, tag) {
    console.log(item);
    if (item == undefined)
        item = {tag: '', name: "--", heating_control_type: 1, source: '--', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" required value="' + item.name + '"/></td></tr>';
    out += '<tr><td>Heating control type</td><td><select class="item-heating_control_type">';
    out += item.heating_control_type == 1 ? '<option value="1" selected>1</option>' : '<option value="1">1</option>';
    out += item.heating_control_type == 2 ? '<option value="2" selected>2</option>' : '<option value="2">2</option>';
    out += item.heating_control_type == 3 ? '<option value="3" selected>3</option>' : '<option value="3">3</option>';
    out += '</select></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" value="' + item.source + '" /></td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.heating_systems_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: "--", category: 'Combi boiler', winter_efficiency: 100, summer_efficiency: 100, central_heating_pump: 0, fans_and_supply_pumps: 0, sfp: 1.5, responsiveness: 1, combi_loss: 0, primary_circuit_loss: 0, source: '--', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" required value="' + item.name + '"/></td></tr>';
    out += '<tr><td>Category </td><td><select class="heating_systems item-category">';
    var categories = ['Combi boilers', 'System boilers', 'Heat pumps', 'Room heaters', 'Warm air systems', 'Hot water only'];
    for (index in categories) {
        if (item.category == categories[index])
            out += '<option value="' + categories[index] + '" selected>' + categories[index] + '</option>';
        else
            out += '<option value="' + categories[index] + '">' + categories[index] + '</option>';
    }
    out += '</select></td></tr>';
    out += '<tr><td>Winter efficiency (space heating)</td><td><input type="text" class="item-winter_efficiency" required value="' + item.winter_efficiency + '"/></td></tr>';
    out += '<tr><td>Summer efficiency (water heating)</td><td><input type="text" class="item-summer_efficiency " required value="' + item.summer_efficiency + '"/></td></tr>';
    out += '<tr><td>Central heating pump (kWh/year)</td><td><input type="text" class="item-central_heating_pump" required value="' + item.central_heating_pump + '"/></td></tr>';
    if (item.category != 'Warm air systems') {
        out += '<tr><td>Fans and supply pumps (kWh/year)</td><td><input type="text" class="item-fans_and_supply_pumps " required value="' + item.fans_and_supply_pumps + '"/></td></tr>';
        out += '<tr style="display: none"><td>Specific fan power (kW) <i class="icon-question-sign" title="For the calculation of fans and supply pumps energy" /></td><td><input type="text" class="item-sfp" required value="' + item.sfp + '"/></td></tr>';
    }
    else {
        out += '<tr style="display: none"><td>Fans and supply pumps (kWh/year) <i class="icon-question-sign" title="For the calculation of fans and supply pumps energy" /></td><td><input type="text" class="item-fans_and_supply_pumps " required value="' + item.fans_and_supply_pumps + '"/></td></tr>';
        out += '<tr><td>Specific fan power (kW)</td><td><input type="text" class="item-sfp" required value="' + item.sfp + '"/></td></tr>';
    }
    out += '<tr><td>Responsiveness</td><td><input type="text" class="item-responsiveness" required value="' + item.responsiveness + '"/></td></tr>';
    out += '<tr><td>Combi loss</td><td><select class="item-combi_loss" required>';
    var options = ['0', 'Instantaneous, without keep hot-facility', 'Instantaneous, with keep-hot facility controlled by time clock', 'Instantaneous, with keep-hot facility not controlled by time clock', 'Storage combi boiler >= 55 litres', 'Storage combi boiler < 55 litres'];
    for (index in options) {
        if (item.instantaneous_water_heating == options[index])
            out += '<option value="' + options[index] + '" selected>' + options[index] + '</option>';
        else
            out += '<option value="' + options[index] + '">' + options[index] + '</option>';
    }
    out += '</select></td></tr>';
    out += '<tr><td>Primary circuit loss <i class="icon-question-sign" title="No primary loss for the following:\n\   - Electric inmersion heater.\n\   - Combi boiler\n\   - CPSU(including electric CPSU)\n\   - Boiler and thermal store within a single casing\n\   - Separate boiler and thermal store connected by no more than 1.5m of insulated pipework\n\ \n\For other cases (indirect cylinders and thermal stores connected by unsinsulated pipework or more than 1.5m of insulated pipework) the loss is calculated according to the amount of insulated pipework and the type of storage heating controls (in the Hot Water System section) - SAP2012 table 3, p. 199" /></td><td><select class="item-primary_circuit_loss">';
    var options = ['Yes', 'No'];
    for (index in options) {
        if (item.primary_circuit_loss == options[index])
            out += '<option value="' + options[index] + '" selected>' + options[index] + '</option>';
        else
            out += '<option value="' + options[index] + '">' + options[index] + '</option>';
    }
    out += '</select></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" value="' + item.source + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.heating_systems_measures_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: "--", category: 'Combi boiler', winter_efficiency: 100, summer_efficiency: 100, central_heating_pump: 0, fans_and_supply_pumps: 0, responsiveness: 1, combi_loss: 0, primary_circuit_loss: 0, source: '--', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" required value="' + item.name + '"/></td></tr>';
    out += '<tr><td>Category </td><td><select class="item-category">';
    var categories = ['Combi boilers', 'System boilers', 'Heat pumps', 'Room heaters', 'Warm air systems', 'Hot water only'];
    for (index in categories) {
        if (item.category == categories[index])
            out += '<option value="' + categories[index] + '" selected>' + categories[index] + '</option>';
        else
            out += '<option value="' + categories[index] + '">' + categories[index] + '</option>';
    }
    out += '</select></td></tr>';
    out += '<tr><td>Winter efficiency (space heating)</td><td><input type="text" class="item-winter_efficiency" required value="' + item.winter_efficiency + '"/></td></tr>';
    out += '<tr><td>Summer efficiency (water heating)</td><td><input type="text" class="item-summer_efficiency " required value="' + item.summer_efficiency + '"/></td></tr>';
    out += '<tr><td>Central heating pump (kWh/year)</td><td><input type="text" class="item-central_heating_pump" required value="' + item.central_heating_pump + '"/></td></tr>';
    out += '<tr><td>Fans and supply pumps (kWh/year)</td><td><input type="text" class="item-fans_and_supply_pumps " required value="' + item.fans_and_supply_pumps + '"/></td></tr>';
    out += '<tr><td>Responsiveness</td><td><input type="text" class="item-responsiveness" required value="' + item.responsiveness + '"/></td></tr>';
    out += '<tr><td>Combi loss</td><td><select class="item-combi_loss" required>';
    var options = ['0', 'Instantaneous, without keep hot-facility', 'Instantaneous, with keep-hot facility controlled by time clock', 'Instantaneous, with keep-hot facility not controlled by time clock', 'Storage combi boiler >= 55 litres', 'Storage combi boiler < 55 litres'];
    for (index in options) {
        if (item.instantaneous_water_heating == options[index])
            out += '<option value="' + options[index] + '" selected>' + options[index] + '</option>';
        else
            out += '<option value="' + options[index] + '">' + options[index] + '</option>';
    }
    out += '</select></td></tr>';
    out += '<tr><td>Primary circuit loss <i class="icon-question-sign" title="No primary loss for the following:\n\   - Electric inmersion heater.\n\   - Combi boiler\n\   - CPSU(including electric CPSU)\n\   - Boiler and thermal store within a single casing\n\   - Separate boiler and thermal store connected by no more than 1.5m of insulated pipework\n\ \n\For other cases (indirect cylinders and thermal stores connected by unsinsulated pipework or more than 1.5m of insulated pipework) the loss is calculated according to the amount of insulated pipework and the type of storage heating controls (in the Hot Water System section) - SAP2012 table 3, p. 199" /></td><td><select class="item-primary_circuit_loss">';
    var options = ['Yes', 'No'];
    for (index in options) {
        if (item.primary_circuit_loss == options[index])
            out += '<option value="' + options[index] + '" selected>' + options[index] + '</option>';
        else
            out += '<option value="' + options[index] + '">' + options[index] + '</option>';
    }
    out += '</select></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" value="' + item.source + '" /></td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.pipework_insulation_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: "--", source: '--', pipework_insulation: 'First 1m from cylinder insulated', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" required value="' + item.name + '"/></td></tr>';
    out += '<tr><td>Amount of pipework insulation</td><td><select class="item-pipework_insulation">';
    out += item.pipework_insulation == 'First 1m from cylinder insulated' ? '<option value="First 1m from cylinder insulated" selected>First 1m from cylinder insulated</option>' : '<option value="First 1m from cylinder insulated">First 1m from cylinder insulated</option>';
    out += item.pipework_insulation == 'All accesible piperwok insulated' ? '<option value="All accesible piperwok insulated" selected>All accesible piperwok insulated</option>' : '<option value="All accesible piperwok insulated">All accesible piperwok insulated</option>';
    out += item.pipework_insulation == 'Fully insulated primary pipework' ? '<option value="Fully insulated primary pipework" selected>Fully insulated primary pipework</option>' : '<option value="Fully insulated primary pipework">Fully insulated primary pipework</option>';
    out += '</select></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" value="' + item.source + '" /></td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.hot_water_control_type_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: "--", control_type: 'Cylinder thermostat, water heating separately timed', source: '--', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" required value="' + item.name + '"/></td></tr>';
    out += '<tr><td>Hot water storage control type</td><td><select class="item-control_type">';
    out += item.control_type == 'Cylinder thermostat, water heating not separately timed' ? '<option value="Cylinder thermostat, water heating not separately timed" selected>Cylinder thermostat, water heating not separately timed</option>' : '<option value="Cylinder thermostat, water heating not separately timed">Cylinder thermostat, water heating not separately timed</option>';
    out += item.control_type == 'Cylinder thermostat, water heating separately timed' ? '<option value="Cylinder thermostat, water heating separately timed" selected>Cylinder thermostat, water heating separately timed</option>' : '<option value="Cylinder thermostat, water heating separately timed">Cylinder thermostat, water heating separately timed</option>';
    out += '</select></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" value="' + item.source + '" /></td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.space_heating_control_type_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: "--", control_type: 1, source: '--', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" required value="' + item.name + '"/></td></tr>';
    out += '<tr><td>Space heating control type</td><td><input class="item-control_type" type="number" min="1" max="3" step="1" value="' + item.control_type + '" /></td>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" value="' + item.source + '" /></td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.clothes_drying_facilities_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: "--", source: '--', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" required value="' + item.name + '"/></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="item-source" value="' + item.source + '" /></td></tr>';
    out += '<tr><td colspan="2"><br />Fields to be used when applying a measure</td></tr>'
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.generation_measures_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: '', name: "--", kWp: 0, source: '--', description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>Tag</td><td><input type="text" class="item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="item-name" required value="' + item.name + '"/></td></tr>';
    out += '<tr><td>Description</td><td><textarea rows="4" cols="50" class="item-description">' + item.description + '</textarea></td></tr>';
    out += '<tr><td>kWp</td><td><input type="text" class="item-kWp" value="' + item.kWp + '" /></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="item-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="item-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="item-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Cost units</td><td>' + this.get_cost_units_select(item) + '</td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="item-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="item-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="item-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="item-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><textarea rows="4" cols="50" class="item-notes">' + item.notes + '</textarea></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="item-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
/*****************************************************************
 * Get item to save in library (when editing or creating new item)
 *****************************************************************/
libraryHelper.prototype.systems_get_item_to_save = function () {
    var item = {};
    var system = $(".edit-system-tag").val();
    item[system] = {
        name: $(".edit-system-name").val(),
        efficiency: $(".edit-system-efficiency").val(),
        winter: $(".edit-system-winter").val(),
        summer: $(".edit-system-summer").val(),
        fuel: $(".edit-system-fuel").val(),
        fans_and_pumps: $(".edit-system-fans_and_pumps").val(),
        combi_keep_hot: $(".edit-system-combi_keep_hot").val(),
        description: $(".edit-system-description").val(),
        performance: $(".edit-system-performance").val(),
        benefits: $(".edit-system-benefits").val(),
        cost: $(".edit-system-cost").val(),
        who_by: $(".edit-system-who_by").val(),
        disruption: $(".edit-system-disruption").val(),
        associated_work: $(".edit-system-associated_work").val(),
        key_risks: $(".edit-system-key_risks").val(),
        notes: $(".edit-system-notes").val(),
        maintenance: $(".edit-system-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.elements_get_item_to_save = function () {
    var item = {};
    var type = $(".create-element-type").val();
    var tag = $(".create-element-tag").val();
    item[tag] = {};
    item[tag].name = $(".create-element-name").val();
    item[tag].description = $(".create-element-description").val();
    //item[tag].location = $(".create-element-location").val();
    item[tag].source = $(".create-element-source").val();
    item[tag].uvalue = 1.0 * $(".create-element-uvalue").val();
    item[tag].kvalue = 1.0 * $(".create-element-kvalue").val();
    if (type == "Window" || type == "Door" || type == "Roof_light")
        item[tag].g = $(".create-element-g").val();
    if (type == "Window" || type == "Door" || type == "Roof_light")
        item[tag].gL = $(".create-element-gL").val();
    if (type == "Window" || type == "Door" || type == "Roof_light")
        item[tag].ff = $(".create-element-ff").val();
    item[tag].tags = [type];
    //item[tag].criteria = $(".create-element-criteria").val().split(",");

    // Measures
    /*if ($('.create-element-name').val() !== "")
     item[tag].name = $(".create-element-name").val();
     if ($('.create-element-description').val() !== "")
     item[tag].description = $(".create-element-description").val();
     if ($('.create-element-performance').val() !== "")
     item[tag].performance = $(".create-element-performance").val();
     if ($('.create-element-benefits').val() !== "")
     item[tag].benefits = $(".create-element-benefits").val();
     if ($('.create-element-cost').val() !== "")
     item[tag].cost = $(".create-element-cost").val();
     if ($('.create-element-who_by').val() !== "")
     item[tag]["who_by"] = $(".create-element-who_by").val();
     if ($('.create-element-disruption').val() !== "")
     item[tag].disruption = $(".create-element-disruption").val();
     if ($('.create-element-associated_work').val() !== "")
     item[tag]["associated_work"] = $(".create-element-associated_work").val();
     if ($('.create-element-key_risks').val() !== "")
     item[tag]["key_risks"] = $(".create-element-key_risks").val();
     if ($('.create-element-notes').val() !== "")
     item[tag].notes = $(".create-element-notes").val();
     if ($('.create-element-maintenance').val() !== "")
     item[tag].maintenance = $(".create-element-maintenance").val();*/
    return item;
};
libraryHelper.prototype.elements_measures_get_item_to_save = function () {
    var item = {};
    var type = $(".create-element-type").val();
    var tag = $(".create-element-tag").val();
    item[tag] = {};
    item[tag].name = $(".create-element-name").val();
    item[tag].description = $(".create-element-description").val();
    //item[tag].location = $(".create-element-location").val();
    item[tag].source = $(".create-element-source").val();
    item[tag].uvalue = 1.0 * $(".create-element-uvalue").val();
    item[tag].kvalue = 1.0 * $(".create-element-kvalue").val();
    if (type == "Window" || type == "Door" || type == "Roof_light")
        item[tag].g = $(".create-element-g").val();
    if (type == "Window" || type == "Door" || type == "Roof_light")
        item[tag].gL = $(".create-element-gL").val();
    if (type == "Window" || type == "Door" || type == "Roof_light")
        item[tag].ff = $(".create-element-ff").val();
    item[tag].tags = [type];
    //item[tag].criteria = $(".create-element-criteria").val().split(",");

    // Measures
    if ($('.create-element-name').val() !== "")
        item[tag].name = $(".create-element-name").val();
    if ($('.create-element-description').val() !== "")
        item[tag].description = $(".create-element-description").val();
    if ($('.create-element-min_cost').val() !== "")
        item[tag].min_cost = $(".create-element-min_cost").val();
    if ($('.create-element-performance').val() !== "")
        item[tag].performance = $(".create-element-performance").val();
    if ($('.create-element-benefits').val() !== "")
        item[tag].benefits = $(".create-element-benefits").val();
    if ($('.create-element-cost').val() !== "")
        item[tag].cost = $(".create-element-cost").val();
    item[tag].cost_units = $(".item-cost-units").val();
    if ($('.create-element-who_by').val() !== "")
        item[tag]["who_by"] = $(".create-element-who_by").val();
    if ($('.create-element-disruption').val() !== "")
        item[tag].disruption = $(".create-element-disruption").val();
    if ($('.create-element-associated_work').val() !== "")
        item[tag]["associated_work"] = $(".create-element-associated_work").val();
    if ($('.create-element-key_risks').val() !== "")
        item[tag]["key_risks"] = $(".create-element-key_risks").val();
    if ($('.create-element-notes').val() !== "")
        item[tag].notes = $(".create-element-notes").val();
    if ($('.create-element-maintenance').val() !== "")
        item[tag].maintenance = $(".create-element-maintenance").val();
    if (type == 'Wall')
        item[tag].EWI = $(".create-element-ewi").prop('checked');
    return item;
};
libraryHelper.prototype.draught_proofing_measures_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        q50: $(".item-q50").val(),
        description: $(".item-description").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.ventilation_systems_measures_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        ventilation_type: $(".item-ventilation_type").val(),
        system_air_change_rate: $(".item-air_change_rate").val(),
        balanced_heat_recovery_efficiency: $(".item-heat_recovery_efficiency").val(),
        specific_fan_power: $(".item-specific_fan_power").val(),
        description: $(".item-description").val(),
        source: $(".item-source").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.ventilation_systems_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        ventilation_type: $(".item-ventilation_type").val(),
        system_air_change_rate: $(".item-air_change_rate").val(),
        balanced_heat_recovery_efficiency: $(".item-heat_recovery_efficiency").val(),
        specific_fan_power: $(".item-specific_fan_power").val(),
        source: $(".item-source").val(),
    };
    return item;
};
libraryHelper.prototype.extract_ventilation_points_get_item_to_save = function () {
    console.log($('.item-tag'));
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        ventilation_rate: $(".item-ventilation-rate").val(),
        type: $(".item-type").val(),
        //location: $(".item-location").val(),
        description: $(".item-description").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
/*libraryHelper.prototype.extract_ventilation_points_measures_get_item_to_save = function () {
 var item = {};
 var tag = $(".item-tag").val();
 item[tag] = {
 name: $(".item-name").val(),
 number_of_intermittentfans_to_add: $(".item-intermitent_fans").val(),
 description: $(".item-description").val(),
 performance: $(".item-performance").val(),
 benefits: $(".item-benefits").val(),
 cost: $(".item-cost").val(),
 who_by: $(".item-who_by").val(),
 disruption: $(".item-disruption").val(),
 associated_work: $(".item-associated_work").val(),
 key_risks: $(".item-key_risks").val(),
 notes: $(".item-notes").val(),
 maintenance: $(".item-maintenance").val()
 };
 return item;
 };*/
libraryHelper.prototype.intentional_vents_and_flues_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        source: $(".item-name").val(),
        type: $(".item-type").val(),
        ventilation_rate: $(".item-ventilation_rate").val()
    };
    return item;
};
libraryHelper.prototype.intentional_vents_and_flues_measures_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        source: $(".item-name").val(),
        type: $(".item-type").val(),
        ventilation_rate: $(".item-ventilation_rate").val(),
        description: $(".item-description").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.water_usage_get_item_to_save = function () {
    var item = {};
    var tag = $(".water-efficiency-item-tag").val();
    item[tag] = {
        name: $(".water-efficiency-item-name").val(),
        ventilation_rate: 1.0 * $(".water-efficiency-item-ventilation_rate").val(),
        description: $(".water-efficiency-item-description").val(),
        performance: $(".water-efficiency-item-performance").val(),
        benefits: $(".water-efficiency-item-benefits").val(),
        cost: $(".water-efficiency-item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".water-efficiency-item-who_by").val(),
        disruption: $(".water-efficiency-item-disruption").val(),
        associated_work: $(".water-efficiency-item-associated_work").val(),
        key_risks: $(".water-efficiency-item-key_risks").val(),
        notes: $(".water-efficiency-item-notes").val(),
        maintenance: $(".water-efficiency-item-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.storage_type_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        category: $(".item-category").val(),
        manufacturer_loss_factor: $(".item-manufacturer_loss_factor").val(),
        temperature_factor_a: $(".item-temperature_factor_a").val(),
        storage_volume: $(".item-storage_volume").val(),
        loss_factor_b: $(".item-loss_factor_b").val(),
        volume_factor_b: $(".item-volume_factor_b").val(),
        temperature_factor_b: $(".item-temperature_factor_b").val(),
        insulation_type: $(".item-insulation_type").val(),
        declared_loss_factor_known: $(".item-declared_loss_factor_known").prop('checked'),
        source: $(".item-source").val()
    };
    return item;
};
libraryHelper.prototype.storage_type_measures_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        category: $(".item-category").val(),
        manufacturer_loss_factor: $(".item-manufacturer_loss_factor").val(),
        temperature_factor_a: $(".item-temperature_factor_a").val(),
        storage_volume: $(".item-storage_volume").val(),
        loss_factor_b: $(".item-loss_factor_b").val(),
        volume_factor_b: $(".item-volume_factor_b").val(),
        temperature_factor_b: $(".item-temperature_factor_b").val(),
        insulation_type: $(".item-insulation_type").val(),
        declared_loss_factor_known: $(".item-declared_loss_factor_known").prop('checked'),
        source: $(".item-source").val(),
        description: $(".item-description").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.appliances_and_cooking_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        category: $(".item-category").val(),
        "norm_demand": $(".item-norm-demand").val(),
        units: $(".item-units").val(),
        "utilisation_factor": $(".item-utilisation-factor").val(),
        frequency: $(".item-frequency").val(),
        "reference_quantity": $(".item-reference-quantity").val(),
        'type_of_fuel': $(".item-type-of-fuel").val(),
        efficiency: $(".item-efficiency").val()
    };
    return item;
};
libraryHelper.prototype.heating_systems_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        category: $(".item-category").val(),
        winter_efficiency: $(".item-winter_efficiency").val(),
        summer_efficiency: $(".item-summer_efficiency").val(),
        central_heating_pump: $(".item-central_heating_pump").val(),
        fans_and_supply_pumps: $(".item-fans_and_supply_pumps").val(),
        sfp: $(".item-sfp").val(),
        responsiveness: $(".item-responsiveness").val(),
        combi_loss: $(".item-combi_loss").val(),
        primary_circuit_loss: $(".item-primary_circuit_loss").val(),
        source: $(".item-source").val()
    };
    return item;
};
libraryHelper.prototype.heating_systems_measures_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        category: $(".item-category").val(),
        winter_efficiency: $(".item-winter_efficiency").val(),
        summer_efficiency: $(".item-summer_efficiency").val(),
        central_heating_pump: $(".item-central_heating_pump").val(),
        fans_and_supply_pumps: $(".item-fans_and_supply_pumps").val(),
        sfp: $(".item-sfp").val(),
        responsiveness: $(".item-responsiveness").val(),
        combi_loss: $(".item-combi_loss").val(),
        primary_circuit_loss: $(".item-primary_circuit_loss").val(),
        source: $(".item-source").val(),
        description: $(".item-description").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.heating_control_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        heating_control_type: $(".item-heating_control_type").val(),
        source: $(".item-source").val(),
        description: $(".item-description").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.pipework_insulation_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        pipework_insulation: $(".item-pipework_insulation").val(),
        source: $(".item-source").val(),
        description: $(".item-description").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.hot_water_control_type_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        control_type: $(".item-control_type").val(),
        source: $(".item-source").val(),
        description: $(".item-description").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.space_heating_control_type_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        control_type: $(".item-control_type").val(),
        source: $(".item-source").val(),
        description: $(".item-description").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.clothes_drying_facilities_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        source: $(".item-source").val(),
        description: $(".item-description").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
libraryHelper.prototype.generation_measures_get_item_to_save = function () {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {
        name: $(".item-name").val(),
        description: $(".item-description").val(),
        kWp: $(".item-kWp").val(),
        performance: $(".item-performance").val(),
        benefits: $(".item-benefits").val(),
        cost: $(".item-cost").val(),
        cost_units: $(".item-cost-units").val(),
        who_by: $(".item-who_by").val(),
        disruption: $(".item-disruption").val(),
        associated_work: $(".item-associated_work").val(),
        key_risks: $(".item-key_risks").val(),
        notes: $(".item-notes").val(),
        maintenance: $(".item-maintenance").val()
    };
    return item;
};
/***************************************************
 * Other methods
 ***************************************************/
libraryHelper.prototype.load_user_libraries = function (callback) {
    var mylibraries = {};
    var myself = this;
    $.ajax({url: path + "assessment/loaduserlibraries.json", async: false, datatype: "json", success: function (result) {
            //result = JSON.parse(result);
            for (library in result) {
                if (mylibraries[result[library].type] === undefined)
                    mylibraries[result[library].type] = [];
                result[library].data = result[library].data.replace('\\/plus', '+'); // For a reason i have not been able to find why the character + becomes a carrier return when it is accesed in $_POST in the controller, because of this we escape + with \plus
                result[library].data = JSON.parse(result[library].data);
                mylibraries[result[library].type].push(result[library]);
            }
            if (callback !== undefined)
                callback();
            myself.library_list = mylibraries;
        }});
};
libraryHelper.prototype.get_library_permissions = function (callback) {
    var mypermissions = {};
    var myself = this;
    $.ajax({url: path + "assessment/getuserpermissions.json", async: false, datatype: "json", success: function (result) {
            if (callback !== undefined)
                callback();
            myself.library_permissions = result;
        }});
    //return mypermissions;
};
libraryHelper.prototype.display_library_users = function (library_id) {
    $.ajax({url: path + "assessment/getsharedlibrary.json", data: "id=" + library_id, success: function (shared) {
            var out = "<tr><th>Shared with:</th><th>Has write persmissions</th><th></th></tr>";
            var write = "";
            for (var i in shared) {
                write = shared[i].write == 1 ? 'Yes' : 'No';
                if (shared[i].username != p.author)
                    out += "<tr><td>" + shared[i].username + "</td><td>" + write + "</td><td><i style='cursor:pointer' class='icon-trash remove-user' library-id='" + library_id + "' username='" + shared[i].username + "'></i></td></tr>";
                else
                    out += "<tr><td>" + shared[i].username + "</td><td>" + write + "</td><td>&nbsp;</td></tr>";
            }
            if (out == "<tr><th>Shared with:</th><th>Has write persmissions</th><th></th></tr>")
                out = "<tr><td colspan='3'>This library is currently private</td></tr>";
            $("#shared-with-table").html(out);
        }});
};
libraryHelper.prototype.get_library_by_id = function (id) {
    for (z in this.library_list) {
        for (i in this.library_list[z]) {
            if (this.library_list[z][i].id == id)
                return this.library_list[z][i];
        }
    }
};
libraryHelper.prototype.populate_measure_new_item = function (type_of_library) {
    var item_index = $('#replace-from-lib-items').val();
    var library = this.get_library_by_id($('#replace-from-lib').val()).data;
    var original_item = JSON.parse($('#apply-measure-ok').attr('item'));
    var new_item = library[item_index];
    $('#apply-measure-item-fields').html('');
    var function_name = type_of_library + "_item_to_html";
    var out = this[function_name](new_item, item_index);
    $('#apply-measure-item-fields').html(out);
};
libraryHelper.prototype.set_library_name = function (library_id, new_name, callback) {
    $.ajax({url: path + "assessment/setlibraryname.json", data: "library_id=" + library_id + "&new_library_name=" + new_name, async: false, datatype: "json", success: function (result) {
            callback(result);
        }});
};
libraryHelper.prototype.populate_library_modal = function (origin) {
    // Populate the select to choose library to display
    var out = '';
    this.library_list[this.type].forEach(function (library) {
        out += "<option value=" + library.id + ">" + library.name + "</option>";
    });
    out += "<option value=-1 class='newlibraryoption' style='background-color:#eee'>Create new</option>";
    $("#library-select").html(out);
    // Heading of the modal
    $('#show-library-modal .modal-header h3').html(this.library_names[this.type]);
    // Draw the library
    var id = $('#library-select').val();
    $('#library_table').html('');
    var function_name = this.type + '_library_to_html';
    out = this[function_name](origin, id);
    $("#library_table").html(out);
    // Add library id to "Add item from library" button
    $('#create-in-library').attr('library-id', id);
    // Hide/show "share" option according to the permissions
    if (this.library_permissions[id].write == 0)
        $('.if-write').hide('fast');
    else
        $('.if-write').show('fast');
};
libraryHelper.prototype.populate_selects_in_apply_measure_modal = function (type_of_library) {
    var out = '';
    this.library_list[type_of_library].forEach(function (library) {
        out += "<option value=" + library.id + ">" + library.name + "</option>";
    });
    $("#replace-from-lib").html(out);
    $("#replace-from-lib").attr('library_type', type_of_library);
    this.onChangeApplyMeasureReplaceFromLib(type_of_library); // This one to populate the select for items
};
libraryHelper.prototype.delete_library_item = function (library_id, tag) {
    var myself = this;
    $.ajax({url: path + "assessment/deletelibraryitem.json", data: "library_id=" + library_id + "&tag=" + tag, async: false, datatype: "json", success: function (result) {
            if (result != true)
                $('#confirm-delete-library-item-modal .message').html("Item could not be deleted - " + result);
            else {
                $('#confirm-delete-library-item-modal').modal('hide');
                $('#show-library-items-modal [tag="' + tag + '"]').parent().parent().remove();
                $('#show-library-modal-edit-mode tr[tag="' + tag + '"]').remove();
                myself.load_user_libraries();
            }
        }});
}

libraryHelper.prototype.get_list_of_libraries_for_select = function (library_type) {
    var out = ''
    this.library_list[library_type].forEach(function (library) {
        out += "<option value=" + library.id + ">" + library.name + "</option>";
    });
    return out;
}

libraryHelper.prototype.get_list_of_items_for_select = function (libraryid) {
    var out = ''
    var library = this.get_library_by_id(libraryid);
    for (item in library.data) {
        if (library.type == 'elements' || library.type == 'elements_measures') {
            if (library.data[item].tags[0].toUpperCase() == original_item.type.toUpperCase())
                out += '<option value="' + item + '">' + item + ': ' + library.data[item].name + '</option>';
        }
        else
            out += '<option value="' + item + '">' + item + ': ' + library.data[item].name + '</option>';
    }
    return out;
}

libraryHelper.prototype.get_list_of_items_for_select_by_category = function (libraryid, category_to_show) {
    var library = this.get_library_by_id(libraryid).data;
    // Group items by category
    var items_by_category = {};
    for (var item in library) {
        var category = library[item].category;
        if (items_by_category[category] == undefined)
            items_by_category[category] = {};
        items_by_category[category][item] = library[item];
    }

// Generate output string according to the category_to_show passed to the function, if the category exist we return optionns for that category, if it doesn't exist we return all the items sorted by category
    var options = '';
    if (items_by_category[category_to_show] != undefined) {
        for (item in library) {
            if (library[item].category == category_to_show)
                options += '<option value="' + item + '">' + library[item].name + '</option>';
        }
    }
    else {
        for (category in items_by_category) {
            options += '<optgroup label="' + category + '">';
            for (index in items_by_category[category])
                options += '<option value="' + index + '">' + index + ': ' + items_by_category[category][index].name + '</option>';
            options += '</optgroup>';
        }
    }
    return options;
}

libraryHelper.prototype.orderObjectsByKeys = function (obj, expected) {

    var keys = Object.keys(obj).sort(function keyOrder(k1, k2) {
        v1 = k1.toUpperCase();
        v2 = k2.toUpperCase();
        if (v1 < v2)
            return -1;
        else if (v1 > v2)
            return +1;
        else
            return 0;
    });
    var i, after = {};
    for (i = 0; i < keys.length; i++) {
        after[keys[i]] = obj[keys[i]];
        delete obj[keys[i]];
    }

    for (i = 0; i < keys.length; i++) {
        obj[keys[i]] = after[keys[i]];
    }
    return obj;
};
libraryHelper.prototype.get_cost_units_select = function (item) {
    var units = ['sqm', 'unit', 'ln m', 'kWp'];
    var out = '<select class="item-cost-units">';
    for (index in units) {
        if (item.cost_units != units[index])
            out += '<option value="' + units[index] + '">' + units[index] + '</option>';
        else
            out += '<option value="' + units[index] + '" selected>' + units[index] + '</option>';
    }

    out += '</select>';
    return out;
};

libraryHelper.prototype.hide_modals_temporaly = function () {
    $('.modal').each(function () {
        if ($(this).css('display') == 'block')
            $(this).attr('temp-hidden', 'true');
    });
    $('.modal').modal('hide');
};
libraryHelper.prototype.show_temporally_hidden_modals = function () {
    $('.modal[temp-hidden=true]').removeAttr('temp-hidden').modal('show');
};
