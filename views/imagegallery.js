console.log('Debug imagegallery.js');

function imagegallery_initUI() {
    if (data.imagegallery == undefined)
        data.imagegallery = [];

    if (data.imagegallery_notes == undefined)
        data.imagegallery_notes = [];

    if (data.featuredimage == undefined)
        data.featuredimage = '';

    data = project['master'];

    for (z in data.imagegallery) {
        if (data.imagegallery_notes[z] == undefined)
            data.imagegallery_notes[z] = "Add a note";
        add_image(z);
    }
}

function imagegallery_updateUI() {

}


$('#openbem #upload_form').submit(function (e) {
    e.preventDefault();

    $('#upload_result').html("Loading...");
    $('#delete_result').html("");

    var form_data = new FormData();
    for (file_index in $('#files_to_upload')[0].files) {
        form_data.append($('#files_to_upload')[0].files[file_index].name, $('#files_to_upload')[0].files[file_index]);
    }

    openbem.upload_images(projectid, form_data, upload_images_callback);
});

function upload_images_callback(result) {
    // Result can be a string with an error message or an object with a message for each file to upload
    if (typeof result === 'string')
        $('#upload_result').html("<p>" + result + "</p>");
    else {
        $('#upload_result').html('');
        for (image in result) {
            $('#upload_result').append("<p>" + image + " - " + result[image] + "</p>"); // Display the result message of the upload
            console.log(result[image]);
            if (result[image].indexOf("Uploaded") > -1) {
                data.imagegallery.push(image);
                add_image(data.imagegallery.length - 1); // Add the image to the view       
            }
        }
        update();
    }

}

function add_image(z) {
    var url = path + "Modules/assessment/images/" + projectid + "/" + data.imagegallery[z];
    var html = "<div style='display:inline-block; padding:15px; vertical-align:top'><a class='image-in-gallery' key='data.imagegallery.";
    html += z;
    html += "' href='";
    html += url;
    html += "'><img src='";
    html += url;
    html += "' width='200' /></a><i style='cursor:pointer' class='icon-trash' index='";
    html += z;
    html += "'></i><i style='cursor:pointer' class='icon-star";
    if (data.imagegallery[z] != data.featuredimage) {
        html += "-empty";
    }
    html += "' index='"
    html += z;
    html += "' title='Feature this image'></i>";
    html += "<p style='margin:10px' class='note' index=" + z + ">" + data.imagegallery_notes[z] + " <i class='icon-edit edit-note' style='cursor:pointer' index=" + z + "></p>"
    html += "</div>";
    $('#gallery').append(html);
    //$('#gallery').append("<img class='image-in-gallery' key='data.imagegallery." + z + "' src='" + url + "' width='200' />");
}


$('#gallery').on('click', '.icon-trash', function () {
    $('#upload_result').html("");
    $('#delete_result').html("");
    $("#file-to-delete").html(data.imagegallery[$(this).attr('index')]);
    $('#delete-file-confirm').attr('index', $(this).attr('index'));
    $("#modal-delete-image").modal("show");
});

$('#gallery').on('click', '.icon-star-empty', function () {
    data.featuredimage = data.imagegallery[$(this).attr('index')];
    $('#gallery .icon-star').removeClass(".icon-star").addClass("icon-star-empty");
    $(this).removeClass("icon-star-empty").addClass("icon-star");
    update();
});

$('#modal-delete-image').on('click', '#delete-file-confirm', function () {
    openbem.delete_image(projectid, data.imagegallery[$(this).attr('index')], delete_image_callback);
    $("#modal-delete-image").modal("hide");
});

$('#gallery').on('click', '.edit-note', function () {
    var index = $(this).attr('index');
    $('.note[index=' + index + ']').html('<input type="text" index=' + index + ' style="width: 185px; margin-left: -10px" value="' + data.imagegallery_notes[index] + '" /><br /><button class="btn save-note" index=' + index + '>Save</button>');
});
$('#gallery').on('click', '.save-note', function () {
    var index = $(this).attr('index');
    data.imagegallery_notes[index] = $('input[index=' + index + ']').val();
    $('.note[index=' + index + ']').html(data.imagegallery_notes[index] + " <i class='icon-edit edit-note' style='cursor:pointer' index=" + index + ">");
    update();
});

function delete_image_callback(result) {
    for (image_name in result) {
        $('#delete_result').append("<p>" + image_name + " - " + result[image_name] + "</p>"); // Display the result message of the deletion
        if (result[image_name] === "File deleted" || result[image_name] === "File could not be found in the server. Image gallery list updated") {
            // Find the image in the data object and remove it
            for (z in data.imagegallery) {
                if (image_name === data.imagegallery[z]) {
                    data.imagegallery.splice(z, 1);
                }
            }
            // Remove from view
            $('a[key = "data.imagegallery.' + z + '"]').remove(); // Image
            $('i[index = "' + z + '"]').remove();
        }
    }
    update();
}