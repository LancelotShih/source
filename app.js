const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click', function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', (event) => {
    let currentIndex = 0;
    const images = document.querySelectorAll('.main__img');
    const totalImages = images.length;

    function showNextImage() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % totalImages;
        images[currentIndex].classList.add('active');
        console.log("next image set");
    }

    setInterval(showNextImage, 3000); // Change image every 3 seconds
});

// Project gallery image switch fuctionality

let slideIndex = 0;
let slideInterval;

function changeSlide(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("main__img");
    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.opacity = 0;
    }
    
    setTimeout(() => {
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }
        slides[slideIndex].style.display = 'block';
        setTimeout(() => {
            slides[slideIndex].style.opacity = 1;
        }, 10); // Slight delay to ensure display is set before changing opacity
    }, 1000); // Match this delay with your transition duration
}

function startSlideShow(interval) {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, interval);
}

function stopSlideShow() {
    clearInterval(slideInterval);
}

// Start the slideshow with a 5-second interval
showSlides(slideIndex);
startSlideShow(7000);



// Smooth scrolling to projects

function scrollToSection() {
    const element = document.getElementById('projects');
    const offset = 60; // Change this value to adjust the offset
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}




// // enable for mouse parallax effect
// (function() {
//     // Add event listener
//     document.addEventListener("mousemove", parallax);
//     const elem = document.querySelector("#parallax");
//     // Magic happens here
//     function parallax(e) {
//         let _w = window.innerWidth/2;
//         let _h = window.innerHeight/2;
//         let _mouseX = e.clientX;
//         let _mouseY = e.clientY;
//         let _depth1 = `${50 - (_mouseX - _w) * 0.01}% ${50 - (_mouseY - _h) * 0.01}%`;
//         let _depth2 = `${50 - (_mouseX - _w) * 0.02}% ${50 - (_mouseY - _h) * 0.02}%`;
//         let _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`;
//         let x = `${_depth3}, ${_depth2}, ${_depth1}`;
//         console.log(x);
//         elem.style.backgroundPosition = x;
//     }

// })();