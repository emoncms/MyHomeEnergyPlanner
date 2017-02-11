function worksheets_initUI(){
    //console.log($('[array-key]'));
    for(array_in_data in $('[array-key]')){
        //console.log(array_in_data.val());
    }
    var key;
    $("[array-key]").each(function () {
        key = $(this).attr('array-key').slice(5);
        console.log(data[key]);
        for(i in [$(this).attr('array-key')]){
            console.log([$(this).attr('array-key')]);
        }
            
    })
}