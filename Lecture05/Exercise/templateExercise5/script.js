var pianoContainer = document.getElementById("piano");
var noteLine = document.getElementById("note-line");
var playThemeBtn = document.getElementById("play-theme-btn");
var resetBtn = document.getElementById("reset-btn");
var pianoKeys = [];
var themeNotes = [];
var themeInterval = null;
// Load and display piano keys dynamically from fetched data
document.addEventListener("DOMContentLoaded", function () {
    fetch("notes.json")
        .then(function (response) { return response.json(); })
        .then(function (data) {
        pianoKeys = data;
        // Clear existing keys to prevent duplication
        pianoContainer.innerHTML = "";
        // Display only musical notes, not keyboard keys
        pianoKeys.forEach(function (_a) {
            var key = _a.key, note = _a.note;
            var keyElement = document.createElement("div");
            keyElement.classList.add("key");
            keyElement.textContent = note; // Show note (C, D, E, etc.)
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
        console.log("Theme notes loaded:", themeNotes); // Add this line
    })
        .catch(function (error) { return console.error("Error loading theme:", error); });
});
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
// Keyboard interaction (plays note when pressing mapped key)
document.addEventListener("keydown", function (event) {
    playNote(event.key.toUpperCase()); // Convert lowercase to uppercase
});
// Mouse interaction (plays note when clicking on a key)
pianoContainer.addEventListener("click", function (event) {
    var target = event.target;
    if (target.classList.contains("key")) {
        playNote(target.dataset.key);
    }
});
// Play theme button handler (plays the sequence of keyboard keys)
playThemeBtn.addEventListener("click", function () {
    console.log("Play theme clicked");
    console.log("Theme notes:", themeNotes);
    if (themeNotes.length === 0) {
        console.log("No theme notes loaded");
        return;
    }
    if (themeInterval) {
        console.log("Clearing existing interval");
        clearInterval(themeInterval);
        themeInterval = null;
    }
    var index = 0;
    themeInterval = window.setInterval(function () {
        console.log("Playing note ".concat(index, ": ").concat(themeNotes[index]));
        if (index >= themeNotes.length) {
            console.log("Theme finished");
            if (themeInterval) {
                clearInterval(themeInterval);
                themeInterval = null;
            }
            if (noteLine) {
                noteLine.textContent = "Theme finished!";
            }
            return;
        }
        playNote(themeNotes[index]);
        index++;
    }, 500);
});
// Reset button handler (stops theme playback immediately)
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
