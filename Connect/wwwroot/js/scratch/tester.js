function populateSelect(selector, facet, selected) {
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
            // Loop through the results and append each as an option to the select element
            $.each(data, function (index, item) {
                var option = $('<option>', {
                    value: item.value, // Assuming the item has a "value" property
                    text: item.text    // Assuming the item has a "text" property
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
