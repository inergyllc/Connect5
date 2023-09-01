import Pager from './pager.js';
export class PageClass {
    // Instance property declaration

    elementSelectors = {
        search: "#search-field-text",
        category: "#search-field-category",
        location: "#search-field-location",
        filters: {
            sameState: "#tag9",
            sameCity: "#tag10"
        }
    };
    queryParamNames = {
        search: "search",
        category: "category",
        location: "location"
    };
    // Query parameter convenince
    get q() { return this.queryParamNames; }
    // Element value convenince
    get e() { return this.elementSelectors; }
    // q<val> = Query paramter values
    get qSearch() {
        return oxaiGetParamVal(this.q.search);
    }
    get qCategory() {
        return oxaiGetParamVal(this.q.category);
    }
    get qLocation() {
        let location = oxaiGetParamVal(this.q.location);
        if (location) {
            let parts = location.split(',', 2);
            let rparts = parts.reverse();
            let jparts = rparts.join(', ');
            let tparts = jparts.trim();
        }
        return location;
    }

    // Constructor definition
    constructor(
        pageId = "all-listings-grid",
        tileSelector = ".atbd_single_listing") {
        this.pageId = pageId;
        this.tileSelector = tileSelector;
        let y = new Pager(1, 6, 0);
        this.pager = y;
    }

    async initializePage() {
        // 1. set search from query parms and initialize filters
        await this.initializeFilters();
        // 2. retrieve and display tiles
        await this.initializeTiles();
        // 3. Manage onscreen pager
        await this.initializePager();
    }

    // BEGIN PAGER

    async initializePager() {
        this.pager.PutOnPage();
    }
    // END PAGER


    // BEGIN FILTERS
    async initializeFilters() {
        if (this.qSearch) { oxaiSetElemVal(this.e.search, this.qSearch); }
        if (this.qCategory) {
            oxaiSetElemVal(this.e.category, this.qCategory, true, true);
        } else {
            oxaiClearElem(this.e.category);
        }
        if (this.qLocation) { oxaiSetElemVal(this.e.location, this.qLocation); }

        // FILTERS
        await this.updateFilters();
    }

    // Onscreen data modifies which filter buttons and options
    // are availble for use
    async updateFilters() {
        $(this.e.filters.sameCity, this.e.filters.sameState)
            .prop('disabled', oxaiElemIsNull(this.e.location));
    }
    // END FILTERS


    // BEGIN TILES
    async initializeTiles() {
        this.tileset = await oxaiFetchTileSettings("search", this.pageId);
        this.pager.total =
            await oxaiPopulateListingsOnPage(
                this.tileUrl,
                this.tileSelector,
                this.tileMap);
    }

    get tileMap() {
        return this.tileset.map;
    }

    get tileUrl() {
        let params = [];
        let search = oxaiGetElemVal(this.e.search);
        let category = oxaiGetElemVal(this.e.category);
        let location = oxaiGetElemVal(this.e.location);
        if (search) params.push(`search=${search}`);
        if (category) params.push(`category=${category}`);
        if (location) params.push(`location=${location}`);

        return this.tileset.url +
            (params.length > 0 ? '?' + params.join('&') : '');
    }
    // END TILES

}

