let currentQuestion = 1; // Start mit der ersten Frage
const totalQuestions = 13; // Gesamtanzahl der regulären Fragen

// Zugangscode festlegen
const ACCESS_CODE = "1234"; // Ersetze "1234" durch deinen gewünschten 4-stelligen Code

// Funktion zur Überprüfung des Zugangscodes
function checkAccessCode() {
    const enteredCode = document.getElementById("access-code").value; // Eingegebener Code
    const errorMessage = document.getElementById("error-message"); // Fehlermeldung

    if (enteredCode === ACCESS_CODE) {
        // Wenn der Code korrekt ist, zeige die Umfrage und verstecke den Code-Bereich
        document.getElementById("code-section").style.display = "none";
        document.getElementById("survey-section").style.display = "block";
        showQuestion(currentQuestion); // Zeige die erste Frage
    } else {
        // Wenn der Code falsch ist, zeige eine Fehlermeldung
        errorMessage.style.display = "block";
        errorMessage.textContent = "Falscher Code. Bitte versuchen Sie es erneut.";
    }
}

// Funktion, um die aktuelle Frage anzuzeigen
function showQuestion(questionNumber) {
    // Verstecke alle regulären Fragen
    for (let i = 1; i <= totalQuestions; i++) {
        const questionSection = document.getElementById(`question${i}-section`);
        if (questionSection) {
            questionSection.style.display = (i === questionNumber) ? "block" : "none";
        }
    }

    // Steuerung der Navigationstasten
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

// Event-Listener, um die erste Frage beim Laden der Seite anzuzeigen
document.addEventListener("DOMContentLoaded", function () {
    showQuestion(currentQuestion);
});

// Event-Listener für das Absenden des Formulars
document.getElementById("survey-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Sammle die regulären Antworten
    const surveyData = {};
    for (let i = 1; i <= totalQuestions; i++) {
        const questionElement = document.getElementById(`question${i}`);
        if (questionElement) {
            surveyData[`question${i}`] = questionElement.value || "";
        }
    }

    console.log("Sende Umfrageergebnisse:", surveyData);

    // Hier kannst du die Daten an deinen Server oder JSONBin senden
});