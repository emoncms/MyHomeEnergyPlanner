console.log("debug libraries_manager.js");

var library_helper = new libraryHelper('', $("#openbem"));

function librariesmanager_UpdateUI()
{
    //library_helper.init();
    $('#libraries-table').html('');
    // Sort alphabetically
    var library_list = [];
    for (t in library_helper.library_list) {
        library_list.push(library_helper.library_list[t]);
    }
    library_list.sort(function (a, b) {
        var textA = a[0].type.toUpperCase();
        var textB = b[0].type.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    library_list.forEach(function (array_libraries_of_same_type, index) {
        var type = array_libraries_of_same_type[0].type;
        // Add header
        $('#libraries-table').append($('#library-table-header-template').html());
        $("#libraries-table .header[library-type='template']").html(library_helper.library_names[type]);
        $("#libraries-table [library-type='template']").attr('library-type', type);
        
        //Add libraries
        array_libraries_of_same_type.forEach(function (library) {
            console.log(library);
            var access = '';
            $('#libraries-table').append($('#library-template').html());
            $('#libraries-table td[library-name="template"]').html(library.name);
            $('#libraries-table [library-name="template"]').attr('library-name', library.name);
            $('#libraries-table [library-id="template"]').attr('library-id', library.id);
            $("#libraries-table [library-type='template']").attr('library-type', library.type);
            if (library_helper.library_permissions[library.id].write != 1) {
                access = "Read";
                $('.if-write-access[library-id=' + library.id + ']').hide('fast');
            }
            else {
                access = 'Write';
            }
            $('#libraries-table [library-access="template"]').html(access);
            $('#libraries-table [library-access="template"]').attr('library-access', access);

        });


    });
}

