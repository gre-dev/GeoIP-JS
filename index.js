const axios = require('axios').default;

module.exports = class GREGeoIP {
    #key;
    #baseURL = 'https://gregeoip.com/';
    #availableGeoIPParams = ['location', 'security', 'timezone', 'currency', 'device'];
    #availableLanguages = ['EN', 'AR', 'DE', 'FR', 'ES', 'JA', 'ZH', 'RU'];
    #availableFormats = ['JSON', 'XML', 'CSV', 'Newline'];
    #availableCountryParams = ['language', 'flag', 'currency', 'timezone'];

    constructor(key) {
        if (key && key.length > 0) {
            this.#key = key;
        } else {
            console.log(key);
            throw new Error('You should pass the API Key.');
        }
    }

    #serialize = function (obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        return str.join('&');
    }

    #makeHttpRquest(endpoint, options, callback) {
        options.source = 'JS-Package';

        axios.get(this.#baseURL + '/' + endpoint + '?' + this.#serialize(options))
            .then(function (response) {
                if (response.status === 200) {
                    callback(response.data);
                } else {
                    throw new Error('An unknown error occurred while sending the request to GRE GeoIP API.');
                }
            })
            .catch(function (error) {
                console.error(error);
                throw new Error('An unknown error occurred while sending the request to GRE GeoIP API.');
            });
    }

    geoip(options = {}) {
        return new Promise((resolve, reject) => {
            let params = options.params || [];
            let format = options.format || 'JSON';
            let lang = options.lang || 'EN';
            let mode = options.mode || 'live';
            lang = lang.toUpperCase();

            // Validate the params variable items
            params.forEach(perParam => {
                if (perParam.length > 0) {
                    if (!this.#availableGeoIPParams.includes(perParam)) {
                        reject(new Error('The "' + perParam + '" module you used is unknown.\nYou can use: `location`, `security`, `timezone`, `currency` and/or `device`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/geoip-method#options'));
                    }
                }
            });

            // Validate the format variable
            if (!this.#availableFormats.includes(format)) {
                reject(new Error('The `format` option value "' + lang + '" you specified is unknown.\nYou can use: `JSON`, `XML`, `CSV` or `Newline`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/geoip-method#options'));
            }

            // Validate the lang variable
            if (!this.#availableLanguages.includes(lang)) {
                reject(new Error('The `lang` option value "' + lang + '" you specified is unknown.\nYou can use: `EN`, `AR`, `DE`, `FR`, `ES`, `JA`, `ZH` or `RU`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/geoip-method#options'));
            }

            // Validate the mode variable
            if (mode !== 'live' && mode !== 'test') {
                reject(new Error('The `mode` option value "' + lang + '" you specified is unknown.\nYou can use: `live` or `test`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/geoip-method#options'));
            }
            this.#makeHttpRquest('GeoIP', {
                'key': this.#key,
                'params': params.join(','),
                'format': format,
                'lang': lang,
                'mode': mode
            }, (res) => {
                if (typeof res !== 'object') res = JSON.parse(res);
                resolve(res);
            });
        });
    }

    lookup(options = {}) {
        return new Promise((resolve, reject) => {
            let ip = options.ip || '';
            let params = options.params || [];
            let format = options.format || 'JSON';
            let lang = options.lang || 'EN';
            let mode = options.mode || 'live';
            lang = lang.toUpperCase();

            // Validate the ip variable
            if (ip.length < 7) {
                reject(new Error('You should pass the `ip` parameter.'))
            }

            // Validate the params variable items
            params.forEach(perParam => {
                if (perParam.length > 0) {
                    if (!this.#availableGeoIPParams.includes(perParam)) {
                        reject(new Error('The "' + perParam + '" module you used is unknown.\nYou can use: `location`, `security`, `timezone`, `currency` and/or `device`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/lookup-method#options'));
                    }
                }
            });

            // Validate the format variable
            if (!this.#availableFormats.includes(format)) {
                reject(new Error('The `format` option value "' + lang + '" you specified is unknown.\nYou can use: `JSON`, `XML`, `CSV` or `Newline`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/lookup-method#options'));
            }

            // Validate the lang variable
            if (!this.#availableLanguages.includes(lang)) {
                reject(new Error('The `lang` option value "' + lang + '" you specified is unknown.\nYou can use: `EN`, `AR`, `DE`, `FR`, `ES`, `JA`, `ZH` or `RU`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/lookup-method#options'));
            }

            // Validate the mode variable
            if (mode !== 'live' && mode !== 'test') {
                reject(new Error('The `mode` option value "' + lang + '" you specified is unknown.\nYou can use: `live` or `test`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/lookup-method#options'));
            }
            this.#makeHttpRquest('IPLookup', {
                'ip': ip,
                'key': this.#key,
                'params': params.join(','),
                'format': format,
                'lang': lang,
                'mode': mode
            }, (res) => {
                if (typeof res !== 'object') res = JSON.parse(res);
                resolve(res);
            });
        });
    }

    country(options = {}) {
        return new Promise((resolve, reject) => {
            var countryCode = options.countryCode || '';
            var params = options.params || [];
            var format = options.format || 'JSON';
            var lang = options.lang || 'EN';
            var mode = options.mode || 'live';

            countryCode = countryCode.toUpperCase();
            lang = lang.toUpperCase();

            // Validate the countryCode variable
            if (countryCode.length !== 2) {
                reject(new Error('You should pass the `countryCode` parameter. Also, it should be a `ISO 3166-1 alpha-2` format.\nRead more at: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2'));
            }

            // Validate the params variable items
            params.forEach(perParam => {
                if (perParam.length > 0) {
                    if (!this.#availableCountryParams.includes(perParam)) {
                        reject(new Error('The "' + perParam + '" module you used is unknown.\nYou can use: `language`, `flag`, `currency` and/or `timezone`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/country-method#options'));
                    }
                }
            });

            // Validate the format variable
            if (!this.#availableFormats.includes(format)) {
                reject(new Error('The `format` option value "' + lang + '" you specified is unknown.\nYou can use: `JSON`, `XML`, `CSV` or `Newline`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/country-method#options'));
            }

            // Validate the lang variable
            if (!this.#availableLanguages.includes(lang)) {
                reject(new Error('The `lang` option value "' + lang + '" you specified is unknown.\nYou can use: `EN`, `AR`, `DE`, `FR`, `ES`, `JA`, `ZH` or `RU`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/country-method#options'));
            }

            // Validate the mode variable
            if (mode !== 'live' && mode !== 'test') {
                reject(new Error('The `mode` option value "' + lang + '" you specified is unknown.\nYou can use: `live` or `test`.\nRead more at: https://geoip-docs.gredev.io/sdks/js/country-method#options'));
            }
            this.#makeHttpRquest('Country', {
                'CountryCode': countryCode,
                'key': this.#key,
                'params': params.join(','),
                'format': format,
                'lang': lang,
                'mode': mode
            }, (res) => {
                if (typeof res !== 'object') res = JSON.parse(res);
                resolve(res);
            });
        });
    }
};