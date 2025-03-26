interface PianoKey {
  key: string // Keyboard key (e.g., "A", "S")
  note: string // Musical note (e.g., "C", "D")
  audio: string
}

const pianoContainer = document.getElementById("piano") as HTMLElement
const noteLine = document.getElementById("note-line") as HTMLElement
const playThemeBtn = document.getElementById(
  "play-theme-btn"
) as HTMLButtonElement
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement

let pianoKeys: PianoKey[] = []
let themeNotes: string[] = []
let themeInterval: number | null = null

// Load and display piano keys dynamically from fetched data
document.addEventListener("DOMContentLoaded", () => {
  fetch("notes.json")
    .then((response) => response.json())
    .then((data: PianoKey[]) => {
      pianoKeys = data

      // Clear existing keys to prevent duplication
      pianoContainer.innerHTML = ""

      // Display only musical notes, not keyboard keys
      pianoKeys.forEach(({ key, note }) => {
        const keyElement = document.createElement("div")
        keyElement.classList.add("key")
        keyElement.textContent = note // Show note (C, D, E, etc.)
        keyElement.dataset.note = note
        keyElement.dataset.key = key
        pianoContainer.appendChild(keyElement)
      })
    })
    .catch((error) => console.error("Error loading notes:", error))

  // Fetch theme keys from theme1.json
  fetch("theme1.json")
    .then((response) => response.json())
    .then((data: string[]) => {
      themeNotes = data
      console.log("Theme notes loaded:", themeNotes) // Add this line
    })
    .catch((error) => console.error("Error loading theme:", error))
})

function playNote(key: string): void {
  // Find the PianoKey object that matches the key
  let keyObj: PianoKey | undefined
  for (let i = 0; i < pianoKeys.length; i++) {
    if (pianoKeys[i].key === key) {
      keyObj = pianoKeys[i]
      break
    }
  }
  // Play the audio and highlight the key
  if (keyObj) {
    const audio = new Audio(keyObj.audio)
    audio.play().catch((error) => console.error("Audio playback error:", error))
    // Highlight the key by adding a CSS class
    const keyElement = document.querySelector(
      `.key[data-key="${key}"]`
    ) as HTMLElement
    if (keyElement) {
      keyElement.classList.add("pressed")
      setTimeout(() => keyElement.classList.remove("pressed"), 200)
    }

    noteLine.textContent = `Playing: ${keyObj.note}`
  }
}

// Keyboard interaction (plays note when pressing mapped key)
document.addEventListener("keydown", (event: KeyboardEvent) => {
  playNote(event.key.toUpperCase()) // Convert lowercase to uppercase
})

// Mouse interaction (plays note when clicking on a key)
pianoContainer.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.classList.contains("key")) {
    playNote(target.dataset.key as string)
  }
})

// Play theme button handler (plays the sequence of keyboard keys)
playThemeBtn.addEventListener("click", () => {
  console.log("Play theme clicked")
  console.log("Theme notes:", themeNotes)

  if (themeNotes.length === 0) {
    console.log("No theme notes loaded")
    return
  }

  if (themeInterval) {
    console.log("Clearing existing interval")
    clearInterval(themeInterval)
    themeInterval = null
  }

  let index = 0
  themeInterval = window.setInterval(() => {
    console.log(`Playing note ${index}: ${themeNotes[index]}`)

    if (index >= themeNotes.length) {
      console.log("Theme finished")
      if (themeInterval) {
        clearInterval(themeInterval)
        themeInterval = null
      }
      if (noteLine) {
        noteLine.textContent = "Theme finished!"
      }
      return
    }

    playNote(themeNotes[index])
    index++
  }, 500)
})

// Reset button handler (stops theme playback immediately)
resetBtn.addEventListener("click", () => {
  if (themeInterval) {
    clearInterval(themeInterval)
    themeInterval = null
  }
  noteLine.textContent = ""
  document
    .querySelectorAll(".key")
    .forEach((key) => key.classList.remove("pressed"))
})
