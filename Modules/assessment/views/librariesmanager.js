console.log("debug libraries_manager.js");

var library_helper = new libraryHelper('', $("#openbem"));

function librariesmanager_UpdateUI()
{
    //library_helper.init();
    $('#libraries-table').html('');
    for (t in library_helper.library_list) {
        // Add header
        $('#libraries-table').append($('#library-table-header-template').html());
        $("#libraries-table .header[library-type='template']").html(library_helper.library_names[t]);
        $("#libraries-table [library-type='template']").attr('library-type', t);
        //Add libraries
        var library = {};
        var access = '';
        for (l in library_helper.library_list[t]) {
            library = library_helper.library_list[t][l];
            $('#libraries-table').append($('#library-template').html());
            $('#libraries-table td[library-name="template"]').html(library.name);
            $('#libraries-table [library-name="template"]').attr('library-name', library.name);
            $('#libraries-table [library-id="template"]').attr('library-id', library.id);
            $("#libraries-table [library-type='template']").attr('library-type', t);
            if (library_helper.library_permissions[library.id].write != 1) {
                access = "Read";
                $('.if-write-access[library-id=' + library.id + ']').hide('fast');
            }
            else {
                access = 'Write';
            }
            $('#libraries-table [library-access="template"]').html(access);
            $('#libraries-table [library-access="template"]').attr('library-access', access);
        }
    }
}

