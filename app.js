let currentQuestion = 1; // Start mit der ersten Frage
const totalQuestions = 15; // Gesamtanzahl der regulären Fragen

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

    // Sammle die regulären Antworten
    const surveyData = {};
    for (let i = 1; i <= totalQuestions; i++) {
        const questionElement = document.getElementById(`question${i}`);
        if (questionElement) {
            surveyData[`question${i}`] = questionElement.value || "";
        }
    }

    console.log("Sende Umfrageergebnisse:", surveyData);

    // Daten an die Google Apps Script Web-App senden
    fetch("https://script.google.com/macros/s/DEINE_WEB_APP_URL/exec", { // Ersetze DEINE_WEB_APP_URL durch die Web-App-URL
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                alert("Umfrage erfolgreich gespeichert!");
            } else {
                alert("Umfrage erfolgreich gespeichert!: " + data.message);
            }
        })
        .catch((error) => {
            console.error("Fehler:", error);
            alert("Umfrage erfolgreich gespeichert.");
        });

    // Umfrage-Seite ausblenden und Gewinnspiel-Seite anzeigen
    document.getElementById("survey-section").style.display = "none";
    document.getElementById("raffle-section").style.display = "block";
});

// Event-Listener für das Absenden des Gewinnspiel-Formulars
document.getElementById("raffle-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    console.log("E-Mail für Gewinnspiel:", email);

    alert("Vielen Dank! Ihre Teilnahme am Gewinnspiel wurde registriert.");
});
function updateRangeValue(id, value) {
    document.getElementById(`${id}-value`).textContent = value;
}
// Funktion, um die Auswahl der Betriebe zu verarbeiten
function handleBetriebSelection() {
    const selectedBetriebe = [];
    const checkboxes = document.querySelectorAll('input[name="betrieb"]:checked');

    checkboxes.forEach((checkbox) => {
        selectedBetriebe.push(checkbox.value);
    });

    if (selectedBetriebe.length > 0) {
        console.log("Ausgewählte Betriebe:", selectedBetriebe);

        // Dynamische Fragen basierend auf den ausgewählten Betrieben generieren
        const dynamicQuestionsContainer = document.getElementById("dynamic-questions-container");
        dynamicQuestionsContainer.innerHTML = ""; // Vorherige Fragen entfernen

        selectedBetriebe.forEach((betrieb, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("dynamic-question");

            const label = document.createElement("label");
            label.setAttribute("for", `dynamic-question-${index}`);
            label.textContent = `Was hat dir an ${betrieb} gefallen/nicht gefallen?`;

            const textarea = document.createElement("textarea");
            textarea.setAttribute("id", `dynamic-question-${index}`);
            textarea.setAttribute("name", `dynamic-question-${index}`);
            textarea.setAttribute("placeholder", `Bitte beschreibe, was dir an ${betrieb} gefallen oder nicht gefallen hat...`);

            questionDiv.appendChild(label);
            questionDiv.appendChild(textarea);
            dynamicQuestionsContainer.appendChild(questionDiv);
        });

        // Zeige die dynamische Frage an
        document.getElementById("question15-section").style.display = "none";
        document.getElementById("dynamic-question-section").style.display = "block";
    } else {
        alert("Bitte wähle mindestens einen Betrieb aus.");
    }
}

// Validierungsfunktion für dynamische Fragen
function validateDynamicQuestions() {
    const dynamicQuestions = document.querySelectorAll("#dynamic-questions-container textarea");
    for (const question of dynamicQuestions) {
        if (question.value.trim() === "") {
            alert("Bitte beantworte alle dynamischen Fragen, bevor du fortfährst.");
            return false;
        }
    }
    return true;
}

// Aktualisiere die Funktion zum Sammeln der Antworten
document.getElementById("survey-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Überprüfe, ob die dynamischen Fragen beantwortet wurden
    if (!validateDynamicQuestions()) {
        return; // Abbrechen, wenn nicht alle dynamischen Fragen beantwortet wurden
    }

    // Sammle die regulären Antworten
    const surveyData = {};
    for (let i = 1; i <= totalQuestions; i++) {
        const questionElement = document.getElementById(`question${i}`);
        if (questionElement) {
            surveyData[`question${i}`] = questionElement.value || "";
        }
    }

    // Sammle die ausgewählten Betriebe
    const selectedBetriebe = [];
    const checkboxes = document.querySelectorAll('input[name="betrieb"]:checked');
    checkboxes.forEach((checkbox) => {
        selectedBetriebe.push(checkbox.value);
    });
    surveyData["betriebe"] = selectedBetriebe;

    // Sammle die Antworten auf die dynamischen Fragen
    const dynamicAnswers = {};
    selectedBetriebe.forEach((betrieb, index) => {
        const dynamicAnswer = document.getElementById(`dynamic-question-${index}`).value;
        dynamicAnswers[betrieb] = dynamicAnswer;
    });
    surveyData["dynamic-answers"] = dynamicAnswers;

    console.log("Sende Umfrageergebnisse:", surveyData);

    // Daten an die Google Apps Script Web-App senden
    fetch("https://script.google.com/macros/s/DEINE_WEB_APP_URL/exec", { // Ersetze DEINE_WEB_APP_URL durch die Web-App-URL
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                console.log("Umfrage erfolgreich gespeichert!");
            } else {
                console.error("Fehler beim Speichern der Umfrage:", data.message);
            }
        })
        .catch((error) => {
            console.error("Fehler:", error);
        });

    // Umfrage-Seite ausblenden
    document.getElementById("survey-section").style.display = "none";
    document.getElementById("raffle-section").style.display = "block";
});