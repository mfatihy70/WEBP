const pianoContainer = document.getElementById("piano")
const noteLine = document.getElementById("note-line")
const playThemeBtn = document.getElementById("play-theme-btn")

let pianoKeys = []
let themeNotes = []

// Load and display piano keys dynamically from fetched data
document.addEventListener("DOMContentLoaded", () => {
  fetch("notes.json")
    .then((response) => response.json())
    .then((data) => {
      pianoKeys = data
      pianoKeys.forEach(({ key, note }) => {
        const keyElement = document.createElement("div")
        keyElement.classList.add("key")
        keyElement.textContent = key
        keyElement.dataset.note = note
        keyElement.dataset.key = key
        pianoContainer.appendChild(keyElement)
      })
    })
    .catch((error) => console.error("Error loading notes:", error))

  // Fetch theme keys from theme1.json
  fetch("theme1.json")
    .then((response) => response.json())
    .then((data) => {
      themeNotes = data // Load theme1 as an array of notes
    })
    .catch((error) => console.error("Error loading theme:", error))
})

// Play note function
function playNote(key) {
  const keyObj = pianoKeys.find((k) => k.key === key)
  if (keyObj) {
    const audio = new Audio(keyObj.audio)
    audio.play().catch((error) => console.error("Audio playback error:", error))

    const keyElement = document.querySelector(`.key[data-key="${key}"]`)
    if (keyElement) {
      keyElement.classList.add("pressed")
      setTimeout(() => keyElement.classList.remove("pressed"), 200)
    }

    noteLine.textContent = `Playing: ${keyObj.note}`
  }
}

// Keyboard interaction
document.addEventListener("keydown", (event) => {
  playNote(event.key.toUpperCase())
})

// Mouse interaction
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("key")) {
    playNote(event.target.dataset.key)
  }
})

// Play theme button handler
playThemeBtn.addEventListener("click", () => {
  if (themeNotes.length === 0) return

  let index = 0
  themeInterval = setInterval(() => {
    if (index >= themeNotes.length) {
      clearInterval(themeInterval)
      noteLine.textContent = "Theme finished!"
      return
    }
    playNote(themeNotes[index])
    index++
  }, 500)
})

// Reset button handler
document.getElementById("reset-btn").addEventListener("click", () => {
  // Clear theme interval if running
  if (themeInterval) {
    clearInterval(themeInterval)
    themeInterval = null
  }
  noteLine.textContent = ""
  document
    .querySelectorAll(".key")
    .forEach((key) => key.classList.remove("pressed"))
})
