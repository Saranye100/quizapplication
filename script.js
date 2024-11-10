document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz');
    const submitButton = document.getElementById('submit');
    const resultContainer = document.getElementById('result');
    const restartButton = document.getElementById('restart');
    const exitButton = document.getElementById('exit');
    let score = 0;
    const userAnswers = [];

    // Load questions from JSON file
    fetch('questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(questions => {
            displayQuestions(questions);
            submitButton.addEventListener('click', () => {
                calculateScore(questions);
            });
            restartButton.addEventListener('click', restartQuiz);
            exitButton.addEventListener('click', exitQuiz);
        })
        .catch(error => {
            console.error('Error loading the questions:', error);
            alert('Sorry, there was an issue loading the quiz questions. Please try again later.');
        });

    function displayQuestions(questions) {
        quizContainer.innerHTML = '';
        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');
            questionDiv.innerHTML = `
                <h3>Q${index + 1}: ${question.question}</h3>
                ${question.options.map(option => `
                    <div class="options">
                        <label>
                            <input type="radio" name="question${index}" value="${option.key}">
                            ${option.text}
                        </label>
                    </div>
                `).join('')}
            `;
            quizContainer.appendChild(questionDiv);
        });
        enableSubmit(questions.length);
    }

    function enableSubmit(totalQuestions) {
        const checkAnswers = () => {
            const unanswered = Array.from(document.querySelectorAll('input[type="radio"]:checked')).length;
            submitButton.disabled = unanswered !== totalQuestions;
        };

        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', checkAnswers);
        });
    }

    function calculateScore(questions) {
        score = 0;
        questions.forEach((question, index) => {
            const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
            if (selectedAnswer && selectedAnswer.value === question.answerKey) {
                score++;
            }
        });
        displayResult();
    }

    function displayResult() {
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = `<h2>Your score: ${score}/${userAnswers.length}</h2>`;
        submitButton.style.display = 'none';
        restartButton.style.display = 'inline-block';
        exitButton.style.display = 'inline-block';
    }

    function restartQuiz() {
        score = 0;
        resultContainer.style.display = 'none';
        submitButton.style.display = 'inline-block';
        restartButton.style.display = 'none';
        exitButton.style.display = 'none';
        userAnswers.length = 0;
        fetch('questions.json')
            .then(response => response.json())
            .then(questions => {
                displayQuestions(questions);
            })
            .catch(error => {
                console.error('Error loading the questions:', error);
                alert('Sorry, there was an issue reloading the quiz questions. Please try again later.');
            });
    }

    function exitQuiz() {
        alert("Thank you for participating in the quiz!");
    }
});