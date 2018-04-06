var libraryDefaults = 
{
    "elements":{
        "name":"",
        "type":['Wall','Party_wall','Roof','Loft','Floor','Window','Door','Roof_light','Hatch'],
        "description":"",
        "location":"",
        "source":"",
        "uvalue":0,
        "kvalue":0,
        "g":"",
        "gL":"",
        "ff":"",
        "ewi":[true,false], // tip: <i class="icon-question" title="Ticking this box will increase the area of the wall by 1.15" />
        
        // Measure properties
        "measure":false, // perhaps extend with an array of elements this measure can be applied to
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "min_cost":0, // tip: <icon class="icon-question-sign" title="Total cost of measure = minimum cost + (area x unit cost)" />
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    
    "draught_proofing_measures":{
        "name":"",
        "q50":0,
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    "ventilation_systems":{
        "name":"",
        "ventilation_type":{"NV":"Natural ventilation only (NV)","IE":"Intermittent extract ventilation (IE)","DEV":"Continuous decentralised mechanical extract ventilation (DEV)","MEV":"Continuous whole house extract ventilation (MEV)","MV":"Balanced mechanical ventilation without heat recovery (MV)","MVHR":"Balanced mechanical ventilation with heat recovery (MVHR)","PS":"Whole House Passive Stack Ventilation System (PS)"},
        "system_air_change_rate":0,
        "balanced_heat_recovery_efficiency":0,
        "specific_fan_power":0,
        "source":""
    },
    "ventilation_systems_measures":{
        "name":"",
        "ventilation_type":{"NV":"Natural ventilation only (NV)","IE":"Intermittent extract ventilation (IE)","DEV":"Continuous decentralised mechanical extract ventilation (DEV)","MEV":"Continuous whole house extract ventilation (MEV)","MV":"Balanced mechanical ventilation without heat recovery (MV)","MVHR":"Balanced mechanical ventilation with heat recovery (MVHR)","PS":"Whole House Passive Stack Ventilation System (PS)"},
        "system_air_change_rate":0,
        "balanced_heat_recovery_efficiency":0,
        "specific_fan_power":0,
        "source":"",
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    "extract_ventilation_points":{
        "name":"",
        "location":"",
        "type":"",
        "ventilation_rate":0,
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    "intentional_vents_and_flues":{
        "name":"",
        "source":"",
        "type":"",
        "ventilation_rate":0
    },
    "intentional_vents_and_flues_measures":{
        "name":"",
        "source":"",
        "type":"",
        "ventilation_rate":0,
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    "water_usage":{
        "name":"",
        "source":"",
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    "storage_type":{
        "tag":"",
        "name":"",
        "category":['Cylinders with inmersion', 'Indirectly heated cylinders'],
        "manufacturer_loss_factor":0,
        "temperature_factor_a":0,
        "storage_volume":0,
        "loss_factor_b":0,
        "volume_factor_b":0,
        "temperature_factor_b":0,
        "insulation_type":"very thick",
        "declared_loss_factor_known": [true,false],
        "source":""
    },
    "storage_type_measures":{
        "tag":"",
        "name":"",
        "category":['Cylinders with inmersion', 'Indirectly heated cylinders'],
        "manufacturer_loss_factor":0,
        "temperature_factor_a":0,
        "storage_volume":0,
        "loss_factor_b":0,
        "volume_factor_b":0,
        "temperature_factor_b":0,
        "insulation_type":"very thick",
        "declared_loss_factor_known": [true,false],
        "source":"",
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    
    "appliances_and_cooking":{
        "name":"",
        "category":['Computing', 'Cooking', 'Food storage', 'Other kitchen / cleaning', 'Laundry', 'Miscelanea', 'TV'],
        "norm_demand":0,
        "units":"",
        "utilisation_factor":0,
        "frequency":0,
        "reference_quantity":0,
        "type_of_fuel":['Gas', 'Oil', 'Solid fuel', 'Electricity'],
        "efficiency":0
    },
    "heating_systems":{
        "name":"",
        "category":['Combi boilers', 'System boilers', 'Heat pumps', 'Room heaters', 'Warm air systems', 'Hot water only'],
        "winter_efficiency":0,
        "summer_efficiency":0,
        "central_heating_pump":0,
        "fans_and_supply_pumps":0,
        "responsiveness":0,
        "combi_loss":['0', 'Instantaneous, without keep hot-facility', 'Instantaneous, with keep-hot facility controlled by time clock', 'Instantaneous, with keep-hot facility not controlled by time clock', 'Storage combi boiler >= 55 litres', 'Storage combi boiler < 55 litres'],
        "primary_circuit_loss":['Yes', 'No'],
        "source":"",
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":"",
        "sfp":0
    },
    "heating_systems_measures":{
        "name":"",
        "category":['Combi boilers', 'System boilers', 'Heat pumps', 'Room heaters', 'Warm air systems', 'Hot water only'],
        "winter_efficiency":0,
        "summer_efficiency":0,
        "central_heating_pump":0,
        "fans_and_supply_pumps":0,
        "responsiveness":0,
        "combi_loss":['0', 'Instantaneous, without keep hot-facility', 'Instantaneous, with keep-hot facility controlled by time clock', 'Instantaneous, with keep-hot facility not controlled by time clock', 'Storage combi boiler >= 55 litres', 'Storage combi boiler < 55 litres'],
        "primary_circuit_loss":['Yes', 'No'],
        "source":"",
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    "pipework_insulation":{
        "name":"",
        "pipework_insulation":"First 1m from cylinder insulated",
        "source":"",
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    "hot_water_control_type":{
        "name":"",
        "control_type":"Cylinder thermostat, water heating separately timed",
        "source":"",
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    "space_heating_control_type":{
        "name":"",
        "control_type":0,
        "source":"",
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    "clothes_drying_facilities":{
        "name":"",
        "source":"",
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    },
    "generation_measures":{
        "name":"",
        "description":"",
        "performance":"",
        "benefits":"",
        "cost_units":"",
        "kWp":0,
        "cost":0,
        "who_by":"",
        "disruption":"",
        "associated_work":"",
        "key_risks":"",
        "notes":"",
        "maintenance":""
    }
};


String.prototype.ucfirst = function()
{
    return this.charAt(0).toUpperCase() + this.substr(1);
}

function libraryHelper(type, container) {
    this.container = container;
    this.library_list = {};
    this.library = {};
    this.library_permissions = {};
    // Variables to link the view with the controller
    this.type = type;
    this.library_names = {}; // I know this should not be here :p
    //this.library_html_strings ={};

    this.init();
    this.append_modals();
    this.add_events();



}

//  //if ($('#library-select').val() != undefined) Needs to be removed from every function where it appears. Ensure we always pass the library id

/***********************************
 * Methods called in the constructor
 ***********************************/

libraryHelper.prototype.init = function () {
    this.load_user_libraries(); // Populates this.library_list

    this.library_names = {
        'elements': 'Fabric elements',
        'systems': 'Energy systems',
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

    this.container.on('change', '#show-library-items-modal .element-type select', function () {
        myself.onChangeTypeOfElementsToShow($(this));
    });
    this.container.on('click', '#create-in-library-finish', function () {
        $('#modal-create-in-library').modal('hide');
        $('#modal-create-in-library .new-item-in-library').html('');
        $('#modal-create-in-library #create-in-library-message').html('');
        myself.show_temporally_hidden_modals();
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
            $('.item-system_air_change_rate').parent().parent().show('fast');
            $('.item-specific_fan_power').parent().parent().show('fast');
        }
        else {
            $('.item-system_air_change_rate').parent().parent().hide('fast');
            $('.item-system_air_change_rate').val(0);
            $('.item-specific_fan_power').parent().parent().hide('fast');
            $('.item-specific_fan_power').val(0);
        }
        if (newVS == 'MVHR')
            $('.item-balanced_heat_recovery_efficiency').parent().parent().show('fast');
        else {
            $('.item-balanced_heat_recovery_efficiency').parent().parent().hide('fast');
            $('.item-balanced_heat_recovery_efficiency').val(0);
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
    console.log('onAddItemFromLib');
    
    this.populate_library_modal(origin);
    $("#show-library-modal").modal('show');
};

libraryHelper.prototype.onSelectingLibraryToShow = function (origin) {
    console.log('onSelectingLibraryToShow');
    
    var id = $('#library-select').val();
    if (id == -1)  // id is -1 when choosing "Create new"
        this.onNewLibraryOption();
    else {
        $('#library_table').html('');
        var function_name = this.type + '_library_to_html';
        out = this[function_name](origin, id);
        $("#library_table").html(out);
        $('#create-in-library').attr('library-id', id);
    }
};
libraryHelper.prototype.onNewLibraryOption = function () {
    console.log('onNewLibraryOption');
    
    $('#new-library-modal #new-library-type').html(this.library_names[this.type]);
    $('#create-library-message').html('');
    // Populate the select to choose library to copy
    var out = '';
    for (var z in this.library_list) {
        out += "<option value=" + this.library_list[z].id + ">" + this.library_list[z].name + "</option>";
    }
    $("#library-to-copy-select").html(out);
    $('#new-library-name').val('New name');
    $(".modal").modal('hide');
    $('#new-library-modal .btn').show('fast');
    $('#new-library-modal #finishcreatelibrary').hide('fast');
    $("#new-library-modal").modal('show');
};
libraryHelper.prototype.onChangeEmptyOrCopyLibrary = function () {
    console.log('onChangeEmptyOrCopyLibrary');
    
    if ($("input[name=empty_or_copy_library]:checked").val() == 'empty')
        $('#library-to-copy').hide('fast');
    else
        $('#library-to-copy').show('fast');
};
libraryHelper.prototype.onCreateNewLibrary = function () {
    console.log('onCreateNewLibrary');
    
    $("#create-library-message").html('');
    var myself = this;
    var callback = function (resultado) {
        if (resultado == '0' || resultado == 0)
            $("#create-library-message").html('Library could not be created');
        if (typeof resultado == 'number') {
            myself.load_user_libraries();
            // myself.get_library_permissions();
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
            $.ajax({url: path + "assessment/copylibrary.json", data: "name="+name+"&id="+id+"&linked=1", datatype: "json", success: function (result) {
                callback(result);
            }});
        } else {
            $.ajax({url: path + "assessment/newlibrary.json", data: "name=" + name + "&type=" + this.type, datatype: "json", success: function (result) {
                callback(result);
            }});
        }
    }
};
libraryHelper.prototype.onCreateInLibrary = function () {
    console.log('onCreateInLibrary');
    
    $('#modal-create-in-library .modal-header h3').html('Create ' + page);
    $('#modal-create-in-library .btn').show('fast');
    $('#modal-create-in-library #create-in-library-finish').hide('fast');
    // Populate the select to choose library to copy from
    var out = '';
    for (var z in this.library_list) {
        out += "<option value=" + this.library_list[z].id + ">" + this.library_list[z].name + "</option>";
    }
    $("#origin-library-select").html(out);
    // Populate the select to choose item to copy from
    out = '';
    var selected_library = this.get_library_by_id($('#origin-library-select').val());
    for (item in items) {
        out += "<option value=" + item + ">" + item + "</option>";
    }
    $("#item-to-copy-select").html(out);
    // Item fields
    // Call to specific function for the type
    out = this.item_to_html(this.type);
    
    $('.new-item-in-library').html(out);
    // Ensure the tag input is editable
    $('.item-tag').removeAttr("disabled");
    $('.editable-field').removeAttr("disabled");
    this.hide_modals_temporaly();
    $('.modal').modal('hide');
    // Preselect create empty one
    $('input:radio[name=empty_or_copy_item]').val(['empty']);
    $('#copy-item-from').hide('fast');
    $('#modal-create-in-library').modal('show');
};

libraryHelper.prototype.onChangeEmptyOrCopyItem = function () {
    console.log('onChangeEmptyOrCopyItem');
    
    var out;
    if ($('[name=empty_or_copy_item]:checked').val() == 'empty') {
        out = this.item_to_html(this.type);
        $('.new-item-in-library').html(out);
        $('#copy-item-from').hide('fast');
    }
    else {
        $('#copy-item-from').show('fast');
        // Display the item
        var selected_library = this.get_library_by_id($('#origin-library-select').val());
        var selected_item = items[$('#item-to-copy-select').val()];
        out = this.item_to_html(this.type,selected_item);
        
        $('.new-item-in-library').html(out);
        $('#modal-create-in-library .item-tag').val('New tag')

    }
};

libraryHelper.prototype.onChangeOriginLibrarySelect = function () {
    console.log('onChangeOriginLibrarySelect');
    
    // Populate the select to choose item to copy from
    var out = '';
    var selected_library = this.get_library_by_id($('#origin-library-select').val());
    for (item in items) {
        out += "<option value=" + item + ">" + item + "</option>";
    }
    $("#item-to-copy-select").html(out);
    // Display the item
    var selected_item = items[$('#item-to-copy-select').val()];
    out = this.item_to_html(this.type,selected_item);
     
    $('.new-item-in-library').html(out);
};

libraryHelper.prototype.onApplyMeasure = function (origin) {
    console.log('onApplyMeasure');
    
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
    for (var z in this.library_list) {
        out += "<option value=" + this.library_list[z].id + ">" + this.library_list[z].name + "</option>";
    }
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
    console.log('onApplyMeasureOk');
    
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
            measure.item = this.get_item_to_save(this.type);
            break;
        case'replace_from_measure_library':
            measure.item = this.get_item_to_save(this.type);
            break;
    }
    console.log(measure);
    apply_measure(measure);
    $('#apply-measure-modal').modal('hide');
};

libraryHelper.prototype.onChangeApplyMeasureWhatToDo = function () {
    console.log('onChangeApplyMeasureWhatToDo');
    
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
            out = this.item_to_html(this.type,original_item,tag);
            
            $('#apply-measure-item-fields').html(out);
            $("#apply-measure-item-fields .create-element-type").prop('disabled', true);
            $('#apply-measure-replace').hide('fast');
            $('#apply-measure-item-fields').show('fast');
            break;
    }
};

libraryHelper.prototype.onChangeApplyMeasureReplaceFromLib = function (type_of_library) {
    console.log('onChangeApplyMeasureReplaceFromLib');
    
    var out = "";
    var original_item = JSON.parse($('#apply-measure-ok').attr('item'));
    var library = this.library[type_of_library];
    for (item in library) {
        if (type_of_library == 'elements') {
            if (library[item].type.toUpperCase() == original_item.type.toUpperCase())
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
    console.log('onChangeApplyMeasureReplaceFromLibItem');
    
    this.populate_measure_new_item(type_of_library);
    //disable the possibility to change the type of the element
    $("#apply-measure-item-fields .create-element-type").prop('disabled', true);
};

libraryHelper.prototype.onChangeTypeOnCreateElementLibItem = function () {
    console.log('onChangeTypeOnCreateElementLibItem');
    
    var type = $('#modal-create-in-library .create-element-type').val();
    // Show window specific fields for a given type
    if (type == 'Window' || type == 'Door' || type == 'Roof_light')
        $('.window-element').show('fast');
    else
        $('.window-element').hide('fast');
    if (type == "Wall")
        $('#modal-create-in-library .EWI-row').show('fast');
    else
        $('#modal-create-in-library .EWI-row').hide('fast');
    // Populate elements dropdown
    $('#modal-create-in-library #item-to-copy-select').html('');
    var library = this.get_library_by_id($('#modal-create-in-library #origin-library-select').val());
    var out = '';
    for (i in library.data) {
        if (type.toUpperCase() == library.data[i].type.toUpperCase())
            out += '<option value="' + i + '">' + i + '</option>';
    }
    $('#modal-create-in-library #item-to-copy-select').html(out);
    if ($('#modal-create-in-library [name="empty_or_copy_item"]:checked').val() == 'empty') {
        out = this.item_to_html('elements');
    } else { // Copy from existing one
        // Replace item with the first one in the list
        $('#modal-create-in-library #new-item-in-library').html('');
        var tag = $('#modal-create-in-library #item-to-copy-select').val();
        out = this.item_to_html('elements',library.data[tag]);
        $('#modal-create-in-library .new-item-in-library').html(out);
        $('#modal-create-in-library .item-tag').val('New tag');
    }
};

libraryHelper.prototype.onChangeTypeOfElementsToShow = function (origin) {
    console.log('onChangeTypeOfElementsToShow');
    console.log(origin.val());
    origin.attr('type', origin.val()); //this is the type of elements to display
    //var out = this.elements_library_to_html(origin);
    var function_name = this.type + '_library_to_html';
    var out = this[function_name](origin);
    // Items
    $("#show-library-items-modal #show-library-items-table").html(out);
    // Add Library id to edit buttons

    // Hide the Use buttons
    $("#show-library-items-modal .use-from-lib").hide('fast');
    // Show the select to choose the type of fabric elements when library is "elements"
    $('#show-library-items-modal .element-type').show('fast');
};

/**********************************************
 * Libraries to html
 **********************************************/

libraryHelper.prototype.default_library_to_html = function (origin, category) {
    var out = "";
    var items = this.library[category];
    //this.orderObjectsByKeys(items);
    
    for (z in items) {
        out += "<tr><td>" + z + ': ' + items[z].name + "</td>";
        out += "<td style='text-align:right;width:250px'>";
        out += "<button tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
        // out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn add-system use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
        out += "</td>";
        out += "</tr>";
    }
    return out;
};
libraryHelper.prototype.default_library_by_category_to_html = function (origin,category) {
    var out = "";
    var items = this.library[category];
    
    var ordered_by_categories = {};
    for (z in items) {
        var category = items[z].category;
        if (ordered_by_categories[category] == undefined)
            ordered_by_categories[category] = {};
        ordered_by_categories[category][z] = items[z];
    }

    // Prepare the output string
    for (category in ordered_by_categories) {
        out += "<tr><th colspan='2'>" + category + "</th></tr>";
        for (z in ordered_by_categories[category]) {
            out += "<tr><td style='padding-left:50px'>" + z + ': ' + items[z].name + "</td>";
            out += "<td style='text-align:right;width:250px'>";
            out += "<button tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
            // out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
            out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn add-system use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
            out += "</td>";
            out += "</tr>";
        }
    }
    return out;
};
libraryHelper.prototype.systems_library_to_html = function (origin) {
    var eid = '';
    if (origin != undefined)
        eid = $(origin).attr('eid');
    else
        eid = '';
        
    var items = this.library.systems;
    this.orderObjectsByKeys(items);
    $('#library-select').attr('eid', eid);
    var out = "";
    for (z in items) {
        out += "<tr><td>" + z + ': ' + items[z].name + "<br>";
        out += "<span style='font-size:80%'>";
        out += "<b>Efficiency:</b> " + Math.round(items[z].efficiency * 100) + "%, ";
        out += "<b>Winter:</b> " + Math.round(items[z].winter * 100) + "%, ";
        out += "<b>Summer:</b> " + Math.round(items[z].summer * 100) + "%, ";
        out += "<b>Fuel:</b> " + items[z].fuel;
        out += "</span></td>";
        out += "<td></td>";
        out += "<td style='text-align:right;width:250px'>";
        out += "<button eid='" + eid + "' system='" + z + "' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
        //out += "<button style='margin-left:10px' eid='" + eid + "' system='" + z + "' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
        out += "<button style='margin-left:10px' eid='" + eid + "' system='" + z + "' library='" + selected_library.id + "' class='btn add-system use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
        out += "</td>";
        out += "</tr>";
    }
    return out;
};
libraryHelper.prototype.elements_library_to_html = function (origin) {

    console.log("elements_library_to_html");
    
    var type = "Wall"; // default
    var selected_lib = false;
    var element_row = false;
    
    if (origin != undefined) {
        type = $(origin).attr('type');
        console.log(type);
        element_row = $(origin).attr('row');
        
        if (data.fabric.elements[element_row]!=undefined)
            selected_lib = data.fabric.elements[element_row].lib;
        
        if (selected_lib==undefined) selected_lib = false;
    }
    
    var element_library = this.library.elements;
    this.orderObjectsByKeys(element_library);
    $('#library-select').attr('type', type);
    var out = "";
    
    //Select to choose the type of element to display, not always used and is hidden by default
    out =  '<div class="input-prepend element-type" style="display:none" ><span class="add-on">Type</span>';
    out += '<select>';

    var element_types = libraryDefaults.elements.type;
    for (var z in element_types) {
        var selected = type.toLowerCase() == element_types[z].toLowerCase() ? "selected" : "";
        out += '<option value="'+element_types[z]+'" '+selected+'>'+element_types[z]+'</option>';
    }
    out += '</select></div>';
    
    // Elements
    out += '<table>';
    for (z in element_library) {
        if (element_library[z].type == type) {
            var selected_class = ""; if (z==selected_lib) selected_class = "selected_lib";
            out += "<tr class='librow "+selected_class+"' lib='" + z + "' type='" + type + "'>";
            out += "<td>" + z + "</td>";
            out += "<td>" + element_library[z].name;
            out += "<br><span style='font-size:13px'><b>Source:</b> " + element_library[z].source + "</span>";
            /*if (element_library[z].criteria.length)
             out += "<br><span style='font-size:13px'><b>Measure criteria:</b> " + element_library[z].criteria.join(", ") + "</span>";
             */
            out += "</td>";
            out += "<td style='font-size:13px'>";
            
            var uvalue = element_library[z].uvalue; if (typeof element_library[z].uvalue === 'object') uvalue = element_library[z].uvalue.mean;
            out += "<b>U-value:</b> " + uvalue + " W/m<sup>2</sup>.K";
            out += "<br><b>k-value:</b> " + element_library[z].kvalue + " kJ/m<sup>2</sup>.K";
            if (element_library[z].type == "Window" || element_library[z].type == "Door" || element_library[z].type == "Roof_light") {
                out += "<br><b>g:</b> " + element_library[z].g + ", ";
                out += "<b>gL:</b> " + element_library[z].gL + ", ";
                out += "<b>ff:</b> " + element_library[z].ff;
            }
            out += "</td>";
            out += "<td >";
            out += "<i style='cursor:pointer' class='icon-pencil if-write edit-library-item' lib='" + z + "' type='" + element_library[z].type + "' tag='" + z + "'></i>";
            out += "<i style='cursor:pointer;margin-left:20px' class='icon-trash if-write delete-library-item' lib='" + z + "' type='" + element_library[z].type + "' tag='" + z + "'></i>";
            // out += "<i class='icon-trash' style='margin-left:20px'></i>";
            
            // add-element & change-element handled in elements.js
            var action = "add-element";
            var row_attr = "";
            if (selected_lib) { 
                action = "change-element";
                row_attr = "row="+element_row;
            }
            out += "<button class='"+action+" use-from-lib btn' style='margin-left:20px' "+row_attr+" lib='" + z + "' type='" + element_library[z].type + "'>use</button</i>";
            out += "</td>";
            out += "</tr>";
        }
    }
    out += '</table>';
    return out;
};
libraryHelper.prototype.elements_measures_library_to_html = function (origin) {
    var out = this.elements_library_to_html(origin);
    return out;
};
libraryHelper.prototype.draught_proofing_measures_library_to_html = function (origin) {
    var out = "";
    var items = this.library.draught_proofing_measures;
    this.orderObjectsByKeys(items);
    for (z in items) {
        out += "<tr><td>" + z + ': ' + items[z].name + "</td>";
        out += "<td><b>q50:</b> " + items[z].q50 + " m<sup>3</sup>/hm<sup>2</sup></td>";
        out += "<td style='text-align:right;width:250px'>";
        out += "<button tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
        // out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn add-system use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
        out += "</td>";
        out += "</tr>";
    }
    return out;
};
libraryHelper.prototype.ventilation_systems_measures_library_to_html = function (origin) {
    return this.default_library_to_html(origin,'ventilation_systems_measures');
};
libraryHelper.prototype.ventilation_systems_library_to_html = function (origin) {
    var out = this.default_library_to_html(origin,'ventilation_systems');
    out = out.replace(/add-system/g, 'add-ventilation-system');
    return out;
};
libraryHelper.prototype.extract_ventilation_points_library_to_html = function (origin) {
    var out = this.default_library_to_html(origin,'extract_ventilation_points');
    out = out.replace(/add-system/g, 'add-EVP');
    return out;
};
libraryHelper.prototype.intentional_vents_and_flues_library_to_html = function (origin) {
    var out = "";
    var items = this.library.intentional_vents_and_flues;
    this.orderObjectsByKeys(items);
    for (z in items) {
        out += "<tr><td>" + z + ': ' + items[z].name + "</td>";
        out += "<td><b>Ventilation rate:</b> " + items[z].ventilation_rate + " m<sup>3</sup>/hm<sup>2</sup></td>";
        out += "<td style='text-align:right;width:150px'>";
        out += "<button tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
        // out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn add-IVF use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
        out += "</td>";
        out += "</tr>";
    }
    return out;
};
libraryHelper.prototype.intentional_vents_and_flues_measures_library_to_html = function (origin) {
    var out = "";
    var items = this.library.intentional_vents_and_flues_measures;
    this.orderObjectsByKeys(items);
    for (z in items) {
        out += "<tr><td>" + z + ': ' + items[z].name + "</td>";
        out += "<td><b>Ventilation rate:</b> " + items[z].ventilation_rate + " m<sup>3</sup>/hm<sup>2</sup></td>";
        out += "<td style='text-align:right;width:150px'>";
        out += "<button tag='" + z + "' library='" + selected_library.id + "' class='btn if-write edit-library-item'>Edit</button>";
        // out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn if-write delete-library-item'>Delete</button>";
        out += "<button style='margin-left:10px' tag='" + z + "' library='" + selected_library.id + "' class='btn add-IVF-measure use-from-lib'>Use</button>"; //the functionnality to add the system to the data obkect is not part of the library, it must be defined in system.js or somewhere else: $("#openbem").on("click", '.add-system', function () {.......
        out += "</td>";
        out += "</tr>";
    }
    return out;
};
libraryHelper.prototype.water_usage_library_to_html = function (origin) {
    var out = this.default_library_to_html(origin, 'water_usage');
    out = out.replace(/add-system/g, 'add-water_usage');
    return out;
};
libraryHelper.prototype.storage_type_library_to_html = function (origin) {
    var out = this.default_library_by_category_to_html(origin,'storage_type');
    out = out.replace(/add-system/g, 'add-storage-type');
    return out;
};
libraryHelper.prototype.storage_type_measures_library_to_html = function (origin) {
    var out = this.default_library_by_category_to_html(origin, 'storage_type_measures');
    out = out.replace(/add-system/g, 'add-storage-type-measure');
    return out;
};
libraryHelper.prototype.appliances_and_cooking_library_to_html = function (origin) {
    var out = "";
    var items = this.library.appliances_and_cooking
    this.orderObjectsByKeys(items);
    // order by category
    var ordered_by_categories = {};
    for (z in items) {
        var category = items[z].category;
        if (ordered_by_categories[category] == undefined)
            ordered_by_categories[category] = {};
        ordered_by_categories[category][z] = items[z];
    }

    // Prepare the output string
    for (category in ordered_by_categories) {
        out += "<tr><th colspan='2'>" + category + "</th></tr>";
        for (z in ordered_by_categories[category]) {
            out += "<tr><td style='padding-left:50px'>" + z + ': ' + items[z].name + "</td>";
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
libraryHelper.prototype.heating_control_library_to_html = function (origin) {
    var out = this.default_library_to_html(origin,'heating_control');
    out = out.replace(/add-system/g, 'add-heating-control');
    return out;
};
libraryHelper.prototype.heating_systems_library_to_html = function (origin) {
    var out = this.default_library_by_category_to_html(origin,'heating_systems');
    out = out.replace(/add-system/g, 'add-heating-system');
    return out;
};
libraryHelper.prototype.heating_systems_measures_library_to_html = function (origin) {
    var out = this.default_library_by_category_to_html(origin,'heating_systems_measures');
    out = out.replace(/add-system/g, 'add-heating-system-measure');
    return out;
};
libraryHelper.prototype.pipework_insulation_library_to_html = function (origin) {
    var out = this.default_library_to_html(origin,'pipework_insulation');
    out = out.replace(/add-system/g, 'add-pipework-insulation');
    return out;
};
libraryHelper.prototype.hot_water_control_type_library_to_html = function (origin) {
    var out = this.default_library_to_html(origin,'hot_water_control_type');
    out = out.replace(/add-system/g, 'add-storage-control-type');
    return out;
};
libraryHelper.prototype.space_heating_control_type_library_to_html = function (origin) {
    var out = this.default_library_to_html(origin,'space_heating_control_type');
    out = out.replace(/add-system/g, 'add-space-heating-control-type');
    return out;
};
libraryHelper.prototype.clothes_drying_facilities_library_to_html = function (origin) {
    var out = this.default_library_to_html(origin,'clothes_drying_facilities');
    out = out.replace(/add-system/g, 'add-clothes-drying-facilities');
    return out;
};
libraryHelper.prototype.generation_measures_library_to_html = function (origin) {
    var out = this.default_library_to_html(origin,'generation_measures');
    out = out.replace(/add-system/g, 'add-generation');
    return out;
};

/**********************************************
 * Items to html
 **********************************************/

libraryHelper.prototype.item_to_html = function (type, item, tag) {

    console.log(type);
    console.log(item);
    console.log(tag);
    
    var function_name = type+"_item_to_html";
    if (this[function_name]!=undefined) {
        console.log("item_to_html using fn");
        return this[function_name](item, tag);
    }
    console.log("item_to_html using default");
    
    if (item == undefined) item = libraryDefaults[type];
    else if (tag != undefined) item.tag = tag;
    
    var out = '<table class="table" style="margin:15px 0 0 25px"><tbody>';
    
    for (var property in libraryDefaults[type]) {
        var property_nicename = property.ucfirst().replace(/_/g," ");
        
        switch (typeof libraryDefaults[type][property]) {
            case "string":
                out += '<tr><td>'+property_nicename+'</td><td><input type="text" class="item-'+property+'" required value="'+item[property]+'"/></td></tr>';
                break;
            case "number":
                out += '<tr><td>'+property_nicename+'</td><td><input type="text" class="item-'+property+'" required value="'+item[property]+'"/></td></tr>';
                break;
            case "array":
                out += '<tr><td>'+property_nicename+'</td><td>';
                out += '<select class="item-'+property+'">';
                for (var option in libraryDefaults[type][property]) {
                    var selected = "";
                    if (libraryDefaults[type][property][option]==item[property]) selected = "selected";
                    out += '<option '+selected+'>'+libraryDefaults[type][property][option]+'</option>';
                }
                out += '</select></td></tr>';
                break;
            case "object":
                out += '<tr><td>'+property_nicename+'</td><td>';
                out += '<select class="item-'+property+'">';
                for (var option in libraryDefaults[type][property]) {
                    var selected = "";
                    if (libraryDefaults[type][property][option]==item[property]) selected = "selected";
                    out += '<option '+selected+' value='+option+'>'+libraryDefaults[type][property][option]+'</option>';
                }
                out += '</select></td></tr>';
                break;
        }
    }
    out += '</tbody></table>';
    return out;
    
/*
    if (item.ventilation_type == 'DEV' || item.ventilation_type == 'MEV' || item.ventilation_type == 'MVHR' || item.ventilation_type == 'MV')
    {
        out += '<tr><td>Air change rate - ach</td><td><input type="text" class="item-system_air_change_rate" value="' + item.system_air_change_rate + '" /></td></tr>';
        out += '<tr><td>Specific Fan Power - W/(litre.sec)</td><td><input type="text" class="item-specific_fan_power" value="' + item.specific_fan_power + '" /></td></tr>';
    } else {
        out += '<tr style="display:none"><td>Air change rate - ach</td><td><input type="text" class="item-system_air_change_rate" value="' + item.system_air_change_rate + '" /></td></tr>';
        out += '<tr style="display:none"><td>Specific Fan Power - W/(litre.sec)</td><td><input type="text" class="item-specific_fan_power" value="' + item.specific_fan_power + '" /></td></tr>';
    }
    if (item.ventilation_type == 'MVHR')
        out += '<tr><td>Balanced heat recovery efficiency (%)</td><td><input type="text" class="item-balanced_heat_recovery_efficiency" value="' + item.balanced_heat_recovery_efficiency + '" /></td></tr>';
    else
        out += '<tr style="display:none"><td>Heat recovery efficiency</td><td><input type="text" class="item-balanced_heat_recovery_efficiency" value="' + item.balanced_heat_recovery_efficiency + '" /></td></tr>';

    // Show hide "air change rate" and "heat recovery efficiannecy" accordint to the ventilation system
    if (item.ventilation_type == 'DEV' || item.ventilation_type == 'MEV' || item.ventilation_type == 'MVHR' || item.ventilation_type == 'MV')
    {
        // $('.item-system_air_change_rate').parent().parent().show('fast');
        $('.item-specific_fan_power').parent().parent().show('fast');
    }
    else
    {
        //$('.item-system_air_change_rate').parent().parent().hide('fast');
        $('.item-specific_fan_power').parent().parent().hide('fast');
    }
    if (item.ventilation_type == 'MVHR')
        $('.item-balanced_heat_recovery_efficiency').parent().parent().show('fast');
    else
        $('.item-balanced_heat_recovery_efficiency').parent().parent().hide('fast');
        
        */
};
/*****************************************************************
 * Get item to save in library (when editing or creating new item)
 *****************************************************************/
libraryHelper.prototype.get_item_to_save = function (type) {
    var item = {};
    var tag = $(".item-tag").val();
    item[tag] = {};
    for (var property in libraryDefaults[type]) {
        switch (typeof libraryDefaults[type][property]) {
            case "string":
                item[tag][property] = $(".item-"+property).val();
                break;
            case "number":
                item[tag][property] = 1*$(".item-"+property).val();
                break;
            case "array":
                item[tag][property] = $(".item-"+property).val();
                break;
        }
    }
    return item;
};

/***************************************************
 * Other methods
 ***************************************************/
 
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
 
 
libraryHelper.prototype.load_user_libraries = function (callback) {

    var test = [];
    $.ajax({ url: path+"assessment/listlibrary", dataType: 'json', async: false, success: function(result){
        test = result;
    }});
    this.library_list = test;
    
    //$.ajax({ url: path+"assessment/load-lib.json", dataType: 'json', async: false, success: function(result){
    //   this.library = result;
    //} });
      
};

libraryHelper.prototype.get_library_by_id = function (id) {
    return this.library_list;
};

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

libraryHelper.prototype.populate_measure_new_item = function (type_of_library) {
    console.log("populate_measure_new_item:"+type_of_library);
    
    var item_index = $('#replace-from-lib-items').val();
    console.log("item_index:"+item_index);
    
    
    var library = this.library[type_of_library];
    
    var original_item = JSON.parse($('#apply-measure-ok').attr('item'));
    var new_item = library[item_index];
    $('#apply-measure-item-fields').html('');
    var out = this.item_to_html(type_of_library, new_item, item_index);
    $('#apply-measure-item-fields').html(out);
};

libraryHelper.prototype.populate_library_modal = function (origin) {
    // Populate the select to choose library to display
    var out = '';
    for (var z in this.library_list) {
        out += "<option value=" + this.library_list[z].id + ">" + this.library_list[z].name + "</option>";
    }
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

};
libraryHelper.prototype.populate_selects_in_apply_measure_modal = function (type_of_library) {

    $("#replace-from-lib").attr('library_type', type_of_library);
    this.onChangeApplyMeasureReplaceFromLib(type_of_library); // This one to populate the select for items
};

libraryHelper.prototype.get_list_of_libraries_for_select = function (library_type) {
    var out = ''
    for (var z in this.library_list) {
        out += "<option value=" + this.library_list[z].id + ">" + this.library_list[z].name + "</option>";
    }
    return out;
}

libraryHelper.prototype.get_list_of_items_for_select = function (libraryid) {
    var out = ''
    var library = this.get_library_by_id(libraryid);
    for (item in library.data) {
        if (library.type == 'elements') {
            if (library.data[item].type.toUpperCase() == original_item.type.toUpperCase())
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
    var out = '<select class="item-cost_units">';
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
