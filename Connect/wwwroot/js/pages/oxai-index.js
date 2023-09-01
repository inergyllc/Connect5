function oxaiMergFeaturedTile(listing, data) {
    // jQuery reference for listing
    const $listing = $(listing);

    // 1. WEBSITE URL
    $listing.find('figure .atbd_listing_image a').attr('href', 'unknown-company-website.html');

    // 2. LOGO IMAGE
    oxaiTileLogo($listing, 'figure .atbd_listing_image img', data);
    //$listing.find('figure .atbd_listing_image img').attr('src', data.logo);

    // 3. CONTACT THUMBNAIL
    const $thumbElem = $listing.find('.atbd_author a img');
    if (data.contact_thumb) {
        $thumbElem.attr('src', data.contact_thumb);
    } else {
        $thumbElem.attr('src', 'img/people/thumb/unlisted.png');
    }

    // 4. Set contact name and title tooltip
    const tooltipElem = $listing.find('.atbd_author span.custom-tooltip');
    let contact = "No Contact";
    if (data.contact_name && data.contact_title) {
        contact = `${data.contact_name} (${data.contact_title})`;
    } else if (data.contact_name) {
        contact = data.contact_name;
    } else if (data.contact_title) {
        contact = `(${data.contact_title})`;
    }
    tooltipElem.text(contact);

    // 5. Random badge value
    const badges = ["Featured", "New", "Popular"];
    const chosenBadges = [];
    $listing.find('ul.atbd_upper_badge li').each(function () {
        let badge = badges[Math.floor(Math.random() * badges.length)];
        while (chosenBadges.includes(badge)) {
            badge = badges[Math.floor(Math.random() * badges.length)];
        }
        chosenBadges.push(badge);
        $(this).find('span').text(badge);
    });

    // 6. Set the company name
    $listing.find('h4.atbd_listing_title a').text(data.name);

    // 7. Set star rating
    const $ratingElem = $listing.find('span.atbd_meta.atbd_listing_rating');
    if (data.star_rating != "unrated") {
        $ratingElem.append($ratingElem.find('i.la.la-star'));
    }
    $ratingElem.text(data.star_rating);

    // 8. Set verified text
    $listing.find('span.atbd_meta.atbd_listing_price').text("Verified");

    // 9. Set open/closed status
    // const status = Math.random() < 0.5 ? "Open Now" : "Closed";
    // $listing.find('span.atbd_meta.atbd_badge_open').text(status);

    // 10. Set city and state
    var citySt = oxaiCapitalizeCityState(data.city_state);
    $listing.find('p > span.la.la-map-marker').parent().html(`<span class="la la-map-marker"></span> ${citySt}`);

    // 11. Set phone number
    $listing.find('p > span.la.la-phone').parent().html(`<span class="la la-phone"></span> ${data.hq_phone}`);

    // 12. Set posted date
    $listing.find('p > span.la.la-calendar-check-o').parent().html(`<span class="la la-calendar-check-o"></span> ${data.posted}`);

    // 13. Set category
    const truncatedCategory = data.category.length > 22 ? `${data.category.substring(0, 20)}..` : data.category;
    $listing.find('div.atbd_listing_category a').html(`<span class="la la-info"></span> ${truncatedCategory}`);

    // 14. Set random view count
    const $viewLiElem = $listing.find('ul.atbd_content_right li.atbd_count');
    const randomViewCount = Math.floor(Math.random() * (901 - 20) + 20);
    $viewLiElem.html(`${$viewLiElem.find('span').prop('outerHTML')} ${randomViewCount}+`);
}

function oxaiPopulateFeaturedListings(repeatingTagName) {
    var listings = $(repeatingTagName);
    var count = listings.length;
    var url = `https://oxailistings.azurewebsites.net/api/listings/featured?count=${count}&startat=0`;

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        headers: {
            'referrerPolicy': 'no-referrer'
        },
        success: function (data) {
            $.each(data.value, function (index, item) {
                if (listings[index]) {
                    oxaiMergFeaturedTile($(listings[index]), item);
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error fetching data:', errorThrown);
        }
    });
}

//function oxaiPopulateFeaturedListings(repeatingTagName) {
//    // URL of your REST service
//    var listings = document.querySelectorAll(repeatingTagName);
//    var count = listings.length;
//    var url = `https://oxailistings.azurewebsites.net/api/listings/featured?count=${count}&startat=0`;

//    // Fetch data from the service
//    fetch(url, {
//        referrerPolicy: "no-referrer"
//    })
//        .then(response => response.json())
//        .then(data => {
//            for (let i = 0; i < data.value.length; i++) {
//                mergeFeaturedIntoListing(listings[i], data.value[i]);
//            }
//        })
//        .catch(error => {
//            console.error('Error fetching data:', error);
//        });
//}

function oxaiPopulateTestimonials(selector) {
    const newImages = [
        'img/people/mid/generic-person-12.png',
        'img/people/mid/generic-person-14.png',
        'img/people/mid/generic-person-20.png'
    ];

    $(selector).each(function (index) {
        if (index < newImages.length) {
            $(this).attr('src', newImages[index]);
        }
    });
}