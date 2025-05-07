import { calculateScore } from "./calculate_score"

function objectEntries<T extends Record<string, any>>(obj: T): [keyof T, T[keyof T]][] {
  return Object.keys(obj).map((key) => [key as keyof T, obj[key]])
}

export function displayScore(
  scoreResult: ReturnType<typeof calculateScore>
): void {
  const quizContainer = document.getElementById("quiz-container")
  if (!quizContainer) return

  const percentage = Math.round(
    (scoreResult.totalPoints / scoreResult.maxPossiblePoints) * 100
  )

  quizContainer.innerHTML = `
        <div class="results">
          <h2>Quiz Completed!</h2>
          <p>You scored ${scoreResult.totalPoints} out of ${
    scoreResult.maxPossiblePoints
  } (${percentage}%)</p>
          
          <h3>Breakdown by Category:</h3>
          <ul class="category-results">
            ${objectEntries(scoreResult.byCategory)
              .map(
                ([category, stats]) => `
              <li>
                <strong>${category}:</strong> 
                ${stats.correct}/${stats.total} correct (${stats.points} points)
              </li>
            `
              )
              .join("")}
          </ul>
          
          <button onclick="startNewQuiz()">Try Again</button>
        </div>
      `
}
