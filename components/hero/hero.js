document.addEventListener('DOMContentLoaded', () => {
    
    window.addEventListener('scroll', handleHeroScroll);
});



function handleHeroScroll() {
    const heroSection = document.querySelector('.hero-parallax');
    if (!heroSection) return;

    const text1 = document.querySelector('.hero-text-1');
    const text2 = document.querySelector('.hero-text-2');
    const images = document.querySelectorAll('.hero-parallax__image-group img');

    
    const sectionTop = heroSection.offsetTop; 
    const sectionHeight = heroSection.offsetHeight; 
    const scrollPosition = window.scrollY; 
    let scrollProgress = (scrollPosition - sectionTop) / (sectionHeight - window.innerHeight);
    scrollProgress = Math.max(0, Math.min(1, scrollProgress));

    
   
    // fase 1
    const phase2Positions = [
        { x: -350 +50, y: -150 -50, r: -10, s: 1 }, // img 1 (s: 1 significa escala 100%)
        { x: 0,    y: -230, r: 0,  s: 1 }, // img 2
        { x: 350 -50,  y: -150 -50, r: 10, s: 1 }, // img 3
        { x: -300+50, y: 150 +50 ,  r: 10, s: 1 }, // img 4
        { x: 0,    y: 250,  r: -5, s: 1 }, // img 5
        { x: 300-50,  y: 150 +50,  r: -10,s: 1 }  // img 6
    ];

    // fase 2
    // posiciones justo debajo de la linea verde
    const phase3Positions = [
        { x: -125, y: 150, r: 0, s: 0.3 }, // img 1 (s: 0.3 significa escala 30%)
        { x: -75,  y: 150, r: 0, s: 0.3 }, // img 2
        { x: -25,  y: 150, r: 0, s: 0.3 }, // img 3
        { x: 25,   y: 150, r: 0, s: 0.3 }, // img 4
        { x: 75,   y: 150, r: 0, s: 0.3 }, // img 5
        { x: 125,  y: 150, r: 0, s: 0.3 }  // img 6
    ];

    


   if (scrollProgress < 0.33) {

        const phase1Progress = scrollProgress / 0.33; 

      
        text1.style.opacity = 1;
        text2.style.opacity = 0;
        
      
        images.forEach(img => {
            const startY = 600; 
            const currentY = startY * (1 - phase1Progress); 
            
            img.style.opacity = phase1Progress; 
            img.style.transform = `translate(-50%, -50%) translateY(${currentY}px) scale(1) rotate(0deg)`;
        });

    } else if (scrollProgress < 0.66) {


 
        const phase2Progress = (scrollProgress - 0.33) / 0.33;

    
        text1.style.opacity = 1 - phase2Progress;
        text2.style.opacity = phase2Progress; 

        
        images.forEach(img => {
            const index = parseInt(img.dataset.index) - 1;
            const p2 = phase2Positions[index];
            
         
            const currentX = p2.x * phase2Progress;
            const currentY = p2.y * phase2Progress;
            const currentRotate = p2.r * phase2Progress;

            img.style.opacity = 1; 
            img.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px) scale(1) rotate(${currentRotate}deg)`;
        });
    
    } else {


      
        const phase3Progress = (scrollProgress - 0.66) / 0.34; 
        
        text1.style.opacity = 0;
        text2.style.opacity = 1;

     
        images.forEach(img => {
            const index = parseInt(img.dataset.index) - 1; // 0 a 5
            
            const p2 = phase2Positions[index]; 
            const p3 = phase3Positions[index]; 


            
            const currentX = p2.x + (p3.x - p2.x) * phase3Progress;
            const currentY = p2.y + (p3.y - p2.y) * phase3Progress;
            const currentRotate = p2.r + (p3.r - p2.r) * phase3Progress;
            const currentScale = p2.s + (p3.s - p2.s) * phase3Progress; 

            img.style.opacity = 1; 
            img.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px) scale(${currentScale}) rotate(${currentRotate}deg)`;
        });
    }
}