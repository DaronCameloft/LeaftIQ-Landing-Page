document.addEventListener('DOMContentLoaded', () => {
    
    const ctaSection = document.querySelector('.cta');
    if (!ctaSection) return;

    const wordElements = document.querySelectorAll('.cta__word');
    const phoneElement = document.querySelector('.cta__image-wrapper');


    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Runner = Matter.Runner;


    let engine;
    let world;
    let runner;
    let dynamicBodies = [];

    function initPhysics() {
        engine = Engine.create();
        world = engine.world;
        engine.world.gravity.y = 1; 
        dynamicBodies = [];

        const sectionWidth = ctaSection.offsetWidth;
        const sectionHeight = ctaSection.offsetHeight;

        const walls = [

            Bodies.rectangle(sectionWidth / 2, sectionHeight - 150, sectionWidth, 100, { isStatic: true }),
 
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
  
                render: {
                    fillStyle: 'rgba(255, 0, 0, 0.2)'
                }
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
        wordElements.forEach(el => { el.style.opacity = 0; });
        dynamicBodies = [];
    }

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


function debounce(func, wait = 250) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function handleResize() {
    console.log("Window resized, rebuilding physics...");

    stopPhysics();

    setTimeout(initPhysics, 100);
}

window.addEventListener('resize', debounce(handleResize));
});