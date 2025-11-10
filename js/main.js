document.addEventListener('DOMContentLoaded', function() {

    let scrollSpeed = 0.9; //velocidad rueda
    
    let currentScroll = window.pageYOffset;
    let targetScroll = currentScroll;
    
    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        targetScroll += e.deltaY * scrollSpeed;
        targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));
    }, { passive: false });
    
    function smoothScroll() {
        currentScroll += (targetScroll - currentScroll) * 0.06; // suavidad
        window.scrollTo(0, currentScroll);
        requestAnimationFrame(smoothScroll);
    }
    
    smoothScroll();
});