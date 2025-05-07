import { Question } from "./question"

export function displayQuestion(
  question: Question,
  index: number,
  total: number
): void {
  const quizContainer = document.getElementById("quiz-container")
  if (!quizContainer) return

  quizContainer.innerHTML = `
      <div class="question">
        <h3>Question ${index + 1} of ${total}</h3>
        <p>${question.question}</p>
        <div class="options">
          ${question.options
            .map(
              (option, i) => `
            <button onclick="handleAnswer(${index}, ${JSON.stringify(option)})">
              ${option}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `
}
