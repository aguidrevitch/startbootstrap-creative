// const Form = require('./form.js');
const { tns } = require('tiny-slider/src/tiny-slider');

const slider = tns({
    container: '.thumbnails',
    axis: 'vertical',
    items: 3,
    slideBy: 'page',
    autoplay: false,
    controls: false,
    nav: false,
    mouseDrag: true,
    onInit: function () {
        var primary = document.querySelector('.primary');
        var thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                primary.style.backgroundImage = "url(" + el.dataset['big'] + ")";
                thumbnails.forEach(function (t) {
                    t.classList.remove('selected');
                })
                el.classList.add('selected');
            });
        })
    }
});


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("cart");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-btn")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
