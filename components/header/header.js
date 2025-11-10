
document.addEventListener('DOMContentLoaded', () => {
    
    // amburguesa
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            
            navMenu.classList.toggle('is-active');
        });
    }


    // header bonito translucido tipo aifon
    
    const header = document.querySelector('.header');
    const heroParallax = document.querySelector('.hero-parallax');
    
    
    if (!header || !heroParallax) return;

    const heroAnimationEnd = heroParallax.offsetHeight - window.innerHeight;
    let lastScrollY = window.scrollY; 

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= heroAnimationEnd) {
            
            header.classList.remove('is-scrolled');
            header.classList.remove('is-hidden');
            
        } else {
             
            header.classList.add('is-scrolled');

            
            if (currentScrollY > lastScrollY) {
                
                header.classList.add('is-hidden');
            } else {

                header.classList.remove('is-hidden');
            }
        }
        
        
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    });

});