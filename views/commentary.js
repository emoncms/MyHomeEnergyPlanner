console.log("debug commentary.js");

function commentary_UpdateUI()
{

}

function commentary_initUI() {
    // The commentary was originally in "Household Questionnaire", we need to for several reasons we need to initilize it 
    $.ajax({
        url: jspath + "views/householdquestionnaire.js",
        dataType: 'script',
        async: false
    });
    householdquestionnaire_initUI();

    // Add overviews
    for (var s in project) {
        if (s != 'master') {
            data = project[s];
            $('#overviews').append('<div id="overview-' + s + '" class="overview" style="width:50%; display:inline-block"></div>');
            load_view("#overview-" + s, 'topgraphic');
            $('#overviews #overview-' + s + ' #scenario-name').html(s.charAt(0).toUpperCase() + s.slice(1) + ' - ' + data.scenario_name);
            draw_openbem_graphics("#overview-" + s);
        }
    }

    // commentary belongs to master
    data = project['master'];
}

var textAreaLength = 0;
$("#openbem").on("textInput", '[key="data.household.commentary"]', function () { // I have added this event because the Commentary box in Household questionnaire was not getting saved when the assessor refreshed the page or moved to another one before losing the focus of the input (which is what triggers the onChange event)
    if ($(this)[0].value.length - textAreaLength > 15) {
        textAreaLength = $(this)[0].value.length;
        $(this).trigger("change");
    }
});