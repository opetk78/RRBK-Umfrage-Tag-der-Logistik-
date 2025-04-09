let currentQuestion = 1; // Start mit der ersten Frage
const totalQuestions = 19; // Gesamtanzahl der regulären Fragen

// Funktion zur Überprüfung des Zugangscodes
function checkAccessCode() {
    const enteredCode = document.getElementById("access-code").value;
    const errorMessage = document.getElementById("error-message");

    if (enteredCode === "1004") {
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

    // Dynamisches Fenster nur bei Frage 18 anzeigen
    const dynamicSection = document.getElementById("dynamic-question-section");
    if (questionNumber === 18) {
        const checkboxes = document.querySelectorAll('#question18-section input[type="checkbox"]');
        let isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        dynamicSection.style.display = isChecked ? "block" : "none";
    } else {
        dynamicSection.style.display = "none"; // Dynamisches Fenster ausblenden
    }

    // Navigation-Buttons steuern
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
        document.getElementById("dynamic-question-section").style.display = "block";
    } else {
        // Verstecke die dynamische Frage, wenn keine Checkbox ausgewählt ist
        document.getElementById("dynamic-question-section").style.display = "none";
    }
}

// Event-Listener für alle Checkboxen in Frage 17 hinzufügen
document.querySelectorAll('#question17-section input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', handleBetriebSelection);
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