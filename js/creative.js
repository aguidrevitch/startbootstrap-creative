(function (window, document) {
    'use strict'; // Start of use strict

    var form = document.querySelector('form');
  
    window.subscribed = function (result) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'event': 'formSubmit' });
        window.dataLayer.push({ 'event': 
            'success' == (result.result || '') 
                ? 'formSubmitSuccess' 
                : 'formSubmitError'
        });
        
        form.classList.add('fade-out');
        document.querySelector('#thank-you').style.display = 'block';
        document.querySelector('#thank-you').classList.add('fade-in');
    };

    var formSubmit = function (e) {
        e.preventDefault();

        var action = form.getAttribute('action').replace('/post?', '/post-json?');
        var data = new URLSearchParams();
        (new FormData(form)).forEach(function (value, field) {
            data.append(field, value);
        });
        data.append('c', 'subscribed');

        var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.src= action + '&' + data;
        head.appendChild(script);

        form.removeEventListener('submit', formSubmit);
    };

    form.addEventListener('submit', formSubmit);

})(window, document); // End of use strict
