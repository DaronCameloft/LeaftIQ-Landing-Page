/* ==================== PRICING TOGGLE LOGIC ==================== */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Seleccionar los elementos del DOM
    const toggle = document.getElementById('pricing-toggle');
    
    // Precios a mostrar/ocultar
    const priceMonthly = document.getElementById('price-monthly');
    const priceAnnual = document.getElementById('price-annual');
    const priceAnnualStrikethrough = document.getElementById('price-annual-strikethrough');

    // 2. Función para actualizar los precios
    function updatePrices() {
        if (toggle.checked) {
            // Está en "Mensualmente"
            priceMonthly.classList.remove('hidden');
            priceAnnual.classList.add('hidden');
            priceAnnualStrikethrough.classList.add('hidden');
        } else {
            // Está en "Anualmente" (default)
            priceMonthly.classList.add('hidden');
            priceAnnual.classList.remove('hidden');
            priceAnnualStrikethrough.classList.remove('hidden');
        }
    }

    // 3. Añadir el Event Listener
    if (toggle && priceMonthly && priceAnnual && priceAnnualStrikethrough) {
        toggle.addEventListener('change', updatePrices);
    }
    
});