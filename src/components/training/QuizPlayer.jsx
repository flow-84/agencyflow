import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPlayer({ 
  quiz, 
  onComplete,
  passingScore = 70,
  previousScore = null,
  attempts = 0
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = quiz?.questions || [];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleSelectAnswer = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        correctCount++;
      }
    });
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    setScore(scorePercent);
    setShowResults(true);
    onComplete?.(scorePercent, scorePercent >= passingScore);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (!quiz || questions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">Kein Quiz verfügbar</p>
      </Card>
    );
  }

  if (showResults) {
    const passed = score >= passingScore;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className={`border-0 shadow-xl ${passed ? 'bg-gradient-to-br from-emerald-50 to-teal-50' : 'bg-gradient-to-br from-rose-50 to-orange-50'}`}>
          <CardContent className="p-8 text-center">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
              passed ? 'bg-emerald-100' : 'bg-rose-100'
            }`}>
              {passed ? (
                <Trophy className="w-12 h-12 text-emerald-600" />
              ) : (
                <XCircle className="w-12 h-12 text-rose-600" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {passed ? 'Glückwunsch! Quiz bestanden!' : 'Leider nicht bestanden'}
            </h2>
            
            <p className="text-slate-600 mb-6">
              Du hast <span className="font-bold text-2xl">{score}%</span> erreicht.
              {!passed && ` Du brauchst mindestens ${passingScore}% zum Bestehen.`}
            </p>

            <div className="flex justify-center gap-4">
              {!passed && (
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Erneut versuchen
                </Button>
              )}
              {passed && (
                <Badge className="bg-emerald-100 text-emerald-700 text-lg px-4 py-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Abgeschlossen
                </Badge>
              )}
            </div>

            {/* Answer Review */}
            <div className="mt-8 text-left">
              <h3 className="font-semibold text-slate-900 mb-4">Auswertung:</h3>
              <div className="space-y-3">
                {questions.map((q, index) => {
                  const isCorrect = selectedAnswers[index] === q.correct_answer;
                  return (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg ${isCorrect ? 'bg-emerald-100' : 'bg-rose-100'}`}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{q.question}</p>
                          {!isCorrect && (
                            <p className="text-sm text-slate-600 mt-1">
                              Richtige Antwort: {q.options[q.correct_answer]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-violet-700 border-violet-200">
            Frage {currentQuestion + 1} von {totalQuestions}
          </Badge>
          {attempts > 0 && (
            <Badge variant="secondary">
              Versuch {attempts + 1}
            </Badge>
          )}
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              {currentQ.question}
            </h3>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(currentQuestion, index)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-violet-500 bg-violet-50' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-violet-500 bg-violet-500' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      <span className={isSelected ? 'text-violet-900 font-medium' : 'text-slate-700'}>
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Zurück
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {currentQuestion === totalQuestions - 1 ? 'Auswerten' : 'Weiter'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}