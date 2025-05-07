"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayQuestion = displayQuestion;
function displayQuestion(question, index, total) {
    var quizContainer = document.getElementById("quiz-container");
    if (!quizContainer)
        return;
    quizContainer.innerHTML = "\n      <div class=\"question\">\n        <h3>Question ".concat(index + 1, " of ").concat(total, "</h3>\n        <p>").concat(question.question, "</p>\n        <div class=\"options\">\n          ").concat(question.options
        .map(function (option, i) { return "\n            <button onclick=\"handleAnswer(".concat(index, ", ").concat(JSON.stringify(option), ")\">\n              ").concat(option, "\n            </button>\n          "); })
        .join(""), "\n        </div>\n      </div>\n    ");
}
