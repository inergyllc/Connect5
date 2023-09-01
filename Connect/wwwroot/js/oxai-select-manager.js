function oxaiPopulateSelectFromAjax(selector, facet, selected) {
    // Build the AJAX endpoint URL
    var url = 'https://oxailistings.azurewebsites.net/api/metadata/facet?format=select2&facet=' + facet;

    // Clear the select element and add the first option
    $(selector).empty().append($('<option>', {
        value: '',
        text: 'Select a ' + facet
    }));

    // Make the AJAX request
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Loop through the results inside the "results" property
            $.each(data.results, function (index, item) {
                let value = item.id;
                let count = item.count;
                let text = `${value} (${count})`; 
                var option = $('<option>', {
                    value: value, // Assuming the item has a "value" property
                    text: text  // Assuming the item has a "text" property
                });

                // Check if the current item's value matches the selected value

                if (selected) { // This check ensures selected is not null or undefined
                    var cleanedItemValue = item.value.toLowerCase().replace(/\s+/g, '');
                    var cleanedSelected = selected.toLowerCase().replace(/\s+/g, '');
                    if (cleanedItemValue === cleanedSelected) {
                        option.attr('selected', 'selected');
                    }
                }


                // Append the option to the select element
                $(selector).append(option);
            });
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}


function oxaiPopulateGroupedSelectFromAjax(selector, selected) {
    // Endpoint URL
    const url = 'https://oxailistings.azurewebsites.net/api/metadata/facet/city_states';

    // Clear the current options and add the initial option
    $(selector).empty().append($('<option>', {
        value: '',
        text: 'Select a location'
    }));

    // Make the AJAX request
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Loop through the results
            $.each(data.results, function (index, result) {
                // Create an optgroup with the label being the "text" property of the result
                let optgroup = $('<optgroup>', {
                    label: result.text || "Unknown"
                });

                // Iterate through the children of the result
                $.each(result.children, function (childIndex, child) {
                    // Normalize the child id and the selected parameter
                    let normalizedChildId = child.id.toLowerCase().replace(/\s+/g, '');
                    let normalizedSelected = selected ? selected.toLowerCase().replace(/\s+/g, '') : null;

                    // Append each child as an option to the optgroup
                    let option = $('<option>', {
                        value: child.id,
                        text: child.text,
                        selected: normalizedChildId === normalizedSelected
                    });
                    optgroup.append(option);
                });

                // Append the optgroup to the select element
                $(selector).append(optgroup);
            });
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}
