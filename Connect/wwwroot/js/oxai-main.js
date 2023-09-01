function oxaiGetImgAttribute(element) {
    if (element.is("img, input[type='image'], video, audio, source")) {
        return "src";
    } else if (element.is("a")) {
        return "href";
    }
    return 'src'; // best guess
}


function oxaiGetParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function oxaiGetQueryParam(param) {
    // Extracts a query parameter's value by its name
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function oxaiGetElemVal(selector, defaultValue = null) {
    const element = $(selector);
    if (!element.length) return defaultValue;

    const tagName = element.prop('tagName').toLowerCase();
    let type = element.attr('type');

    switch (tagName) {
        case 'input':
            switch (type) {
                case 'radio':
                    return $('input[name="' + element.attr('name') + '"]:checked').val() || defaultValue;
                case 'checkbox':
                    if (element.is(':checked')) {
                        return element.val();
                    } else {
                        return defaultValue;
                    }
                case 'file':
                    return element[0].files || defaultValue;
                case 'range':
                case 'date':
                case 'time':
                case 'datetime-local':
                case 'week':
                case 'month':
                case 'text':
                case 'password':
                case 'search':
                default:
                    const val = element.val();
                    return (val && val.trim() !== "") ? val.trim() : defaultValue;
            }
        case 'select':
            return element.find('option:selected').val() || defaultValue;
        case 'textarea':
            const txtVal = element.val();
            return (txtVal && txtVal.trim() !== "") ? txtVal.trim() : defaultValue;
        case 'output':
            return element.val() || defaultValue;
        case 'progress':
        case 'meter':
        case 'details':
        case 'summary':
        default:
            return element.text().trim() || defaultValue;
    }
}

function oxaiElemHasVal(selector) {
    return oxaiGetElemVal(selector) !== null;
}
function oxaiElemIsNull(selector) {
    return oxaiGetElemVal(selector) == null;
}

function oxaiGetParamVals() {
    const urlParams = new URLSearchParams(window.location.search);
    let paramsObject = {};
    urlParams.forEach((value, key) => {
        paramsObject[key] = value;
    });
    return paramsObject;
}
function oxaiGetParamVal(paramName, defaultValue = null) {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(paramName);
    return (value && value.trim() !== "") ? value.trim() : defaultValue;
}

function oxaiSetElemVal(selector, value, force = false, clear = true) {
    const element = $(selector);
    if (!element.length) return; // Exit if element doesn't exist

    const tagName = element.prop('tagName').toLowerCase();
    let type = element.attr('type');

    const triggerEventUpdate = ['input', 'textarea', 'select'];

    switch (tagName) {
        case 'input':
            switch (type) {
                case 'radio':
                    if (clear) {
                        $('input[name="' + element.attr('name') + '"]').prop('checked', false);
                    }
                    const radioElem = $('input[name="' + element.attr('name') + '"][value="' + value + '"]');
                    if (force || !radioElem.is(':checked')) {
                        radioElem.prop('checked', true).trigger('change');
                    }
                    break;
                case 'checkbox':
                    if (force || element.is(':checked') !== !!value) {
                        element.prop('checked', !!value).trigger('change');
                    }
                    break;
                case 'file':
                    console.warn('Cannot set the value of file input programmatically.');
                    break;
                case 'range':
                case 'date':
                case 'time':
                case 'datetime-local':
                case 'week':
                case 'month':
                case 'text':
                case 'password':
                case 'search':
                default:
                    if (force || element.val() !== value) {
                        element.val(value);
                        if (triggerEventUpdate.includes(tagName)) {
                            element.trigger('change');
                        }
                    }
                    break;
            }
            break;
        case 'select':
            if (clear) {
                element.find('option').prop('selected', false);
            }
            if (force || element.val() !== value) {
                element.val(value).trigger('change');
            }
            break;
        case 'textarea':
            if (force || element.val() !== value) {
                element.val(value).trigger('change');
            }
            break;
        case 'output':
            if (force || element.val() !== value) {
                element.val(value);
            }
            break;
        case 'progress':
            if (force || element.attr('value') !== value) {
                element.attr('value', value);
            }
            break;
        case 'meter':
            if (force || element.attr('value') !== value) {
                element.attr('value', value);
            }
            break;
        case 'details':
        case 'summary':
        default:
            if (force || element.text() !== value) {
                element.text(value);
            }
            break;
    }
}
function oxaiClearElem(selector) {
    const element = $(selector);
    if (!element.length) return; // Exit if element doesn't exist

    const tagName = element.prop('tagName').toLowerCase();
    let type = element.attr('type');

    switch (tagName) {
        case 'input':
            switch (type) {
                case 'radio':
                    $('input[name="' + element.attr('name') + '"]').prop('checked', false);
                    break;
                case 'checkbox':
                    element.prop('checked', false).trigger('change');
                    break;
                case 'file':
                    console.warn('Cannot clear the value of file input programmatically due to security reasons.');
                    break;
                case 'range':
                    element.val(0).trigger('change'); // Assuming default range starts at 0
                    break;
                case 'date':
                case 'time':
                case 'datetime-local':
                case 'week':
                case 'month':
                case 'text':
                case 'password':
                case 'search':
                default:
                    element.val('').trigger('change');
                    break;
            }
            break;
        case 'select':
            element.prop('selectedIndex', -1).trigger('change'); // -1 means no option selected
            break;
        case 'textarea':
            element.val('').trigger('change');
            break;
        case 'output':
            element.val('');
            break;
        case 'progress':
            element.attr('value', 0); // Assuming default progress is 0
            break;
        case 'meter':
            element.attr('value', 0); // Assuming default meter value is 0
            break;
        case 'details':
        case 'summary':
        default:
            element.text('');
            break;
    }
}


function oxaiCategoryPageTitle() {
    var category = oxaiGetParameterByName('category');
    if (category) {
        document.getElementById('category-page-title').textContent = category;
    }
}

// Function to extract and map the query parameters
function extractQueryParameters() {
    let params = new URLSearchParams(window.location.search);

    // Extract parameters and assign to respective variables
    let select = params.get('q');
    let filter_category = params.get('in_cat');
    let filter_hq_state = params.get('in_loc');
    let star_rating = params.get('search_by_rating');
    let proximity_miles = params.get('miles');

    return {
        select,
        filter_category,
        filter_hq_state,
        star_rating,
        proximity_miles
    };
}

// The function that takes the extracted parameters
function oxaiListingsSearchGeneral(params) {
    // Use the parameters as needed. For example:
    console.log(params.select);
    console.log(params.filter_category);
    // ... and so on
}

function oxaiSearchResult() {
    let params = extractQueryParameters();
    oxaiListingsSearchGeneral(params);
}

function oxaiCapitalizeCityState(str) {
    if (str === null) return "Unlisted";
    return str.split(' ').map(function (word) {
        if (word.includes(',')) {
            return word.charAt(0).toUpperCase() + word.slice(1, word.length - 1) + ',' + word.slice(-1).toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

function oxaiMapGetParamsToPage(dictionary) {
    // Get the URL's query parameters
    var queryParams = new URLSearchParams(window.location.search);

    // Iterate through the dictionary's key-value pairs
    for (let [key, elementId] of Object.entries(dictionary)) {

        // Check if the query parameter exists in the URL
        if (queryParams.has(key)) {
            let value = queryParams.get(key);
            let selectorType = elementId.includes(":") ? elementId.split(":")[0] : "id";
            let identifier = elementId.includes(":") ? elementId.split(":")[1] : elementId;

            switch (selectorType) {
                case "class":
                    selector = "." + identifier;
                    break;
                case "id":
                default:
                    selector = "#" + identifier;
                    break;
            }
            if (!$(selector).length) {
                continue;
            }
            let $element = $(selector);
            // Determine how to set the value based on the element's tag name
            let xxx = $element.prop("tagName");
            switch ($element.prop("tagName").toUpperCase()) {
                case "SELECT":
                    // Set the value in the underlying <select> element
                    $element.val(value);
                    // Initialize or update Select2
                    $element.trigger('change');
                    // If you haven't initialized Select2 yet, you'll also need to do so:
                    $element.select2();
                    break;

                case "INPUT":
                case "TEXTBOX":
                case "TEXTAREA":
                case "SPAN":
                    $element.val(value);
                    break;

                case "TITLE":
                case "LABEL":
                case "H1":
                case "H2":
                case "P":
                    // Retain the inner content (e.g., child tags) and prepend the query value
                    $element.prepend(document.createTextNode(value));
                    break;

                // Add cases for other special tag types here

                default:
                    console.warn(`Unknown tag type: ${$element.prop("tagName")}`);
            }
        }
    }
}


function extractListings(selectors, listingsIndicator) {
    const listings = [];

    $(listingsIndicator).each(function () {
        const $this = $(this);
        const data = {
            org: {
                logo: $this.find(selectors.logo).attr('src') || null,
                websiteUrl: $this.find(selectors.websiteUrl).attr('href') || null,
                posted: $this.find(selectors.posted).text().replace("Posted ", "").trim() || null
            },
            data: {
                author: {
                    thumbnail: $this.find(selectors.authorThumbnail).attr('src') || null,
                    tooltip: $this.find(selectors.authorTooltip).text().trim() || null,
                    featuredBadge: $this.find(selectors.featuredBadge).text().trim() || null
                },
                indicators: {
                    starRating: $this.find(selectors.starRating).text().trim() || null,
                    price: $this.find(selectors.price).text().trim() || null,
                    viewCount: $this.find(selectors.viewCount).text().trim() || null,
                    openBadge: $this.find(selectors.openBadge).text().trim() || null
                },
                org: {
                    address: $this.find(selectors.address).text().trim() || null,
                    phone: $this.find(selectors.phone).text().trim() || null,
                    category: $this.find(selectors.category).text().trim() || null
                }
            }
        };

        listings.push(data);
    });

    return listings;
}

//// Usage example:
//const selectors = {
//    logo: '.atbd_listing_image img',
//    websiteUrl: '.atbd_listing_image a',
//    authorThumbnail: '.atbd_author a > img',
//    authorTooltip: '.atbd_author a > span',
//    featuredBadge: '.atbd_upper_badge span',
//    title: '.atbd_listing_title a',
//    starRating: '.atbd_meta.atbd_listing_rating',
//    price: '.atbd_listing_meta .atbd_listing_price',
//    openBadge: '.atbd_meta.atbd_badge_open',
//    address: '.atbd_listing_data_list li:first-child p',
//    phone: '.atbd_listing_data_list li:nth-child(2) p',
//    category: '.atbd_listing_category a',
//    viewCount: '.atbd_content_right .atbd_count span',
//    posted: '.atbd_listing_data_list li:last-child p'
//};

//const listingsData = extractListings(selectors, '.atbd_single_listing');





function populatePageListings(listingsOnPage, listingsData, dataPayload) {
    let dataEntries = dataPayload.value;

    for (let i = 0; i < listingsOnPage.length; i++) {
        oxaiPopulateListing(listingsOnPage[i], dataEntries[i], listingsData);
    }
}

function oxaiPopulateListing(eListing, dListing, map) {
    $(eListing).find(map.category).text(dListing.category || "Uncategorized");
    $(eListing).find(map.title).text(dListing.name);
    $(eListing).find(map.websiteUrl).attr("href", dListing.website_url || "unknown-company-website.html");
    $(eListing).find(map.logo).attr("src", dListing.logo || "");
    $(eListing).find(map.starRating).text(dListing.star_rating || "unrated");
    $(eListing).find(map.price).text(parseFloat(dListing["@search. Score"]).toFixed(1));
    $(eListing).find(map.phone).text(dListing.hq_phone || "Unlisted");
    let isFeatured = dListing.is_featured === "True";
    $(eListing).find(map.featuredBadge).text(isFeatured ? "Featured" : "").toggle(isFeatured);
    $(eListing).find(map.address).text(dListing.hq_address || "unlisted");

    let formattedDate = new Date(dListing.posted).toLocaleDateString("en-US");
    $(eListing).find(map.posted).text(formattedDate);

    $(eListing).find(map.authorThumbnail).attr("src", dListing.contact_thumb || "img/people/thumb/unlisted.png");

    let authorTooltip = "unregistered";
    if (dListing.contact_name && dListing.contact_title) {
        authorTooltip = `${dListing.contact_name} (${dListing.contact_title})`;
    } else if (dListing.contact_name) {
        authorTooltip = dListing.contact_name;
    } else if (dListing.contact_title) {
        authorTooltip = `(${dListing.contact_title})`;
    }
    $(eListing).find(map.authorTooltip).text(authorTooltip);
}

function oxaiLogFnNames(prefix) {
    let functionNames = [];

    for (let prop in window) {
        if (prop.startsWith(prefix) && typeof window[prop] === 'function') {
            functionNames.push(prop);
        }
    }

    functionNames.sort().forEach(funcName => {
        console.log(funcName); // logs the function name in alphabetical order
    });
}


async function oxaiNewPageClass(pageName) {
    const modulePath = `pages/${pageName}.js`;
    const module = await import(modulePath);
    const pageInstance = new module.PageClass();
    return pageInstance;
}






// PAGER
