// Mapping of keyboard keys to musical notes
const keyMap = {
  A: "C",
  S: "D",
  D: "E",
  F: "F",
  G: "G",
  H: "A",
  J: "B",
}

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Select all elements with the class "key"
  const keys = document.querySelectorAll(".key")

  // Function to play a note
  function playNote(note) {
    if (!note) return // If no note is provided, do nothing
    const audio = document.getElementById(`audio${note}`) // Get the audio element for the note
    if (audio) {
      audio.currentTime = 0 // Reset the audio to the start
      audio.play() // Play the audio
    }
  }

  // Add click event listeners to each key element
  keys.forEach((key) => {
    key.addEventListener("click", () => {
      playNote(key.getAttribute("data-note")) // Play the note associated with the clicked key
    })
  })

  // Add keydown event listener to the document
  document.addEventListener("keydown", (event) => {
    const note = keyMap[event.key.toUpperCase()] // Get the note associated with the pressed key
    if (note) {
      playNote(note) // Play the note
    }
  })
})
