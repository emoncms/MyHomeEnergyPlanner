function libraryHelper(type, container) {
    this.type = type;
    this.container = container;
    this.library_list = {};
    this.library_permissions = {};
    //this.library_html_strings ={};

    this.init();
    this.append_modals();
    this.add_events();
    //$('#modal-share-library').modal('show');


}


/***********************************
 * Methods called in the constructor
 ***********************************/

libraryHelper.prototype.init = function () {
    this.load_user_libraries(); // Populates this.library_list
    this.get_library_permissions(); // Populates this.library_permissions
    //this.get_html_strings(); // Populates this.library_html_strings
};
libraryHelper.prototype.add_events = function () {
    var myself = this;
    this.container.on('click', '.add-from-lib', function () {
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
        var library_id = null;
        if ($(this).attr('library-id') != '')
            library_id = $(this).attr('library-id');
        myself.onCreateInLibrary(library_id);
    });
    this.container.on('click', '#create-in-library-ok', function () {
        var library_id = null;
        if ($(this).attr('library-id') != undefined)
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
        myself.onEditItem($(this));
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
        myself.onShowLibraryItems($(this).attr('library-id'));
    });
    this.container.on('change', '#show-library-items-modal .element-type select', function () {
        myself.onChangeTypeOfElementsToShow($(this));
    });

    this.container.on('click', '.manage-users', function () {
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
        var library_id = $(this).attr('library-id');
        myself.type = myself.get_library_by_id(library_id).type;
        myself.onCreateInLibrary(library_id);
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
    if ($('#library-select').val() != undefined)
        selected_library = $('#library-select').val();
    this.display_library_users(selected_library);
    $('#modal-share-library #share-library').attr('library-id', selected_library);
    $('.modal').modal('hide');
    $('#modal-share-library').modal('show');
};
libraryHelper.prototype.onShareLib = function (selected_library) {
    $('#return-message').html('');
    var username = $("#sharename").val();
    var write_permissions = $('#write_permissions').is(":checked");
    if ($('#library-select').val() != undefined)
        selected_library = $('#library-select').val();
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
        out = this[function_name](origin);
        $("#library_table").html(out);
        // Hide/show "share" option according to the permissions
        if (this.library_permissions[id].write == 0)
            $('.if-write').hide();
        else
            $('.if-write').show();
    }
};
libraryHelper.prototype.onNewLibraryOption = function () {
    // Display type of library
    var type;
    switch (this.type) {
        case 'elements':
            type = 'Fabric elements';
            break;
        case 'systems':
            type = 'Energy systems';
            break;
        default:
            type = this.type;
    }
    $('#new-library-modal #new-library-type').html(type);
    // Populate the select to choose library to copy
    var out = '';
    this.library_list[this.type].forEach(function (library) {
        out += "<option value=" + library.id + ">" + library.name + "</option>";
    });
    $("#library-to-copy-select").html(out);

    $('#new-library-name').val('New name');
    $(".modal").modal('hide');
    $('#new-library-modal .btn').show();
    $('#new-library-modal #finishcreatelibrary').hide();
    $("#new-library-modal").modal('show');
};
libraryHelper.prototype.onChangeEmptyOrCopyLibrary = function () {
    if ($("input[name=empty_or_copy_library]:checked").val() == 'empty')
        $('#library-to-copy').hide();
    else
        $('#library-to-copy').show();
};
libraryHelper.prototype.onCreateNewLibrary = function () {
    $("#create-library-message").html('');
    var myself = this;
    var callback = function (resultado) {
        if (resultado == '0')
            $("#create-library-message").html('Library could not be created');
        if (typeof resultado == 'number') {
            myself.load_user_libraries();
            myself.get_library_permissions();
            $("#create-library-message").html('Library created');
            $('#cancelnewlibrary').hide();
            $('#newlibrary').hide();
            $('#finishcreatelibrary').show();
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
    UpdateUI(data);
};
libraryHelper.prototype.onCreateInLibrary = function (library_id) {
    $('#modal-create-in-library .modal-header h3').html('Create ' + page);
    $('#modal-create-in-library .btn').show();
    $('#modal-create-in-library #create-in-library-finish').hide();
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
    $('.modal').modal('hide');

    if (library_id != undefined)
        $('#create-in-library-ok').attr('library-id', library_id);
    $('#modal-create-in-library').modal('show');
};
libraryHelper.prototype.onCreateInLibraryOk = function (library_id) {
    $("#create-in-library-message").html('');
    if ($('#library-select').val() != undefined)
        library_id = $('#library-select').val();
    var selected_library = this.get_library_by_id(library_id);
    var item = {};
    // Call to specific function for the type
    var function_name = this.type + '_get_item_to_save';
    item = this[function_name]();
    // Add item to library and save it
    for (tag in item) {
        if (selected_library.data[tag] != undefined)
            $("#create-in-library-message").html("Tag already exist, choose another one");
        else {
            selected_library.data[tag] = item[tag];
            $.ajax({type: "POST", url: path + "assessment/savelibrary.json", data: "id=" + selected_library.id + "&data=" + JSON.stringify(selected_library.data), success: function (result) {
                    if (result == true) {
                        $("#create-in-library-message").html("Item added to the library");
                        $('#modal-create-in-library button').hide();
                        $('#create-in-library-finish').show();
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
        $('#copy-item-from').hide();
    }
    else {
        $('#copy-item-from').show();
        // Display the item
        var selected_library = this.get_library_by_id($('#origin-library-select').val());
        var selected_item = selected_library.data[$('#item-to-copy-select').val()];
        var function_name = this.type + '_item_to_html';
        out = this[function_name](selected_item);
        $('.new-item-in-library').html(out);
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
    $('#library-to-edit-item').parent().show();
    $('.edit-item-in-library').html(out);
    $('#edit-item-ok').attr('class', "btn edit-library-item-ok");
    $('#edit-item-ok').attr('library-id', selected_library.id);
    $('.item-tag').attr('disabled', 'true');
    $('.editable-field').removeAttr("disabled");
    $("#edit-item-message").html('');
    $('#modal-edit-item button').show();
    $('#edit-item-finish').hide();
    $('.modal').modal('hide');
    $('#modal-edit-item').modal('show');
};
libraryHelper.prototype.onEditLibraryItemOk = function (library_id) {
    $("#edit-item-message").html('');
    if ($('#library-select').val() != undefined)
        library_id = $('#library-select').val();
    var selected_library = this.get_library_by_id(library_id);
    var item = {};
    // Call to specific function for the type
    var function_name = this.type + '_get_item_to_save';
    item = this[function_name]();
    // Edit item in library and save it
    for (tag in item) {
        selected_library.data[tag] = item[tag];
        $.ajax({type: "POST", url: path + "assessment/savelibrary.json", data: "id=" + selected_library.id + "&data=" + JSON.stringify(selected_library.data), success: function (result) {
                if (result == true) {
                    $("#edit-item-message").html("Item edited and library saved");
                    $('#modal-edit-item button').hide();
                    $('#edit-item-finish').show();
                }
                else
                    $("#create-in-library-message").html("There were problems saving the library");
            }});
    }
};
libraryHelper.prototype.onEditItem = function (origin) {
    var item = JSON.parse(origin.attr('item'));
    var tag = origin.attr('tag');
    // Call to specific function for the type
    var function_name = this.type + '_item_to_html';
    var out = this[function_name](item, tag);
    $('.edit-item-in-library').html(out);
    $('#library-to-edit-item').parent().hide();
    $('.item-tag').attr('disabled', 'true');
    $('.editable-field').attr('disabled', 'true');
    $('#edit-item-ok').attr('class', "btn edit-item-ok");
    $("#edit-item-message").html('');
    $('#edit-item-ok').attr('row', origin.attr('row'));
    $('#edit-item-ok').attr('type-of-item', origin.attr('type-of-item'));
    $('#modal-edit-item button').show();
    $('#edit-item-finish').hide();
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
    //// Check remove item (option by default) and hide item
    $('[name=radio-type-of-measure]').filter('[value=remove]').prop('checked', true);
    $('#apply-measure-item-fields').hide();
    $('#apply-measure-replace').hide();
    //If we are in fabric Elements show the option to Apply Measure from Measures Library
    if (this.type = 'elements')
        $('.replace_from_measure_library').show();

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
    $('.modal').modal('hide');
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
            $('#apply-measure-replace').hide();
            $('#apply-measure-item-fields').hide();
            break;
        case 'replace':
            this.populate_selects_in_apply_measure_modal(this.type),
                    this.onChangeApplyMeasureReplaceFromLib(this.type);
            this.onChangeApplyMeasureReplaceFromLibItem(this.type);
            $('#apply-measure-replace').show();
            $('#apply-measure-item-fields').show();
            break;
        case 'replace_from_measure_library':
            this.populate_selects_in_apply_measure_modal(this.type + "_measures")
            this.onChangeApplyMeasureReplaceFromLib(this.type + "_measures");
            this.onChangeApplyMeasureReplaceFromLibItem(this.type + "_measures");
            $('#apply-measure-replace').show();
            $('#apply-measure-item-fields').show();
            break;
        case 'edit':
            var original_item = JSON.parse($('#apply-measure-ok').attr('item'));
            var tag = $('#apply-measure-ok').attr('tag');
            $('#apply-measure-item-fields').html('');
            var function_name = this.type + "_item_to_html";
            var out = this[function_name](original_item, tag);
            $('#apply-measure-item-fields').html(out);
            $("#apply-measure-item-fields .create-element-type").prop('disabled', true);
            $('#apply-measure-replace').hide();
            $('#apply-measure-item-fields').show();
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
    if (type == 'Window' || type == 'Door' || type == 'Roof_light')
        $('.window-element').show();
    else
        $('.window-element').hide();

    if (type == "Wall" && this.type == 'elements_measures')
        $('#modal-create-in-library .EWI-row').show();
    else
        $('#modal-create-in-library .EWI-row').hide();
};

libraryHelper.prototype.onShowLibraryItems = function (library_id) {
    var library = this.get_library_by_id(library_id);
    this.type = library.type;
    //Header
    var header;
    switch (library.type) {
        case 'elements':
            header = 'Fabric elements library';
            break;
        case 'systems':
            header = 'Energy systems library';
            break;
        default:
            header = library.type + ' library';
    }
    $("#show-library-items-header").html(header);
    $('#show-library-items-library-name').html(library.name);

    // Items
    var function_name = library.type + '_library_to_html';
    var out = this[function_name](null, library_id);
    $("#show-library-items-modal #show-library-items-table").html(out);

    // Add Library id to edit buttons

    // Hide the Use buttons
    $("#show-library-items-modal .use-from-lib").hide();

    // Hide Write options if no write access
    if (this.library_permissions[library.id].write != 1)
        $("#show-library-items-modal .if-write").hide();

    // Show the select to choose the type of fabric elements when library is "elements"
    if (this.type == 'elements')
        $('#show-library-items-modal .element-type').show();

    // Add library id to Create new item 
    $('#show-library-items-modal #create-in-library').attr('library-id', library_id);

    // Show modal
    $("#show-library-items-modal").modal('show');

};
libraryHelper.prototype.onChangeTypeOfElementsToShow = function (origin) {
    origin.attr('tags', [origin.val()]); //this is the type of elements to display
    var library_id = origin.attr('library_id');
    var out = this.elements_library_to_html(origin, library_id);
    // Items
    $("#show-library-items-modal #show-library-items-table").html(out);
    // Add Library id to edit buttons

    // Hide the Use buttons
    $("#show-library-items-modal .use-from-lib").hide();
    // Hide Write options if no write access
    if (this.library_permissions[library_id].write != 1)
        $("#show-library-items-modal .if-write").hide();
    // Show the select to choose the type of fabric elements when library is "elements"
    $('#show-library-items-modal .element-type').show();
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
/**********************************************
 * Libraries to html
 **********************************************/

libraryHelper.prototype.systems_library_to_html = function (origin, library_id) {
    var eid = '';
    if (origin != undefined)
        eid = $(origin).attr('eid');
    else
        eid = '';
    if ($('#library-select').val() != undefined)
        library_id = $('#library-select').val();
    selected_library = this.get_library_by_id(library_id);
    $('#library-select').attr('eid', eid);
    var out = "";
    for (z in selected_library.data) {
        out += "<tr><td>" + selected_library.data[z].name + "<br>";
        out += "<span style='font-size:80%'>";
        out += "<b>Efficiency:</b> " + Math.round(selected_library.data[z].efficiency * 100) + "%, ";
        out += "<b>Winter:</b> " + Math.round(selected_library.data[z].winter * 100) + "%, ";
        out += "<b>Summer:</b> " + Math.round(selected_library.data[z].summer * 100) + "%, ";
        out += "<b>Fuel:</b> " + selected_library.data[z].fuel;
        out += "</span></td>";
        out += "<td></td>";
        out += "<td style='text-align:right'>";
        out += "<button eid='" + eid + "' system='" + z + "' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
        out += "<button eid='" + eid + "' system='" + z + "' library='" + selected_library.id + "' class='btn add-system use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
        out += "</td>";
        out += "</tr>";
    }
    return out;
};
libraryHelper.prototype.elements_library_to_html = function (origin, library_id) {
    var tag = [];
    if (origin != undefined)
        tag = $(origin).attr('tags').split(',');
    else
        tag = ['Wall'];
    if ($('#library-select').val() != undefined)
        library_id = $('#library-select').val();
    var element_library = this.get_library_by_id(library_id).data;
    $('#library-select').attr('tags', tag);


    var out = "";
    //Select to choose the type of element to display, not always used and is hidden by default
    out = '<div class="input-prepend element-type" style="display:none" ><span class="add-on">Type</span><select library_id="' + library_id + '" >';
    out += tag[0] == 'Wall' ? '<option value="Wall" selected>Wall</option>' : '<option value = "Wall" > Wall </option>';
    if (tag[0] == 'party_wall' || tag[0] == 'Party_wall')
        out += '<option value="party_wall" selected>Party wall</option>';
    else
        out += '<option value="party_wall">Party wall</option>';
    out += tag[0] == 'Roof' ? '<option value="Roof" selected>Roof</option>' : '<option value="Roof">Roof</option>';
    out += tag[0] == 'Floor' ? '<option value="Floor" selected>Floor</option>' : '<option value="Floor">Floor</option>';
    out += tag[0] == 'Window' ? ' <option value = "Window" selected > Window </option>' : '<option value="Window">Window</option> ';
    out += tag[0] == 'Door' ? ' <option value = "Door" selected > Door </option>' : '<option value="Door">Door</option> ';
    out += tag[0] == 'Roof_light' ? ' <option value = "Roof_light" selected > Roof light </option>' : '<option value="Roof_light">Roof light</option> ';
    out += '</select></div>';

    // Elements
    out += '<table>';
    for (z in element_library) {
        if (tag.indexOf(element_library[z].tags[0]) != -1) {
            out += "<tr class='librow' lib='" + z + "' type='" + tag + "'>";
            out += "<td style='width:20px;'>" + z + "</td>";
            out += "<td style='width:200px;'>" + element_library[z].name;
            out += "<br><span style='font-size:13px'><b>Source:</b> " + element_library[z].source + "</span>";
            /*if (element_library[z].criteria.length)
             out += "<br><span style='font-size:13px'><b>Measure criteria:</b> " + element_library[z].criteria.join(", ") + "</span>";
             */
            out += "</td>";
            out += "<td style='width:200px; font-size:13px'>";
            out += "<b>U-value:</b> " + element_library[z].uvalue + " W/K.m2";
            out += "<br><b>k-value:</b> " + element_library[z].kvalue + " kJ/K.m2";
            if (element_library[z].tags[0] == "Window" || element_library[z].tags[0] == "Door" || element_library[z].tags[0] == "Roof_light") {
                out += "<br><b>g:</b> " + element_library[z].g + ", ";
                out += "<b>gL:</b> " + element_library[z].gL + ", ";
                out += "<b>ff:</b> " + element_library[z].ff;
            }
            out += "</td>";
            out += "<td style='width:120px' >";
            out += "<i style='cursor:pointer' class='icon-pencil if-write edit-library-item' library='" + library_id + "' lib='" + z + "' type='" + element_library[z].tags[0] + "' tag='" + z + "'></i>";
            // out += "<i class='icon-trash' style='margin-left:20px'></i>";
            out += "<button class='add-element use-from-lib btn' style='margin-left:20px' library='" + library_id + "' lib='" + z + "' type='" + element_library[z].tags[0] + "'>use</button</i>";
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

/**********************************************
 * Items to html
 **********************************************/

libraryHelper.prototype.systems_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {name: 'name', efficiency: 1.0, winter: 1.0, summer: 1.0, fuel: 'electric', fans_and_pumps: 0, combi_keep_hot: 0, description: '--', performance: '--', benefits: '--', cost: 0, who_by: '--', disruption: '--', associated_work: '--', key_risks: '--', notes: '--', maintenance: '--'};
    else if (tag != undefined)
        item.tag = tag;
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    out += '<tr><td>System tag</td><td><input type="text" class="edit-system-tag item-tag" required value="' + item.tag + '"/></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="edit-system-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>Default efficiency</td><td><input type="text" class="edit-system-efficiency editable-field" value="' + item.efficiency + '" /></td></tr>';
    out += '<tr><td>Winter efficiency</td><td><input type="text" class="edit-system-winter editable-field" value="' + item.winter + '" /></td></tr>';
    out += '<tr><td>Summer efficiency</td><td><input type="text" class="edit-system-summer editable-field" value="' + item.summer + '" /></td></tr>';
    out += '<tr><td>Pumps and fans (kWh/year)</td><td><input type="text" class="edit-system-fans_and_pumps editable-field" value="' + item.fans_and_pumps + '" /></td></tr>';
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
    out += '<tr><td>Description</td><td><input type="text" class="edit-system-description" value="' + item.description + '" /></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="edit-system-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="edit-system-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="edit-system-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="edit-system-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="edit-system-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="edit-system-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="edit-system-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><input type="text" class="edit-system-notes" value="' + item.notes + '" /></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="edit-system-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</tbody></table>';
    return out;
};
libraryHelper.prototype.elements_item_to_html = function (item, tag) {
    if (item == undefined)
        item = {tag: 'new tag', name: 'New name', EWI: false, uvalue: 1.0, kvalue: 1.0, tags: ['Wall'], location: '',
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
        out += '<option value="party_wall" selected>Party wall</option>';
    else
        out += '<option value="party_wall">Party wall</option>';
    out += type == 'Roof' ? '<option value="Roof" selected>Roof</option>' : '<option value="Roof">Roof</option>';
    out += type == 'Floor' ? '<option value="Floor" selected>Floor</option>' : '<option value="Floor">Floor</option>';
    out += type == 'Window' ? ' <option value = "Window" selected > Window </option>' : '<option value="Window">Window</option> ';
    out += type == 'Door' ? ' <option value = "Door" selected > Door </option>' : '<option value="Door">Door</option> ';
    out += type == 'Roof_light' ? ' <option value = "Roof_light" selected > Roof light </option>' : '<option value="Roof_light">Roof light</option> ';
    out += '</select></div>';
    out += '<table class="table">';
    out += '<tr><td>Tag</td><td><input type="text" class="create-element-tag item-tag" value="' + item.tag + '" /></td></tr>';
    out += '<tr><td>Name</td><td><input type="text" class="create-element-name" value="' + item.name + '" /></td></tr>';
    out += '<tr><td>Location</td><td><input type="text" class="create-element-location" value="' + item.location + '" /></td></tr>';
    out += '<tr><td>Source</td><td><input type="text" class="create-element-source" value="' + item.source + '" /></td></tr>';
    if (item.EWI == true)
        out += '<tr class="EWI-row" style="display:none" title="Ticking this box will increase the area of the wall by 1.15"><td>EWI</td><td><input type="checkbox" class="create-element-ewi" checked /></td></tr>';
    else
        out += '<tr class="EWI-row" style="display:none"><td>EWI</td><td><input type="checkbox" class="create-element-ewi"  /></td></tr>';
    out += '<tr><td>U-value</td><td><input type="text" class="create-element-uvalue editable-field" value="' + item.uvalue + '" /></td></tr>';
    out += '<tr><td>K-value</td><td><input type="text" class="create-element-kvalue editable-field" value="' + item.kvalue + '" /></td></tr>';
    if (type == 'Window') {
        out += '<tr><td>g</td><td><input type="text" class="create-element-g window-element editable-field" value="' + item.g + '" /></td></tr>';
        out += '<tr><td>gL</td><td><input type="text" class="create-element-gL window-element editable-field" value="' + item.gL + '" /></td></tr>';
        out += '<tr><td>Frame factor (ff)</td><td><input type="text" class="create-element-ff editable-field window-element" value="' + item.ff + '" /></td></tr>';
    }
    else {
        out += '<tr class="window-element" style="display:none"><td>g</td><td><input type="text" class="create-element-g window-element editable-field" value="1" /></td></tr>';
        out += '<tr class="window-element" style="display:none"><td>gL</td><td><input type="text" class="create-element-gL window-element editable-field" value="1" /></td></tr>';
        out += '<tr class="window-element" style="display:none" ><td>Frame factor (ff)</td><td><input type="text" class="create-element-ff editable-field window-element" value="1" /></td></tr>';

    }

    out += '<tr><td colspan="2">Fields to be taken into account when using the element as a Measure</td></tr>';
    out += '<tr><td>Description</td><td><input type="text" class="create-element-description" value="' + item.description + '" /></td></tr>';
    out += '<tr><td>Performance</td><td><input type="text" class="create-element-performance" value="' + item.performance + '" /></td></tr>';
    out += '<tr><td>Benefits</td><td><input type="text" class="create-element-benefits" value="' + item.benefits + '" /></td></tr>';
    out += '<tr><td>Cost</td><td><input type="text" class="create-element-cost" value="' + item.cost + '" /></td></tr>';
    out += '<tr><td>Who by</td><td><input type="text" class="create-element-who_by" value="' + item.who_by + '" /></td></tr>';
    out += '<tr><td>Disruption</td><td><input type="text" class="create-element-disruption" value="' + item.disruption + '" /></td></tr>';
    out += '<tr><td>Associated work</td><td><input type="text" class="create-element-associated_work" value="' + item.associated_work + '" /></td></tr>';
    out += '<tr><td>Key risks</td><td><input type="text" class="create-element-key_risks" value="' + item.key_risks + '" /></td></tr>';
    out += '<tr><td>Notes</td><td><input type="text" class="create-element-notes" value="' + item.notes + '" /></td></tr>';
    out += '<tr><td>Maintenance</td><td><input type="text" class="create-element-maintenance" value="' + item.maintenance + '" /></td></tr>';
    out += '</table>';
    return out;
};
libraryHelper.prototype.elements_measures_item_to_html = function (item, tag) {
    var out = this.elements_item_to_html(item, tag);
    if (item == undefined || item.tags[0] == 'Wall')
        out = out.replace('<tr class="EWI-row" style="display:none">', '<tr class="EWI-row">');
    return out;
};
/*******************************************************
 * Get item to save in library (when creating new item)
 ******************************************************/

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
    item[tag].location = $(".create-element-location").val();
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
        item[tag].maintenance = $(".create-element-maintenance").val();
    return item;
};
libraryHelper.prototype.elements_measures_get_item_to_save = function () {
    var item = this.elements_get_item_to_save();
    var type = $(".create-element-type").val();
    var tag = $(".create-element-tag").val();
    if (type = 'Wall')
        item[tag].EWI = $(".create-element-ewi").prop('checked');
    return item;
};
/***************************************************
 * Other methods
 ***************************************************/

libraryHelper.prototype.load_user_libraries = function (callback) {
    var mylibraries = {};
    var myself = this;
    $.ajax({url: path + "assessment/loaduserlibraries.json", async: false, datatype: "json", success: function (result) {
            for (library in result) {
                if (mylibraries[result[library].type] === undefined)
                    mylibraries[result[library].type] = [];
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
    new_item.location = original_item.location;
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
    var header = '';
    switch (this.type) {
        case 'elements':
            header = 'Fabric elements library';
            break;
        case 'systems':
            header = 'Energy systems library';
            break;
        default:
            header = this.type.toUpperCase() + this.type.slice(1) + ' library';
    }
    $('#show-library-modal .modal-header h3').html(header);
    // Draw the library
    $('#library_table').html('');
    var function_name = this.type + '_library_to_html';
    out = this[function_name](origin);
    $("#library_table").html(out);
    // Hide/show "share" option according to the permissions
    var id = $('#library-select').val();
    if (this.library_permissions[id].write == 0)
        $('.if-write').hide();
    else
        $('.if-write').show();
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