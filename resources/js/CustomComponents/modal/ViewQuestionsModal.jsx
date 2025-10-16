import { FaTimes, FaCheckCircle } from "react-icons/fa";
import Modal from "./Modal";

export default function ViewQuestionsModal({
  show,
  onClose,
  questions = [],
  answers = {},
  questionType = () => "",
}) {
  return (
    <Modal show={show} onClose={onClose}>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[var(--primary)]">
            Preguntas del examen
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--secondary)] hover:text-[var(--primary)]"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-6">
          {questions.length > 0 &&
            questions.map((question, index) => {
              const options = JSON.parse(question.options);
              const correctAnswers = JSON.parse(question.correct_answers);
              const userAnswer = answers.length > 0 ? answers[question.id] : null;

              const isUserCorrect =
                userAnswer !== undefined &&
                userAnswer !== null &&
                userAnswer !== "" &&
                correctAnswers.includes(userAnswer);

              return (
                <div
                  key={question.id}
                  className={`border rounded-lg p-4 ${
                    userAnswer !== undefined
                      ? isUserCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-[var(--secondary)] bg-[var(--font)]"
                  }`}
                  >
                      
                  <div
                    id={`question_${question.id}`}
                    className="flex justify-between items-center mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--primary)] bg-[var(--fontBox)] px-2 py-1 rounded">
                        Pregunta {index + 1}
                      </span>
                      {userAnswer !== undefined && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            isUserCorrect
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {isUserCorrect ? "✓ Correcta" : "✗ Incorrecta"}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 capitalize">
                      {questionType(question.question_type)}
                    </span>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-4">
                    {question.question}
                  </h4>

                  {/* OPTIONS */}
                  <div className="space-y-2 mb-4">
                    {options.map((option, optionIndex) => {
                      const isCorrect = correctAnswers.includes(optionIndex);
                      const isUserSelection = userAnswer === optionIndex;

                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-md border ${
                            isCorrect
                              ? "bg-green-100 border-green-500 font-medium"
                              : isUserSelection
                              ? "bg-red-100 border-red-500"
                              : "bg-[var(--fontBox)] border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={
                                isUserSelection && !isCorrect
                                  ? "line-through"
                                  : ""
                              }
                            >
                              {option}
                            </span>
                            <div className="flex items-center gap-2">
                              {isUserSelection && (
                                <span
                                  className={`font-medium text-sm ${
                                    isCorrect
                                      ? "text-green-700"
                                      : "text-red-700"
                                  }`}
                                >
                                  Tu respuesta
                                </span>
                              )}
                              {isCorrect && (
                                <span className="text-green-700 font-medium text-sm">
                                  <FaCheckCircle />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {question.explanation && (
                    <div className="bg-blue-50 border-l-4 border-[var(--secondary)] p-3 rounded-r">
                      <div className="flex items-start">
                        <span className="text-[var(--secondary)] font-bold text-sm">
                          Explicación:
                        </span>
                        <span className="ml-1 text-sm text-[var(--secondary)]">
                          {question.explanation}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
