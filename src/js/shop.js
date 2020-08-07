// const Form = require('./form.js');
const { tns } = require('tiny-slider/src/tiny-slider');

let mainSlider,
    thumsSlider

/* Thumbnails */

const thumsSliderOptions = {
    container: '.thumbnails',
    axis: window.outerWidth < 768 ? 'horizontal' : 'vertical',
    items: 3,
    slideBy: 3,
    autoplay: false,
    controls: false,
    nav: false,
    mouseDrag: true,
    loop: false,
    onInit: function( instance ) {

        const slides = Array.from( instance.slideItems )
        
        // Add active class to first thumb

        slides[ 0 ].classList.add( 'selected' )

        const onSlideStaticClick = function( e ) {
            const currentSlideClicked = slides.find( sl => sl === e.currentTarget )
            const indexWithinPage = slides.filter( sl => sl.classList.contains( 'tns-slide-active' ) ).findIndex( sl => sl === currentSlideClicked )

            // Manage active classes

            const selected = slides.find( sl => sl.classList.contains( 'selected' ) )

            if ( !! selected ) {
                selected.classList.remove( 'selected' )
            }

            currentSlideClicked.classList.add( 'selected' )

            // Sroll thumbs slider

            const thumbIndex = slides.findIndex( sl => sl === e.currentTarget )

            if ( indexWithinPage === 0 ) {
                thumsSlider.goTo( thumbIndex - 1 )
            } else if ( indexWithinPage === instance.items - 1 ) {
                thumsSlider.goTo( thumbIndex + 1 )
            }

            // Scroll to the target slide of the main slideshow

            mainSlider.goTo( thumbIndex )
        }

        slides.forEach( sl => sl.addEventListener( 'click', onSlideStaticClick, false ) )

        /* Rebuild slider on window resize */

        const rebuildSlider = axis => {
            thumsSlider.destroy()

            thumsSlider = tns( { ...thumsSliderOptions, axis: axis } )
        }

        let isSmallView = window.outerWidth < 768

        const changeSliderSettings = () => {
            if ( window.outerWidth < 768 ) {
                if ( ! isSmallView ) {
                    rebuildSlider( 'horizontal' )

                    isSmallView = true
                }
            } else if ( isSmallView ) {
                rebuildSlider( 'vertical' )

                isSmallView = false
            }
        }

        window.addEventListener( 'resize', changeSliderSettings, false )
    }
}

thumsSlider = tns( thumsSliderOptions )

/* Main carousel */

mainSlider = tns( {
    container: '.primary',
    items: 1,
    slideBy: 'page',
    autoplay: false,
    nav: false,
    mouseDrag: false,
    touch: false,
    onInit: function( instance ) {
        const navArrows = instance.controlsContainer.querySelectorAll( 'button' )

        Array.from( navArrows ).forEach( ( arrow, i ) => {    
            const screenReaderSpan = document.createElement( 'span' )

            screenReaderSpan.classList.add( 'screen-reader-text' )
            screenReaderSpan.textContent = arrow.textContent
            arrow.textContent = null
            arrow.appendChild( screenReaderSpan )

            /* Control thumbs slider scroll position and current class */

            arrow.addEventListener( 'click', function() {
                const thumbSlides = Array.from( thumsSlider.getInfo().slideItems )
                const clickedNext = i === 1
                const prevIndex = mainSlider.getInfo().displayIndex - 1
                const total = instance.slideCount
                
                let currentIndex

                if ( clickedNext ) {
                    currentIndex = prevIndex === total - 1 ? 0 : prevIndex + 1
                } else {
                    currentIndex = prevIndex === 0 ? total - 1 : prevIndex - 1
                }

                thumsSlider.goTo( currentIndex )

                const selected = thumbSlides.find( sl => sl.classList.contains( 'selected' ) )

                if ( !! selected ) {
                    selected.classList.remove( 'selected' )
                }

                thumbSlides.find( ( sl, index ) => index === currentIndex ).classList.add( 'selected' )
            }, false )
        } )
    }
} )

/* Colors */

const colors = Array.from( document.querySelector( '#color' ).querySelectorAll( 'input' ) )

colors.forEach( colorEl => {
    colorEl.addEventListener( 'click', function( e ) {
        colors.find( c => c.classList.contains( 'selected' ) ).classList.remove( 'selected' )

        colorEl.classList.add( 'selected' )
    } )
} )


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("cart");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-btn")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        event: 'order',
        color: document.querySelector("input.selected").id,
        quantity: document.querySelector("#quantity input").value,
        price: parseInt(document.getElementById("product-price").innerText.match(/\d+/)[0]),
    });
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
