import { fetchQuestions, getQuestionsForPlayer } from "./manage_questions"
import { calculateScore } from "./calculate_score"
import { displayQuestion } from "./display_question"
import { displayScore } from "./display_score"
import { Question } from "./question"

let currentQuestions: Question[] = []
let userAnswers: Record<number, string | number> = {}
let currentQuestionIndex = 0

async function startQuiz() {
  try {
    const allQuestions = await fetchQuestions()
    currentQuestions = getQuestionsForPlayer(allQuestions)
    userAnswers = {}
    currentQuestionIndex = 0

    displayQuestion(currentQuestions[0], 0, currentQuestions.length)
  } catch (error) {
    console.error("Error starting quiz:", error)
    alert("Failed to load questions. Please try again later.")
  }
}

;(window as any).handleAnswer = (index: number, answer: string | number) => {
  userAnswers[index] = answer

  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex++
    displayQuestion(
      currentQuestions[currentQuestionIndex],
      currentQuestionIndex,
      currentQuestions.length
    )
  } else {
    const score = calculateScore(currentQuestions, userAnswers)
    displayScore(score)
  }
}

;(window as any).startNewQuiz = startQuiz

// Initialize quiz when page loads
document.addEventListener("DOMContentLoaded", startQuiz)
