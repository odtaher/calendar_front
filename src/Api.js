/**
 * Api Class - a wrapper for fetch
 *
 * todos:
 * - ability to abort previous requests
 */
class Api {

    apiUri;
    headers;
    cached;

    constructor(apiUri) {
        this.apiUri = apiUri;
        this.prepareJsonHeader();
        this.cached = {};
        // this.controller = new AbortController();
    }

    /**
     *
     * @param path
     * @param getParams
     * @param enableCaching
     * @returns {Promise<Response>}
     */
    get(path, getParams = {}, enableCaching = false) {
        this.prepareJsonHeader();
        let cache = "no-cache";
        if (enableCaching && this.cached[this.fullUrl(path, getParams)]) {
            cache = "force-cache";
            this.cached[this.fullUrl(path, getParams)] = true;
        }

        // const signal = this.controller.signal;

        // if (this.controller) {
        //     this.controller.abort();
        // }

        const promise = fetch(this.fullUrl(path, getParams), {
            headers: this.headers,
            cache: cache,
            // signal: signal
        });

        this.controller = new AbortController();

        return promise;
    }

    /**
     *
     * @param path
     * @param getParams
     * @returns {string}
     */
    fullUrl(path, getParams = {}) {
        return `${this.apiUri}/${path}?${this.toQueryString(getParams)}`;
    }

    /**
     *
     * @param path
     * @param data
     * @returns {Promise<Response>}
     */
    post(path, data = {}) {
        this.preparePostHeader();
        console.info("fetch", fetch);
        return fetch(this.fullUrl(path), {
            method: "post",
            body: this.toQueryString(data),
            headers: this.headers
        });
    }

    /**
     *
     * @param path
     * @param data
     * @returns {Promise<Response>}
     */
    update(path, data = {}) {
        this.preparePostHeader();
        return fetch(this.fullUrl(path), {
            body: this.toQueryString(data),
            headers: this.headers,
            method: "put"
        });
    }

    /**
     *
     * @param path
     * @returns {Promise<Response>}
     */
    delete(path) {
        this.preparePostHeader();
        return fetch(this.fullUrl(path), {
            headers: this.headers,
            method: "delete"
        });
    }


    toQueryString(object) {
        return Object.keys(object).map(key => {
            let val = object[key];
            if (typeof (val) === 'boolean') {
                val = val === true ? 1 : 0;
            }
            return `${key}=${val}`;
        }).join("&");
    }

    prepareJsonHeader() {
        this.headers = {
            "Content-type": "application/json"
        }
    }

    preparePostHeader() {
        this.headers = {
            "Content-type": "application/x-www-form-urlencoded"
        }
    }

}

export default Api;