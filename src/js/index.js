const Form = require('./form.js');
const Plyr = require('plyr');

(function (window, document) {
    'use strict'; // Start of use strict

    const form = new Form('form');
    const hideForm = () => {
        const cta = document.querySelector('#cta');
        const thankYou = document.querySelector('#thank-you');
        form.form().classList.add('fade-out');
        cta.classList.add('fade-out');
        setTimeout(function () {
            cta.style.display = 'none';
            thankYou.style.display = 'block';
            thankYou.classList.add('fade-in');
        }, 500);
    }

    window.addEventListener('form:success', hideForm);
    window.addEventListener('form:error', hideForm);

    document.querySelectorAll('[data-start]').forEach(function (el) {
        var start = parseInt(el.dataset.start);
        setTimeout(function () {
            //console.log("start", start);
            el.classList.add('fade-in');
            if (el.nodeName == 'VIDEO') {
                el.play();
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

    var player = new Plyr('video');
    document.querySelector('.playbutton').addEventListener('click', function () {
        document.querySelector('body').classList.add('modal-open');
        document.querySelector('.modal').style.display = 'flex';
        player.play();
        // player.fullscreen.enter();
    });

    document.querySelector('.close').addEventListener('click', function () {
        player.stop();
        document.querySelector('.modal').style.display = 'none';
        document.querySelector('body').classList.remove('modal-open');
    });

})(window, document); // End of use strict
