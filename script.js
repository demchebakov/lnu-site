document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuList = document.querySelector('.nav-list');

    if (mobileMenu && menuList) {
        mobileMenu.addEventListener('click', function() {
            menuList.classList.toggle('active');
        });
    } else {
        console.error("Mobile menu or menu list not found");
    }

    // Функція для збереження даних опитування в localStorage
    function saveSurveyData(data) {
        const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
        surveys.push(data);
        localStorage.setItem('surveys', JSON.stringify(surveys));
    }

    // Отримання форми опитування
    const form = document.getElementById('survey-form');

    if (form) {
        // Додавання обробника події submit для форми
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Зупинка стандартної дії форми

            // Отримання даних з форми
            const formData = new FormData(form);
            const surveyData = {};

            // Перебір даних форми та додавання їх до об'єкта опитування
            for (const [key, value] of formData.entries()) {
                surveyData[key] = value;
            }

            // Збереження даних опитування в localStorage
            saveSurveyData(surveyData);

            // Виведення даних в консоль
            console.log('Дані опитування:', surveyData);

            // Очищення форми після відправки
            form.reset();
        });
    } else {
        console.error("Survey form not found");
    }

    // Завантаження результатів опитування з локального сховища
    const surveys = JSON.parse(localStorage.getItem('surveys')) || [];

    // Виведення результатів опитування в консоль у вигляді об'єкту
    console.log('Результати опитування:', surveys);

    // Функція для виведення учасників опитування лише з одного факультету
    function filterByFaculty(faculty) {
        const filteredSurveys = surveys.filter(survey => survey.faculty === faculty);
        console.log(`Учасники опитування з факультету "${faculty}":`, filteredSurveys);
    }

    // Функція для виведення учасників опитування за певний день і час
    function filterByInterviewTime(interviewTime) {
        const filteredSurveys = surveys.filter(survey => survey['interview-time'] === interviewTime);
        console.log(`Учасники опитування, які можуть прийти на співбесіду в ${interviewTime}:`, filteredSurveys);
    }

    // Функція для виведення учасників опитування з середнім балом від 3 до 4
    function filterByAverageGrade(minGrade, maxGrade) {
        const filteredSurveys = surveys.filter(survey => {
            const averageGrade = parseFloat(survey['average-grade']);
            return averageGrade >= minGrade && averageGrade <= maxGrade;
        });
        console.log(`Учасники опитування з середнім балом від ${minGrade} до ${maxGrade}:`, filteredSurveys);
    }

    // Приклади використання фільтрів
    filterByFaculty('engineering');
    filterByInterviewTime('2002-07-12T00:36');
    filterByAverageGrade(1, 10);

    // Завантаження тестових питань та відображення їх
    fetch('questions.json')
        .then(response => response.json())
        .then(questions => {
            const testForm = document.getElementById('test-form');
            questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('question');
                const questionTitle = document.createElement('h3');
                questionTitle.textContent = `${index + 1}. ${question.question}`;
                questionDiv.appendChild(questionTitle);

                const answersList = document.createElement('ul');
                answersList.classList.add('answers');
                question.answers.forEach((answer, i) => {
                    const answerItem = document.createElement('li');
                    const answerLabel = document.createElement('label');
                    const answerInput = document.createElement('input');
                    answerInput.type = 'radio';
                    answerInput.name = `question-${index}`;
                    answerInput.value = i;
                    answerLabel.appendChild(answerInput);
                    answerLabel.append(answer);
                    answerItem.appendChild(answerLabel);
                    answersList.appendChild(answerItem);
                });
                questionDiv.appendChild(answersList);
                testForm.appendChild(questionDiv);
            });

            document.getElementById('submit-btn').addEventListener('click', function() {
                let score = 0;
                questions.forEach((question, index) => {
                    const selectedAnswer = testForm[`question-${index}`].value;
                    const correctAnswer = question.correct;
                    const answersList = testForm.querySelectorAll(`input[name="question-${index}"]`);

                    answersList.forEach((answerInput, i) => {
                        const answerLabel = answerInput.parentElement;
                        if (parseInt(answerInput.value, 10) === correctAnswer) {
                            answerLabel.classList.add('correct');
                        } else {
                            answerLabel.classList.add('incorrect');
                        }
                    });

                    if (parseInt(selectedAnswer, 10) === correctAnswer) {
                        score++;
                    }
                });
                const resultDiv = document.getElementById('result');
                resultDiv.textContent = `Ваш результат: ${score} из ${questions.length}`;
            });
        })
        .catch(error => console.error('Error loading questions:', error));
});