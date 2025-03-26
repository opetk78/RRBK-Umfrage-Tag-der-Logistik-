let currentQuestion = 1; // Start mit der ersten Frage
const totalQuestions = 10; // Gesamtanzahl der regulären Fragen

// Funktion zur Überprüfung des Zugangscodes
function checkAccessCode() {
    const enteredCode = document.getElementById("access-code").value;
    const errorMessage = document.getElementById("error-message");

    if (enteredCode === "1234") {
        document.getElementById("code-section").style.display = "none";
        document.getElementById("survey-section").style.display = "block";
        showQuestion(currentQuestion);
    } else {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Falscher Code. Bitte versuchen Sie es erneut.";
    }
}

// Funktion, um die aktuelle Frage anzuzeigen
function showQuestion(questionNumber) {
    for (let i = 1; i <= totalQuestions; i++) {
        const questionSection = document.getElementById(`question${i}-section`);
        if (questionSection) {
            questionSection.style.display = (i === questionNumber) ? "block" : "none";
        }
    }

    document.getElementById("prev-btn").style.display = (questionNumber > 1) ? "inline" : "none";
    document.getElementById("next-btn").style.display = (questionNumber < totalQuestions) ? "inline" : "none";
    document.getElementById("submit-btn").style.display = (questionNumber === totalQuestions) ? "inline" : "none";
}

// Funktion, um zur nächsten Frage zu navigieren
function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
}

// Funktion, um zur vorherigen Frage zu navigieren
function prevQuestion() {
    if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

// Funktion, um die aktuelle Zahl der Skala anzuzeigen
function updateRangeValue(id, value) {
    document.getElementById(`${id}-value`).textContent = value;
}

// Event-Listener für das Absenden des Formulars
document.getElementById("survey-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const surveyData = {};
    for (let i = 1; i <= totalQuestions; i++) {
        const questionElement = document.getElementById(`question${i}`);
        if (questionElement) {
            surveyData[`question${i}`] = questionElement.value || "";
        }
    }

    console.log("Sende Umfrageergebnisse:", surveyData);
});
document.getElementById("survey-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Umfrageergebnisse sammeln
    const surveyData = {};
    for (let i = 1; i <= 13; i++) {
        const questionElement = document.getElementById(`question${i}`);
        if (questionElement) {
            surveyData[`question${i}`] = questionElement.value || "";
        }
    }

    console.log("Umfrageergebnisse:", surveyData);

    // Umfrage-Seite ausblenden und Gewinnspiel-Seite anzeigen
    document.getElementById("survey-section").style.display = "none";
    document.getElementById("raffle-section").style.display = "block";
});

document.getElementById("raffle-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    console.log("E-Mail für Gewinnspiel:", email);

    alert("Vielen Dank! Ihre Teilnahme am Gewinnspiel wurde registriert.");
});