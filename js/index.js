(function (window, document) {
    'use strict'; // Start of use strict

    var form = document.querySelector('form');
    var mcMap = {
        'utm_campaign': 'MMERGE6',
        'utm_source': 'MMERGE7',
        'utm_medium': 'MMERGE8',
        'utm_content': 'MMERGE9',
    };
    if (URLSearchParams) {

        (new URLSearchParams(window.location.search)).forEach(function (value, name) {
            if (mcMap[name]) {
                var input = document.createElement('input');
                input.setAttribute('type', 'hidden');
                input.setAttribute('name', mcMap[name]);
                input.setAttribute('value', value);
                form.appendChild(input);                
            }
        });
    }
  
    window.subscribed = function (result) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'event': 'formSubmit' });
        window.dataLayer.push({ 'event': 
            'success' == (result.result || '') 
                ? 'formSubmitSuccess' 
                : 'formSubmitError'
        });
        
        form.style.display = 'none';
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

    document.querySelectorAll('[data-start]').forEach(function (el) {
        var start = parseInt(el.dataset.start);
        setTimeout(function () {
            //console.log("start", start);
            if (el.nodeName == 'VIDEO') {
                el.classList.add('fade-in');
                el.play();
            } else {
                el.classList.add('fade-in');
            }
        }, start);
    });
    document.querySelectorAll('[data-stop]').forEach(function (el) {
        var stop = parseInt(el.dataset.stop);
        setTimeout(function () {
            //console.log("stop", stop);
            if (el.nodeName == 'VIDEO') {
                setTimeout(function () {
                    el.parentNode.removeChild(el);
                }, 1000);
            } else {
                el.classList.add('fade-out');
            }
        }, stop);
    });

    form.addEventListener('submit', formSubmit);
    window.scrollTo(0,1);

})(window, document); // End of use strict
