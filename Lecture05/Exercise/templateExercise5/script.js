// Select elements with proper type casting (Task 2: Add Type Annotations)
var pianoContainer = document.getElementById("piano");
var noteLine = document.getElementById("note-line");
var playThemeBtn = document.getElementById("play-theme-btn");
var resetBtn = document.getElementById("reset-btn");
// Task 2: Add Type Annotations for core game variables
var pianoKeys = [];
var themeNotes = [];
var themeInterval = null;
// Load and display piano keys dynamically from fetched data
document.addEventListener("DOMContentLoaded", function () {
    fetch("notes.json")
        .then(function (response) { return response.json(); })
        .then(function (data) {
        pianoKeys = data;
        pianoKeys.forEach(function (_a) {
            var key = _a.key, note = _a.note;
            var keyElement = document.createElement("div");
            keyElement.classList.add("key");
            keyElement.textContent = key;
            keyElement.dataset.note = note;
            keyElement.dataset.key = key;
            pianoContainer.appendChild(keyElement);
        });
    })
        .catch(function (error) { return console.error("Error loading notes:", error); });
    // Fetch theme keys from theme1.json
    fetch("theme1.json")
        .then(function (response) { return response.json(); })
        .then(function (data) {
        themeNotes = data;
    })
        .catch(function (error) { return console.error("Error loading theme:", error); });
});
// Play note function (modified to not use .find())
function playNote(key) {
    var keyObj;
    for (var i = 0; i < pianoKeys.length; i++) {
        if (pianoKeys[i].key === key) {
            keyObj = pianoKeys[i];
            break;
        }
    }
    if (keyObj) {
        var audio = new Audio(keyObj.audio);
        audio.play().catch(function (error) { return console.error("Audio playback error:", error); });
        var keyElement_1 = document.querySelector(".key[data-key=\"".concat(key, "\"]"));
        if (keyElement_1) {
            keyElement_1.classList.add("pressed");
            setTimeout(function () { return keyElement_1.classList.remove("pressed"); }, 200);
        }
        noteLine.textContent = "Playing: ".concat(keyObj.note);
    }
}
// Keyboard interaction
document.addEventListener("keydown", function (event) {
    playNote(event.key.toUpperCase());
});
// Mouse interaction
document.addEventListener("click", function (event) {
    var target = event.target;
    if (target.classList.contains("key")) {
        playNote(target.dataset.key);
    }
});
// Play theme button handler
playThemeBtn.addEventListener("click", function () {
    if (themeNotes.length === 0)
        return;
    var index = 0;
    themeInterval = window.setInterval(function () {
        if (index >= themeNotes.length) {
            clearInterval(themeInterval);
            noteLine.textContent = "Theme finished!";
            return;
        }
        playNote(themeNotes[index]);
        index++;
    }, 500);
});
// Reset button handler
resetBtn.addEventListener("click", function () {
    if (themeInterval) {
        clearInterval(themeInterval);
        themeInterval = null;
    }
    noteLine.textContent = "";
    document
        .querySelectorAll(".key")
        .forEach(function (key) { return key.classList.remove("pressed"); });
});
