function oxaiLoadOptions(tagName, facetName) {
    // URL of your REST service
    const url = `https://oxailistings.azurewebsites.net/api/metadata/facet?facet=${facetName}`;


    // Fetch data from the service
    fetch(url, {
        referrerPolicy: "no-referrer"
    })
        .then(response => response.json())
        .then(data => {
            oxaiPopulateSelectFromJson(data, tagName);

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

async function oxaiLoadCategories(tagName) {
    const url = `https://oxailistings.azurewebsites.net/api/metadata/facet/count?facet=${facetName}`;

    try {
        const response = await fetch(url, {
            referrerPolicy: "no-referrer"
        });

        const data = await response.json();

        const selectElement = document.querySelector(`select[id="${tagName}"]`);
        selectElement.innerHTML = '';
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.display;
            selectElement.appendChild(option);
        });
        selectElement.selectedIndex = -1;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function oxaiAjaxSelectOptions(
    targetSelector,
    facetName,
    facetValue) {
    let isClass = targetSelector.startsWith('.');
    let selector = isClass ? targetSelector : '#' + targetSelector;
    $(selector).select2({
        ajax: {
            url: `https://oxailistings.azurewebsites.net/api/metadata/facet?facet=${facetName}`
        }
    });
} 




function oxaiPopulateFeaturedListingCount(elemId) {
    // Define the URL from where we want to fetch the count
    const url = 'https://oxailistings.azurewebsites.net/api/listings/featured/count';

    // Fetch the data from the URL
    fetch(url)
        .then(response => {
            // Make sure the request was successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON data from the response
        })
        .then(data => {
            // Get the count value from the JSON payload
            const count = data["@odata.count"];

            // Get the element by its ID
            const element = document.getElementById(elemId);

            // Insert the count into the element's text content
            if (element) {
                element.textContent = count;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
}

