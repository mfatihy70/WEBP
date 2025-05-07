"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayScore = displayScore;
function objectEntries(obj) {
    return Object.keys(obj).map(function (key) { return [key, obj[key]]; });
}
function displayScore(scoreResult) {
    var quizContainer = document.getElementById("quiz-container");
    if (!quizContainer)
        return;
    var percentage = Math.round((scoreResult.totalPoints / scoreResult.maxPossiblePoints) * 100);
    quizContainer.innerHTML = "\n        <div class=\"results\">\n          <h2>Quiz Completed!</h2>\n          <p>You scored ".concat(scoreResult.totalPoints, " out of ").concat(scoreResult.maxPossiblePoints, " (").concat(percentage, "%)</p>\n          \n          <h3>Breakdown by Category:</h3>\n          <ul class=\"category-results\">\n            ").concat(objectEntries(scoreResult.byCategory)
        .map(function (_a) {
        var category = _a[0], stats = _a[1];
        return "\n              <li>\n                <strong>".concat(category, ":</strong> \n                ").concat(stats.correct, "/").concat(stats.total, " correct (").concat(stats.points, " points)\n              </li>\n            ");
    })
        .join(""), "\n          </ul>\n          \n          <button onclick=\"startNewQuiz()\">Try Again</button>\n        </div>\n      ");
}
