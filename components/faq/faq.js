document.addEventListener('DOMContentLoaded', () => {
    
    // todos los botones de preguntas
    const questions = document.querySelectorAll('.faq__question');
    questions.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            button.classList.toggle('is-active');
            answer.classList.toggle('is-active');
        });
    });

});