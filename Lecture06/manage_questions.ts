import { Question } from "./question"

declare global {
  interface Promise<T> {
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
    ): Promise<TResult1 | TResult2>

    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
    ): Promise<T | TResult>

    finally(onfinally?: (() => void) | null): Promise<T>
  }

  interface PromiseConstructor {
    new <T>(
      executor: (
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void
      ) => void
    ): Promise<T>
    resolve<T>(value: T | PromiseLike<T>): Promise<T>
    reject(reason?: any): Promise<never>
    all<T>(values: (T | PromiseLike<T>)[]): Promise<T[]>
    race<T>(values: (T | PromiseLike<T>)[]): Promise<T>
  }

  var Promise: PromiseConstructor
}

export {}

export async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch("./questions.json")
  if (!response.ok) throw new Error("Failed to fetch questions")
  return response.json()
}

function shuffleQuestions(questions: Question[]): Question[] {
  return [...questions].sort(() => Math.random() - 0.5)
}

export function getQuestionsForPlayer(allQuestions: Question[]): Question[] {
  const easy = allQuestions.filter((q) => q.difficulty === "easy")
  const medium = allQuestions.filter((q) => q.difficulty === "medium")
  const hard = allQuestions.filter((q) => q.difficulty === "hard")

  // Get 2 easy, 2 medium, and 1 hard question (adjust as needed)
  return [
    ...shuffleQuestions(easy).slice(0, 2),
    ...shuffleQuestions(medium).slice(0, 2),
    ...shuffleQuestions(hard).slice(0, 1),
  ]
}
