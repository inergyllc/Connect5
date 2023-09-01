export class PageClass {
    // Instance property declaration
    pageId;
    tileset;
    tileSelector;

    elementSelectors = {
        search: "#search-field-text",
        category: "#search-field-category",
        location: "#search-field-location"
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
        pageId = "index",
        tileSelector = ".atbd_single_listing") {
        this.pageId = pageId;
        this.tileSelector = tileSelector;
    }

    async initializePage() {
        if (this.qSearch) { oxaiSetElemVal(this.e.search, this.qSearch); }
        if (this.qCategory) { oxaiSetElemVal(this.e.category, this.qCategory, true, true); }
        if (this.qLocation) { oxaiSetElemVal(this.e.location, this.qLocation); }
    }

    async initializeTiles() {
        this.tileset = await oxaiFetchTileSettings("search", this.pageId);
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
}

