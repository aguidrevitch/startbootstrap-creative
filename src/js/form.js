require('custom-event-polyfill');

class Form {
    #element = null;
    static i = 0;
    constructor(selector) {
        this.element = document.querySelector(selector);

        (new URLSearchParams(window.location.search)).forEach((value, name) => {
            this.set(name, value);
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

            const action = this.form().getAttribute('action').replace('/post?', '/post-json?');
            const data = new URLSearchParams();
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
