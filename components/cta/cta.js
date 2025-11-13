/* components/cta/cta.js */

document.addEventListener('DOMContentLoaded', () => {
    
    const ctaSection = document.querySelector('.cta');
    if (!ctaSection) return;

    // Elementos HTML
    const wordElements = document.querySelectorAll('.cta__word');
    const phoneElement = document.querySelector('.cta__image-wrapper');

    // Módulos de Matter.js
    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Runner = Matter.Runner;

    // Variables de la Simulación
    let engine;
    let world;
    let runner;
    let dynamicBodies = [];

    // --- Función para iniciar la simulación ---
    function initPhysics() {
        engine = Engine.create();
        world = engine.world;
        engine.world.gravity.y = 1; 
        dynamicBodies = [];

        // 2. Crear las "paredes" del escenario
        const sectionWidth = ctaSection.offsetWidth;
        const sectionHeight = ctaSection.offsetHeight;

        const walls = [
            // Suelo
            Bodies.rectangle(sectionWidth / 2, sectionHeight - 150, sectionWidth, 100, { isStatic: true }),
            // Pared Izquierda
            Bodies.rectangle(-50, sectionHeight / 2, 100, sectionHeight * 2, { isStatic: true }),
            // Pared Derecha
            Bodies.rectangle(sectionWidth + 50, sectionHeight / 2, 100, sectionHeight * 2, { isStatic: true })
        ];
        World.add(world, walls);

        // 3. Crear el "celular" (estático) - ¡AQUÍ ESTÁ EL CAMBIO PRINCIPAL!
        const phoneRect = phoneElement.getBoundingClientRect();
        const sectionRect = ctaSection.getBoundingClientRect();
        
        // Posición relativa a la SECCIÓN, no a la página
        const phoneX = phoneRect.left - sectionRect.left + (phoneRect.width / 2);
        const phoneY = phoneRect.top - sectionRect.top + (phoneRect.height / 2);

        const phoneCollider = Bodies.rectangle(
            phoneX,
            phoneY,
            phoneRect.width * 0.9,
            phoneRect.height * 0.98,
            { 
                isStatic: true,
                chamfer: { radius: 24 },
                friction: 0.9,
                // Opcional: Para debug visual
                render: {
                    fillStyle: 'rgba(255, 0, 0, 0.2)' // Rojo semi-transparente
                }
            }
        );
        World.add(world, phoneCollider);

        // 4. Crear las "palabras" (dinámicas)
        wordElements.forEach(wordEl => {
            const rect = wordEl.getBoundingClientRect();
            
            // Caer desde el centro con variación
            const startX = (sectionWidth / 2) + (Math.random() - 0.5) * 100;
            const startY = -(Math.random() * 500 + 200); 

            const wordBody = Bodies.rectangle(
                startX,
                startY,
                rect.width * 0.8,
                rect.height * 0.8,
                {
                    restitution: 0.4,
                    friction: 0.05,
                    density: 0.1,
                    angle: (Math.random() - 0.5) * 0.5,
                    chamfer: { radius: 20 } // Redondea las esquinas
                }
            );
            
            // Empuje inicial
            Matter.Body.setVelocity(wordBody, {
                x: (Math.random() - 0.5) * 5,
                y: 0
            });
            
            wordEl.style.opacity = 1;
            
            dynamicBodies.push({ element: wordEl, body: wordBody });
            World.add(world, wordBody);
        });

        // 5. Crear el "corredor"
        runner = Runner.create();
        Runner.run(runner, engine);

        // 6. Iniciar el bucle de actualización
        updateLoop();
    }

    // --- Función para el bucle de actualización ---
    function updateLoop() {
        dynamicBodies.forEach(item => {
            item.element.style.transform = `
                translateX(${item.body.position.x - (item.element.offsetWidth / 2)}px) 
                translateY(${item.body.position.y - (item.element.offsetHeight / 2)}px) 
                rotate(${item.body.angle}rad)
            `;
        });
        
        if (runner && runner.enabled) {
            requestAnimationFrame(updateLoop);
        }
    }

    // --- Función para detener la simulación ---
    function stopPhysics() {
        if (runner) Runner.stop(runner);
        if (world) World.clear(world);
        if (engine) Engine.clear(engine);
        wordElements.forEach(el => { el.style.opacity = 0; });
        dynamicBodies = [];
    }

    // --- El Intersection Observer ---
    const options = { threshold: 0.1 }; 
    
    const callback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(initPhysics, 100);
            } else {
                stopPhysics();
            }
        });
    };
    
    const observer = new IntersectionObserver(callback, options);
    observer.observe(ctaSection);

    // --- ¡NUEVO! ARREGLO DE RESPONSIVE ---

// 1. Creamos una función "debounce"
// (Esto evita que la simulación se reconstruya 100 veces
// mientras arrastras la ventana, solo lo hace cuando paras)
function debounce(func, wait = 250) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 2. Creamos la función que reconstruye la física
function handleResize() {
    console.log("Window resized, rebuilding physics...");
    // Detiene la simulación actual (si es que está corriendo)
    stopPhysics();
    // Vuelve a iniciarla con las nuevas dimensiones
    // (El 'setTimeout' le da tiempo al CSS a ajustarse)
    setTimeout(initPhysics, 100);
}

// 3. Añadimos el "oyente" de resize
// Usamos nuestra función "debounce" para optimizarlo
window.addEventListener('resize', debounce(handleResize));
});