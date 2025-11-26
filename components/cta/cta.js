document.addEventListener('DOMContentLoaded', () => {
    
    const ctaSection = document.querySelector('.cta');
    const triggerBtn = document.getElementById('trigger-gallery');
    
    if (!ctaSection) return;

    const wordElements = document.querySelectorAll('.cta__word');
    const phoneElement = document.querySelector('.cta__image-wrapper');

    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Runner = Matter.Runner;
    const Composite = Matter.Composite; 
    const Render = Matter.Render;

    let engine;
    let world;
    let runner;
    let render;
    let dynamicBodies = [];
    let ground; 

    function initPhysics() {
        if (ctaSection.classList.contains('show-gallery')) return;

        engine = Engine.create();
        world = engine.world;
        engine.world.gravity.y = 1; 
        dynamicBodies = [];

        // Render (Opcional, puedes descomentar para debug)
        /*
        render = Render.create({
            element: ctaSection,
            engine: engine,
            options: {
                width: ctaSection.offsetWidth,
                height: ctaSection.offsetHeight,
                wireframes: true,
                background: 'transparent'
            }
        });
        // Render.run(render);
        */
        
        const sectionWidth = ctaSection.offsetWidth;
        const sectionHeight = ctaSection.offsetHeight;

        ground = Bodies.rectangle(sectionWidth / 2, sectionHeight - 150, sectionWidth, 100, { isStatic: true });

        const walls = [
            ground,
            Bodies.rectangle(-50, sectionHeight / 2, 100, sectionHeight * 2, { isStatic: true }),
            Bodies.rectangle(sectionWidth + 50, sectionHeight / 2, 100, sectionHeight * 2, { isStatic: true })
        ];
        World.add(world, walls);

        const phoneRect = phoneElement.getBoundingClientRect();
        const sectionRect = ctaSection.getBoundingClientRect();
        
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
                render: { fillStyle: 'transparent' }
            }
        );
        World.add(world, phoneCollider);

        wordElements.forEach(wordEl => {
            const rect = wordEl.getBoundingClientRect();
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
                    chamfer: { radius: 20 } 
                }
            );
            
            Matter.Body.setVelocity(wordBody, {
                x: (Math.random() - 0.5) * 5,
                y: 0
            });
            
          
            wordEl.style.opacity = 1;
            
            dynamicBodies.push({ element: wordEl, body: wordBody });
            World.add(world, wordBody);
        });

        runner = Runner.create();
        Runner.run(runner, engine);
        updateLoop();
    }

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

    function stopPhysics() {
        if (runner) Runner.stop(runner);
        if (world) World.clear(world);
        if (engine) Engine.clear(engine);
        if (render) Render.stop(render);
        dynamicBodies = [];
    }

    
    if (triggerBtn) {
        triggerBtn.addEventListener('click', () => {
            
            if (ctaSection.classList.contains('show-gallery')) {
                
                ctaSection.classList.remove('show-gallery');
                stopPhysics();
                
                
                setTimeout(() => {
                    initPhysics();
                    triggerBtn.innerText = "Eliminar Texto";
                }, 500);

            } else {
                
                if (ground && world) {
                    Composite.remove(world, ground);
                }

                dynamicBodies.forEach(item => {
                    Matter.Sleeping.set(item.body, false);
                    Matter.Body.setStatic(item.body, false);
                });

                setTimeout(() => {
                    ctaSection.classList.add('show-gallery');
                    stopPhysics();
                    
             
                    wordElements.forEach(el => { el.style.opacity = 0; });

                    triggerBtn.innerText = "Restaurar";
                }, 1000);
            }
        });
    }

    const options = { threshold: 0.1 }; 
    
    const callback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!ctaSection.classList.contains('show-gallery')) {
                    setTimeout(initPhysics, 100);
                }
            } else {
                if (!ctaSection.classList.contains('show-gallery')) {
                    stopPhysics();
                    wordElements.forEach(el => { el.style.opacity = 0; });
                }
            }
        });
    };
    
    const observer = new IntersectionObserver(callback, options);
    observer.observe(ctaSection);

    function debounce(func, wait = 250) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function handleResize() {
        if (ctaSection.classList.contains('show-gallery')) return;
        stopPhysics();
        setTimeout(initPhysics, 100);
    }

    window.addEventListener('resize', debounce(handleResize));
});