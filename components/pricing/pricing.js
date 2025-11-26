document.addEventListener('DOMContentLoaded', () => {
    
    const toggle = document.getElementById('pricing-toggle');
    
    const priceMonthly = document.getElementById('price-monthly');
    const priceAnnual = document.getElementById('price-annual');
    const priceAnnualStrikethrough = document.getElementById('price-annual-strikethrough');

    function updatePrices() {
        if (toggle.checked) {
            priceMonthly.classList.remove('hidden');
            priceAnnual.classList.add('hidden');
            priceAnnualStrikethrough.classList.add('hidden');
        } else {
            priceMonthly.classList.add('hidden');
            priceAnnual.classList.remove('hidden');
            priceAnnualStrikethrough.classList.remove('hidden');
        }
    }

    if (toggle && priceMonthly && priceAnnual && priceAnnualStrikethrough) {
        toggle.addEventListener('change', updatePrices);
    }

    const modal = document.getElementById('compare-modal');
    const btnTrigger = document.getElementById('compare-trigger');
    const spanClose = document.querySelector('.modal__close');
    
    const btnFree = document.getElementById('btn-highlight-free');
    const btnPro = document.getElementById('btn-highlight-pro');
    
    const freeCells = document.querySelectorAll('.col-free');
    const proCells = document.querySelectorAll('.col-pro');

    let activePlan = null; 

    function clearHighlights() {
        freeCells.forEach(cell => cell.classList.remove('highlighted-column'));
        proCells.forEach(cell => cell.classList.remove('highlighted-column'));

        if(btnFree) {
            btnFree.classList.remove('is-active');
            btnFree.style.opacity = "1";
        }
        if(btnPro) {
            btnPro.classList.remove('is-active');
            btnPro.style.opacity = "1";
        }
        
        activePlan = null;
    }

    function highlightFree() {
        clearHighlights(); 
        freeCells.forEach(cell => cell.classList.add('highlighted-column'));
        
        // Activar botón Free, atenuar Pro
        if(btnFree) btnFree.classList.add('is-active');
        if(btnPro) btnPro.style.opacity = "0.5"; 
        
        activePlan = 'free';
    }

    function highlightPro() {
        clearHighlights(); 
        proCells.forEach(cell => cell.classList.add('highlighted-column'));
        
        // Activar botón Pro, atenuar Free
        if(btnPro) btnPro.classList.add('is-active');
        if(btnFree) btnFree.style.opacity = "0.5"; 
        
        activePlan = 'pro';
    }

    if (btnFree) {
        btnFree.addEventListener('click', (e) => {
            e.preventDefault();
            if (activePlan === 'free') {
                clearHighlights(); 
            } else {
                highlightFree();
            }
        });
    }

    if (btnPro) {
        btnPro.addEventListener('click', (e) => {
            e.preventDefault();
            if (activePlan === 'pro') {
                clearHighlights(); 
            } else {
                highlightPro();
            }
        });
    }

    if (btnTrigger && modal) {
        btnTrigger.onclick = function() {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; 
            clearHighlights(); 
        }
    }

    if (spanClose) {
        spanClose.onclick = function() {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
});