require('custom-event-polyfill');

class Form {
    #element = null;
    #map = {
        'utm_campaign': 'MMERGE6',
        'utm_source': 'MMERGE7',
        'utm_medium': 'MMERGE8',
        'utm_content': 'MMERGE9',
    }
    static i = 0;
    constructor(selector) {
        this.element = document.querySelector(selector);

        (new URLSearchParams(window.location.search)).forEach((value, name) => {
            this.set(name, value);
            document.cookie = '_url_param_' + name + '=' + value + '; max-age=' + 60*60*24*365;
        });

        const callback = "onFormSuccess_" + Form.i++;

        window[callback] = function (result) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'formSubmit',
                category: 'form',
                action: 'submit',
                label:
                    'success' === (result.result || '')
                        ? 'success'
                        : 'error'
            });
            if ('success' === result.result) {
                window.dispatchEvent(new CustomEvent('form:success', { detail: this }));
            } else {
                window.dispatchEvent(new CustomEvent('form:error', { detail: this }));

            }
        };

        const formSubmit = (e) => {
            e.preventDefault();

            const data = new URLSearchParams();

            const cookies = document.cookie.split(/; */);
            for (var j = 0; j < cookies.length; j++) {
                const pair = cookies[j].split('=');
                if (pair) {
                    const matches = pair[0].match(/^_url_param_(.*)/);
                    if (matches && matches[1]) {
                        data.append(matches[1], pair[1]);
                    }
                }
            }

            const action = this.form().getAttribute('action').replace('/post?', '/post-json?');
            (new FormData(this.form())).forEach(function (value, field) {
                data.append(field, value);
            });
            data.append('c', callback);

            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = action + '&' + data;
            head.appendChild(script);
            this.form().removeEventListener('submit', formSubmit);
        };
        this.form().addEventListener('submit', formSubmit);

    }
    form() {
        return this.element;
    }
    set(name, value) {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', name);
        input.setAttribute('value', value);
        this.form().appendChild(input);
    }
}

module.exports = Form;
