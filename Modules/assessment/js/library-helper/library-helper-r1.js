console.log('debug library-helper-r1.js');

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
    this.container.on('click', '.add-element-from-lib', function () {
        myself.onAddElementFromLib();
    });
    this.container.on('click', '#open-share-library', function () {
        myself.onOpenShareLib();
    });
    this.container.on('click', "#share-library", function () {
        myself.onShareLib();
    });
    this.container.on('click', '.remove-user', function () {
        myself.onRemoveUserFromSharedLib($(this).attr('username'));
    });
    this.container.on('change', '#library-select', function () {
        myself.onSelectingLibraryToShow();
    });
    this.container.on('change', "[name='empty_or_copy_library']", function () {
        myself.onChangeEmptyOrCopyLibrary();
    });
    this.container.on('click', '#newlibrary', function () {
        myself.onCreateNewLibrary();
    })
}

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
libraryHelper.prototype.onAddElementFromLib = function () {
    // Check if the user has a library of this type and if not create it
    if (this.library_list[this.type] === undefined) {
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
    }

    // Populate the select to choose library to display
    var out = '';
    this.library_list[this.type].forEach(function (library) {
        out += "<option value=" + library.id + ">" + library.name + "</option>";
    });
    out += "<option value=-1 class='newlibraryoption' style='background-color:#eee'>Create new</option>";
    $("#library-select").html(out);

    // Heading of the modal
    $('#show-library-modal .modal-header h3').html(page[0].toUpperCase() + page.slice(1) + ' library');

    // Draw the library
    $('#library_table').html('');
    out = this.get_library_html();
    $("#library_table").html(out);

    // Hide/show "share" option according to the permissions
    var id = $('#library-select').val();
    if (this.library_permissions[id].write == 0)
        $('.if-write').hide();
    else
        $('.if-write').show();

    // Show the modal
    $("#show-library-modal").modal('show');
};

libraryHelper.prototype.onOpenShareLib = function () {
    var selected_library = $('#library-select').val();
    this.display_library_users(selected_library);

    $('.modal').modal('hide');
    $('#modal-share-library').modal('show');
};

libraryHelper.prototype.onShareLib = function () {
    $('#return-message').html('');
    var username = $("#sharename").val();
    var write_permissions = $('#write_permissions').is(":checked");
    var selected_library = $('#library-select').val();
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

libraryHelper.prototype.onRemoveUserFromSharedLib = function (user_to_remove) {
    $('#return-message').html('');
    var selected_library = $('#library-select').val();
    var myself = this;

    $.ajax({url: path + "assessment/removeuserfromsharedlibrary.json", data: 'library_id=' + selected_library + '&user_to_remove=' + user_to_remove, success: function (result) {
            $('#return-message').html(result);
            myself.display_library_users(selected_library);
        }});
};

libraryHelper.prototype.onSelectingLibraryToShow = function () {
    var id = $('#library-select').val();
    if (id == -1)  // id is -1 when choosing "Create new"
        this.onNewLibraryOption();
    else {
        $('#library_table').html('');
        out = this.get_library_html();
        $("#library_table").html(out);

        // Hide/show "share" option according to the permissions
        if (this.library_permissions[id].write == 0)
            $('.if-write').hide();
        else
            $('.if-write').show();
    }
};

libraryHelper.prototype.onNewLibraryOption = function () {
    // Populate the select to choose library to copy
    var out = '';
    this.library_list[this.type].forEach(function (library) {
        out += "<option value=" + library.id + ">" + library.name + "</option>";
    });
    $("#library-to-copy-select").html(out);

    $(".modal").modal('hide');
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
    var callback = function (resultado) {
        if (resultado == '0')
            $("#create-library-message").html('Library could not be created');
        if (typeof resultado == 'number'){
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
}

/**********************************************
 * Libraries html
 **********************************************/

libraryHelper.prototype.get_library_html = function () {
    switch (page) {
        case 'system':
            out = this.system_library_to_html();
    }

    return out;
};

libraryHelper.prototype.system_library_to_html = function () {
    var eid = $(this).attr('eid');
    var selected_library = this.get_library_by_id($('#library-select').val());

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
        out += "<button eid='" + eid + "' system='" + z + "' class='btn if-write edit-system'>Edit</button>";
        out += "<button eid='" + eid + "' system='" + z + "' class='btn add-system'>Use</button>";
        out += "</td>";
        out += "</tr>";
    }
    return out;
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
                    out += "<tr><td>" + shared[i].username + "</td><td>" + write + "</td><td><i style='cursor:pointer' class='icon-trash remove-user' username='" + shared[i].username + "'></i></td></tr>";
                else
                    out += "<tr><td>" + shared[i].username + "</td><td>" + write + "</td><td>&nbsp;</td></tr>";
            }
            if (out == "<tr><th>Shared with:</th><th>Has write persmissions</th><th></th></tr>")
                out = "<tr><td colspan='3'>This library is currently private</td></tr>";
            $("#shared-with-table").html(out);
        }});
};

libraryHelper.prototype.get_library_by_id = function (id) {
    for (z in this.library_list[this.type]) {
        if (this.library_list[this.type][z].id == id)
            return this.library_list[this.type][z];
    }
};

/*libraryHelper.prototype.get_html_strings = function(){
 this.library_html_strings = {
 elements:{
 
 },
 systems:{
 
 }
 }
 }*/

