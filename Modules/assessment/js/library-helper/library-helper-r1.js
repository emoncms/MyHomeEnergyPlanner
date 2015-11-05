console.log('debug library-helper-r1.js');

function libraryHelper(type, container) {
    this.type = type;
    this.container = container;
    this.library_list = {};
    this.library_permissions = {};

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
    this.get_library_permissions();
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

};

libraryHelper.prototype.append_modals = function () {
    var html;
    var myself = this;
    $.ajax({url: path + "Modules/assessment/js/library-helper/library-modals.html", datatype: "json", success: function (result) {
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

    // Hide/show "share" option according to the permissions
    var id = $('#library-select').val();
    if (this.library_permissions[id].write == 0)
        $('.if-write').hide();
    else
        $('.if-write').show();

    // Draw the library
    // ToDo

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

