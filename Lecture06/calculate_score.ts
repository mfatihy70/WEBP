import { Question } from "./question"

export function calculateScore(
  questions: Question[],
  answers: Record<number, string | number>
): {
  totalCorrect: number
  totalPoints: number
  maxPossiblePoints: number
  byCategory: Record<string, { correct: number; total: number; points: number }>
} {
  const result = {
    totalCorrect: 0,
    totalPoints: 0,
    maxPossiblePoints: 0,
    byCategory: {} as Record<
      string,
      { correct: number; total: number; points: number }
    >,
  }

  questions.forEach((question, index) => {
    const isCorrect = answers[index] === question.answer
    const points =
      question.difficulty === "easy"
        ? 1
        : question.difficulty === "medium"
        ? 2
        : 3

    result.maxPossiblePoints += points
    if (isCorrect) {
      result.totalCorrect++
      result.totalPoints += points
    }

    if (!result.byCategory[question.category]) {
      result.byCategory[question.category] = { correct: 0, total: 0, points: 0 }
    }

    result.byCategory[question.category].total++
    if (isCorrect) {
      result.byCategory[question.category].correct++
      result.byCategory[question.category].points += points
    }
  })

  return result
}
