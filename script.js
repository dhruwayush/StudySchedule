document.addEventListener("DOMContentLoaded", function () {
    const addEntryButton = document.getElementById("addEntry");
    const scheduleTable = document.getElementById("schedule");

    // Function to save study entry data to Local Storage
    function saveStudyEntryToLocalStorage(day, subject, time) {
        const studyEntries = JSON.parse(localStorage.getItem('studyEntries')) || [];
        studyEntries.push({ day, subject, time });
        localStorage.setItem('studyEntries', JSON.stringify(studyEntries));
    }

    // Function to load and display study entry data from Local Storage
    function loadStudyEntriesFromLocalStorage() {
        const studyEntries = JSON.parse(localStorage.getItem('studyEntries')) || [];
        studyEntries.forEach(entry => {
            addStudyEntryFromLocalStorage(entry.day, entry.subject, entry.time);
        });
    }

    // Function to add study entry to the table from Local Storage
    function addStudyEntryFromLocalStorage(day, subject, time) {
        const newRow = scheduleTable.insertRow(-1);
        const dayCell = newRow.insertCell(0);
        const subjectCell = newRow.insertCell(1);
        const timeCell = newRow.insertCell(2);
        const timerCell = newRow.insertCell(3);

        dayCell.textContent = day;
        subjectCell.textContent = subject;
        timeCell.textContent = time;

        const timerDisplay = document.createElement("span");
        timerDisplay.textContent = "00:00";
        timerCell.appendChild(timerDisplay);

        const startButton = document.createElement("button");
        startButton.textContent = "Start Timer";
        timerCell.appendChild(startButton);

        const pauseButton = document.createElement("button");
        pauseButton.textContent = "Pause";
        pauseButton.style.display = "none";
        timerCell.appendChild(pauseButton);

        // Timer logic
        let timerIntervalId;
        let timerRunning = false;
        let remainingTime = time * 60;

        startButton.addEventListener("click", function () {
            if (!timerRunning) {
                startButton.style.display = "none";
                pauseButton.style.display = "inline";
                timerRunning = true;
                timerIntervalId = startTimer(remainingTime, timerDisplay);
            }
        });

        pauseButton.addEventListener("click", function () {
            if (timerRunning) {
                pauseButton.textContent = "Resume";
                timerRunning = false;
                clearInterval(timerIntervalId);
            } else {
                pauseButton.textContent = "Pause";
                timerRunning = true;
                timerIntervalId = startTimer(remainingTime, timerDisplay);
            }
        });
    }

    // Function to start the timer
    function startTimer(duration, display) {
        let timer = duration;
        let minutes, seconds;

        const intervalId = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(intervalId);
                display.textContent = "Timer Completed!";
            }
        }, 1000);

        return intervalId;
    }

    // Load stored study entries when the page loads
    loadStudyEntriesFromLocalStorage();

    // Add a new study entry
    function addStudyEntry() {
        const newDay = prompt("Enter the day:");
        const newSubject = prompt("Enter the subject:");
        const newTime = parseInt(prompt("Enter the study duration (in minutes):")) || 0;

        // Save the new study entry to Local Storage
        saveStudyEntryToLocalStorage(newDay, newSubject, newTime);

        // Add the new study entry to the table
        addStudyEntryFromLocalStorage(newDay, newSubject, newTime);
    }

    addEntryButton.addEventListener("click", addStudyEntry);
});
