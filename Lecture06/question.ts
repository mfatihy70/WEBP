export interface Question {
  category: string
  question: string
  options: (string | number)[]
  answer: string | number
  difficulty: "easy" | "medium" | "hard"
}
