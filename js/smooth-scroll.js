
document.addEventListener('DOMContentLoaded', function() {

    if (window.innerWidth > 1024) {


        
        let scrollSpeed = 0.8; 
        let currentScroll = window.pageYOffset;
        let targetScroll = currentScroll;
        
        window.addEventListener('wheel', function(e) {
            e.preventDefault();
            targetScroll += e.deltaY * scrollSpeed;
            targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));
        }, { passive: false });
        
        function smoothScroll() {
            currentScroll += (targetScroll - currentScroll) * 0.07; 
            window.scrollTo(0, currentScroll);
            requestAnimationFrame(smoothScroll);
        }
        
        smoothScroll();
        

    }

});