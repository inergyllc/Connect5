function oxaiTileLogo(tile, selector, data) {
    let $target = tile.find(selector);
    if ($target == undefined || $target == null || !$target.length) {
        return;
    }
    let attribute = oxaiGetImgAttribute($target);
    if (data.logo) {
        $target.attr(attribute, data.logo);
    } else if ($target.length) {
        $target.attr(attribute, "");
    }
}
function oxaiFetchTileSettings(payloadType, consumer) {
    // Define the path to the settings file
    const settingsUrl = 'json/tiles.settings.json';

    // Return the Promise
    return fetch(settingsUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Extract the tileset for the given payload type
            const tileset = data.tilesets.find(t => t.payloadType === payloadType);
            if (!tileset) {
                throw new Error('Tileset not found for payload type: ' + payloadType);
            }

            // Extract the map for the given consumer
            const mapping = tileset.maps.find(m => m.consumers.includes(consumer));
            console.log(tileset.maps);
            if (!mapping) {
                throw new Error('Mapping not found for consumer: ' + consumer);
            }

            // Return an object containing payload-type, consumer, url, and map
            return {
                'payload-type': payloadType,
                'consumer': consumer,
                'url': tileset.url,
                'map': mapping.map
            };
        });
}


function oxaiPopulateListingsOnPage(url, tileSelector, map) {
    let resultCount = 0;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let dataEntries = response.value;
            let listingsOnPage = $(tileSelector);
            let resultCount = response['@odata.count'];
            oxaiSetElemVal('#oxai-total-listings-found', resultCount, true);
            for (let i = 0; i < listingsOnPage.length; i++) {
                // If there's a corresponding data entry, populate the listing
                if (dataEntries[i]) {
                    oxaiPopulateListing(listingsOnPage[i], dataEntries[i], map);
                }
                // Else, hide the listing
                else {
                    $(listingsOnPage[i]).hide();
                }
            }
        },
        error: function (error) {
            console.error("Error fetching data:", error);
            // If there's an error, hide all listings
            $(tileSelector).hide();
        }
    });
    return resultCount;
}

// The master function
// Here is the flow
// 1. Fetch tile settings
// 1.a. Includes url to get the listings data payload
// 1.b. Includes map to map the data payload to one tile
// 2. Condition the URL
// 2.a. Each pageIdentifier has its own conditioning function
// 2.b. The function is named oxaiConditionTileUrlFor{PageIdentifier}
// 2.b.1. Name is constructed by cleaning pageIdentifier
// 2.b.2. EXAMPLE: all-listings-grid = oxaiConditionTileUrlForAllListingsGrid
// 2.c. The function is dynamically called based on the pageIdentifier
// 2.c.1. The function is called with the URL as the parameter
// 2.c.2. The function returns the conditioned URL
// 2.c.3. The function is expected to be defined in the page's JS file
// 2.c.4. EXAMPLE: https://oxailistings.azurewebsites.net/api/listings/query?search=drilling
// 3. Populate the listings on the page
// 3.a. The URL is passed to the populateListingsOnPage function
// 3.b. The Map is passed to the populateListingsOnPage function
// 3.c. The function walks through the payload mapping to the tiles
// NOTES1: Maps are a mapping of a single tile to a single payload entry
// NOTES2: tileTypes (so far) are:
//      - search - parameterized listing search
//      - featured - no parameters featured listings search
// NOTES3: mapId is which map under the tileType matches to the current page
//      - For now the mapId is the pagename with the .html
//      - EXAMPLE: all-listings-grid.html->all-listings-grid
//      - This will probably change as reuse becomes available
function oxaiPopulateTiles(tileType, singleTileSelector, pageName) {
    oxaiPopulateListingsOnPage(url, singleTileSelector, settings.map)
        .then(() => {
            console.log('Populated tiles successfully');
        })
        .catch(error => {
            console.error('Error while populating tiles:', error);
        });
}