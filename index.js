const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click', function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const fadeInElements = document.querySelectorAll('.about-me__content');

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 1 // Trigger when 10% of the element is in view
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            console.log(entry);
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally, unobserve the element after it becomes visible
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    fadeInElements.forEach(element => {
        observer.observe(element);
    });
});



// backspace effect lol
document.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById('typing-effect');
    const phrases = ['Hey!', '你好', 'Ciao!', 'Hey!','안녕하세요', 'Hola!', 'Hey!','привет', 'やあ', 'Hey!','अरे', 'Olá!']; // Array of phrases
    const typingSpeed = 100; // Speed of typing in milliseconds
    const deletingSpeed = 50; // Speed of deleting in milliseconds
    const pauseDuration = 1000; // Duration to pause before starting next phrase

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        const displayText = currentPhrase.substring(0, charIndex);

        element.textContent = displayText;

        if (!isDeleting) {
            if (charIndex < currentPhrase.length) {
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, pauseDuration);
            }
        } else {
            if (charIndex > 0) {
                charIndex--;
                setTimeout(type, deletingSpeed);
            } else {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, pauseDuration);
            }
        }
    }

    type();
});


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