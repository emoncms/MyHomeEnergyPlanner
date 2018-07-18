console.log("debug commentary.js");

function commentary_UpdateUI()
{

}

function commentary_initUI() {
    $.ajax({
        url: jspath + "views/householdquestionnaire.js",
        dataType: 'script',
        async: false
    });
    householdquestionnaire_initUI();
}

var textAreaLength = 0;
$("#openbem").on("textInput", '[key="data.household.commentary"]', function () { // I have added this event because the Commentary box in Household questionnaire was not getting saved when the assessor refreshed the page or moved to another one before losing the focus of the input (which is what triggers the onChange event)
    if ($(this)[0].value.length - textAreaLength > 15) {
        textAreaLength = $(this)[0].value.length;
        $(this).trigger("change");
    }
});