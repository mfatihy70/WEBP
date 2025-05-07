"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateScore = calculateScore;
function calculateScore(questions, answers) {
    var result = {
        totalCorrect: 0,
        totalPoints: 0,
        maxPossiblePoints: 0,
        byCategory: {},
    };
    questions.forEach(function (question, index) {
        var isCorrect = answers[index] === question.answer;
        var points = question.difficulty === "easy"
            ? 1
            : question.difficulty === "medium"
                ? 2
                : 3;
        result.maxPossiblePoints += points;
        if (isCorrect) {
            result.totalCorrect++;
            result.totalPoints += points;
        }
        if (!result.byCategory[question.category]) {
            result.byCategory[question.category] = { correct: 0, total: 0, points: 0 };
        }
        result.byCategory[question.category].total++;
        if (isCorrect) {
            result.byCategory[question.category].correct++;
            result.byCategory[question.category].points += points;
        }
    });
    return result;
}
