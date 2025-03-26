// Task 3: Define Interfaces for PianoKey (2 Points)
interface PianoKey {
  key: string
  note: string
  audio: string
}

// Select elements with proper type casting (Task 2: Add Type Annotations)
const pianoContainer = document.getElementById("piano") as HTMLElement
const noteLine = document.getElementById("note-line") as HTMLElement
const playThemeBtn = document.getElementById(
  "play-theme-btn"
) as HTMLButtonElement
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement

// Task 2: Add Type Annotations for core game variables
let pianoKeys: PianoKey[] = []
let themeNotes: string[] = []
let themeInterval: number | null = null

// Load and display piano keys dynamically from fetched data
document.addEventListener("DOMContentLoaded", () => {
  fetch("notes.json")
    .then((response) => response.json())
    .then((data: PianoKey[]) => {
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
    .then((data: string[]) => {
      themeNotes = data
    })
    .catch((error) => console.error("Error loading theme:", error))
})

// Play note function (modified to not use .find())
function playNote(key: string): void {
  let keyObj: PianoKey | undefined
  for (let i = 0; i < pianoKeys.length; i++) {
    if (pianoKeys[i].key === key) {
      keyObj = pianoKeys[i]
      break
    }
  }

  if (keyObj) {
    const audio = new Audio(keyObj.audio)
    audio.play().catch((error) => console.error("Audio playback error:", error))

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

// Keyboard interaction
document.addEventListener("keydown", (event: KeyboardEvent) => {
  playNote(event.key.toUpperCase())
})

// Mouse interaction
document.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.classList.contains("key")) {
    playNote(target.dataset.key as string)
  }
})

// Play theme button handler
playThemeBtn.addEventListener("click", () => {
  if (themeNotes.length === 0) return

  let index = 0
  themeInterval = window.setInterval(() => {
    if (index >= themeNotes.length) {
      clearInterval(themeInterval as number)
      noteLine.textContent = "Theme finished!"
      return
    }
    playNote(themeNotes[index])
    index++
  }, 500)
})

// Reset button handler
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
