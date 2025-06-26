const QUESTIONS = [
    {
        label: 'What strategies do you use to improve your performance in video games?',
        answers: [
            'I follow a detailed plan to enhance my skills consistently.',
            'I adapt my tactics depending on the game scenario.',
            'I trust my instincts and react spontaneously.',
            'I am experimenting with various gameplay styles.',
        ],
    },
    {
        label: 'Which gaming styles help you advance your skills the most?',
        answers: [
            'Skill-based challenges – focusing on improving reaction times.',
            'Tactical games – carefully planning each move to gain advantage.',
            'Combining skill and tactics for a well-rounded approach.',
            'Playing casually for enjoyment without focusing on competition.',
        ],
    },
    {
        label: 'How do you approach risk-taking in competitive gaming?',
        answers: [
            'I set clear boundaries and follow a disciplined strategy.',
            'I take calculated risks informed by past experiences.',
            'I embrace bold moves to maximize excitement.',
            'I prefer relaxed play without worrying about risks.',
        ],
    },
    {
        label: 'How do you evaluate your progress in interactive and competitive games?',
        answers: [
            'By consistent achievement of in-game goals.',
            'By mastering the most demanding skill-based challenges.',
            'By progressing through increasingly difficult levels.',
            'I focus on having fun rather than tracking success.',
        ],
    },
    {
        label: 'Do you maintain a structured approach to gaming, and how flexible is it?',
        answers: [
            'I have a firm strategy that I always follow.',
            'I have a plan but adjust it based on the game flow.',
            'I am still crafting my gaming strategy.',
            'I enjoy casual play and go with the moment.',
        ],
    },
];

const $container = document.getElementById('container');

const startStep = {
    render: () => {
        $container.innerHTML = `
<div class="container quiz-wrapper">
    <div class="row quiz-content">
        <div class="col-lg-6 col-md-6 col-lg-6">
            <h2 class="title">Challenge Your Gaming Expertise</h2>
            <h3>Test your skills in strategy titles, competitive gameplay, and immersive gaming experiences.</h3>
            <button class="btn btn-primary py-3 first-button" data-action="startQuiz">Begin Quiz</button>
        </div>
        <div class="col-lg-6 col-md-6 col-lg-6">
            <img class="quiz-img" src="img/quiz.jpg" alt="Gaming Quiz Illustration" />
        </div>
    </div>
</div>

        `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'startQuiz') {
            quiz.nextStep(questionsStep);
        }
    },
};

const questionsStep = {
    questionIndex: 0,
    answers: {},
    render: () => {
        const question = QUESTIONS[questionsStep.questionIndex];

        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content text-center">
                <h3>${question.label}</h3>
                <div class="row answers">
                    ${question.answers
                        .map(
                            (answer, index) =>
                                `<button class="answer col-md-12 col-lg-6 border rounded" data-action="selectAnswer" data-answer-index="${index}">
                                    ${answer}
                                </button>`
                        )
                        .join('')}
                </div>
            </div>
        </div>
        `;
    },
    onClick: (el) => {
        switch (el.getAttribute('data-action')) {
            case 'selectAnswer':
                return questionsStep.selectAnswer(
                    parseInt(el.getAttribute('data-answer-index'), 10),
                );
        }
    },
    selectAnswer: (answerIndex) => {
        const question = QUESTIONS[questionsStep.questionIndex];
        const selectedAnswer = question.answers[answerIndex];

        questionsStep.answers = {
            ...questionsStep.answers,
            [question.label]: selectedAnswer,
        };

        if (questionsStep.isFinalQuestion()) {
            questionsStep.completeStep();
        } else {
            questionsStep.goToNextQuestion();
        }
    },
    isFinalQuestion: () => questionsStep.questionIndex === QUESTIONS.length - 1,
    goToNextQuestion: () => {
        questionsStep.questionIndex += 1;
        questionsStep.render();
    },
    completeStep: () => {
        quiz.setAnswers(questionsStep.answers);
        quiz.nextStep(finalStep);
    },
};

const finalStep = {
    render: () => {
        $container.innerHTML = `
     <div class="container quiz-wrapper">
    <div class="row quiz-content">
        <div class="col-lg-6 col-md-6 col-lg-6">
            <img class="quiz-img" src="img/quiz-2.jpg" alt="Gaming Performance Illustration" />
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
            <h2 class="title">Evaluate Your Gaming Skills</h2>
            <h3>Complete the form to get your custom gaming strategy report!</h3>
            <form>
                <input class="form-control" name="name" type="text" placeholder="Full Name" required />
                <input class="form-control" name="email" id="email2" type="email" placeholder="Email Address" required />
                <div id="validation" style="color: red"></div>
                <input class="form-control" name="phone" type="tel" id="phone" placeholder="Contact Number" required />
                
                <input name="gameMechanics" value="Game Mechanics" hidden />
                <input name="competitivePlay" value="Competitive Play" hidden />
                <input name="playerStrategies" value="Player Strategies" hidden />
                <input name="virtualAdventures" value="Virtual Adventures" hidden />
                <input name="eSportsInsights" value="eSports Insights" hidden />
                
                <button data-action="submitAnswers" class="btn btn-primary w-50 py-3">Send</button>
            </form>
        </div>
    </div>
</div>

        `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'submitAnswers') {
            const emailInput = document.getElementById('email2').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(emailInput)) {
                document.getElementById('validation').textContent = '';
                window.location.href = 'thanks.html';
                localStorage.setItem('quizDone', true);
                document.getElementById('quiz-page').classList.add('hide');
            } else {
                document.getElementById('validation').textContent =
                    'Invalid email address. Please enter a valid email.';
            }
        }
    },
};

const quiz = {
    activeStep: startStep,
    answers: {},
    clear: () => ($container.innerHTML = ''),
    init: () => {
        $container.addEventListener('click', (event) =>
            quiz.activeStep.onClick(event.target),
        );
        $container.addEventListener('submit', (event) =>
            event.preventDefault(),
        );
    },
    render: () => {
        quiz.clear();
        quiz.activeStep.render();
    },
    nextStep: (step) => {
        quiz.activeStep = step;
        quiz.render();
    },
    setAnswers: (answers) => (quiz.answers = answers),
};

if (!localStorage.getItem('quizDone')) {
    quiz.init();
    quiz.render();
}
