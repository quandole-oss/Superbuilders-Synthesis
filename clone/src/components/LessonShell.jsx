import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LessonTopBar from "./LessonTopBar";
import ChatPanel from "./ChatPanel";
import { subjects } from "../data/lessons-data";

import NumberLine from "./visuals/NumberLine";
import FractionBar from "./visuals/FractionBar";
import ArrayGrid from "./visuals/ArrayGrid";
import GroupingDiagram from "./visuals/GroupingDiagram";
import PlaceValueChart from "./visuals/PlaceValueChart";

const visualMap = {
  "number-line": NumberLine,
  "fraction-bar": FractionBar,
  "array-grid": ArrayGrid,
  "grouping": GroupingDiagram,
  "place-value-chart": PlaceValueChart,
};

export default function LessonShell() {
  const { subjectSlug, lessonId } = useParams();
  const navigate = useNavigate();

  const subject = subjects[subjectSlug];
  const questions = subject?.questionsByLesson?.[lessonId];

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Redirect if subject or lesson not found
  if (!subject || !questions) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
        <h2 className="text-xl font-semibold">Lesson not found</h2>
        <button
          onClick={() => navigate(subject ? `/exploration/${subjectSlug}` : "/account/billing")}
          className="px-6 py-2 rounded-lg border-2 border-white/20 text-white bg-transparent hover:bg-white/10 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const question = questions[qIndex] || questions[0];
  const progress = ((qIndex + (answered ? 1 : 0)) / questions.length) * 100;
  const isCorrect = selected === question.correctIndex;
  const isLastQuestion = qIndex === questions.length - 1;

  const Visual = visualMap[question.visualType];

  // Show tutor intro when question changes
  useEffect(() => {
    setChatMessages([]);
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      setChatMessages([{ from: "tutor", text: question.tutorIntro }]);
    }, 800);
    return () => clearTimeout(timer);
  }, [qIndex, question.tutorIntro]);

  function handleSelect(choiceIndex) {
    if (answered) return;
    setSelected(choiceIndex);
  }

  function handleSubmit() {
    if (selected === null || answered) return;
    setAnswered(true);

    const correct = selected === question.correctIndex;
    const studentMsg = { from: "student", text: `I think it's ${question.choices[selected]}` };
    setChatMessages((prev) => [...prev, studentMsg]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const tutorReply = {
        from: "tutor",
        text: correct ? question.praiseOnCorrect : question.hintOnWrong,
      };
      setChatMessages((prev) => [...prev, tutorReply]);
    }, 1000);
  }

  function handleNext() {
    if (isLastQuestion) {
      navigate(`/exploration/${subjectSlug}`);
      return;
    }
    setQIndex((prev) => prev + 1);
    setSelected(null);
    setAnswered(false);
  }

  const lessonTitle = subject.lessons.find((l) => l.id === Number(lessonId))?.title || `Lesson ${lessonId}`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <LessonTopBar
        title={`${subject.title} — ${lessonTitle}`}
        progress={progress}
        onClose={() => navigate(`/exploration/${subjectSlug}`)}
      />

      {/* Spacer for fixed top bar */}
      <div className="h-14" />

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Left panel — Interactive area (70%) */}
        <div className="flex-[7] flex flex-col items-center justify-center p-8 gap-8">
          {/* Question prompt */}
          <h2 className="text-xl font-semibold text-center m-0">
            {question.prompt}
          </h2>

          {/* Visual */}
          {Visual && <Visual {...question.visualParams} />}

          {/* Answer choices */}
          <div className="flex flex-wrap gap-3 justify-center">
            {question.choices.map((choice, i) => {
              let btnClasses =
                "px-6 py-3 rounded-lg border-2 text-lg font-semibold cursor-pointer transition-all duration-200 ";

              if (answered && i === question.correctIndex) {
                btnClasses += "bg-green-500/20 border-green-500 text-green-300";
              } else if (answered && i === selected && !isCorrect) {
                btnClasses += "bg-red-500/20 border-red-500 text-red-300";
              } else if (i === selected) {
                btnClasses += "bg-blue-500/20 border-blue-500 text-blue-300";
              } else {
                btnClasses +=
                  "bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={btnClasses}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {/* Submit / Next buttons */}
          <div className="flex gap-4">
            {!answered ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className={`px-8 py-3 rounded-lg border-4 font-semibold transition-all duration-200 ${
                  selected === null
                    ? "border-slate-600 text-slate-600 cursor-not-allowed bg-transparent"
                    : "border-white text-white bg-transparent hover:bg-white/10 cursor-pointer"
                }`}
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-lg border-4 border-white text-white bg-transparent hover:bg-white/10 cursor-pointer font-semibold transition-all duration-200"
              >
                {isLastQuestion ? "Finish Lesson" : "Next"}
              </button>
            )}
          </div>
        </div>

        {/* Right panel — Tutor chat (30%) */}
        <ChatPanel chatMessages={chatMessages} isTyping={isTyping} />
      </div>
    </div>
  );
}
