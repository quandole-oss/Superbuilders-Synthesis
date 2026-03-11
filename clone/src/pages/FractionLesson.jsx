import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LessonTopBar from "../components/LessonTopBar";

/* ------------------------------------------------------------------ */
/*  Question data                                                      */
/* ------------------------------------------------------------------ */
const questions = [
  {
    id: 1,
    prompt: "What fraction of the bar is shaded?",
    totalParts: 4,
    shadedParts: 1,
    color: "bg-blue-500",
    choices: ["1/2", "1/4", "1/3", "2/4"],
    correctIndex: 1,
    tutorIntro: "Let's look at this shape together! How many equal parts do you see, and how many are colored in?",
    hintOnWrong: "Count the total parts first. The bar is split into 4 equal pieces, and 1 is shaded.",
    praiseOnCorrect: "Excellent! 1 out of 4 parts is shaded, so the fraction is 1/4. Great job!",
  },
  {
    id: 2,
    prompt: "What fraction of the bar is shaded?",
    totalParts: 3,
    shadedParts: 2,
    color: "bg-emerald-500",
    choices: ["1/3", "2/4", "2/3", "3/2"],
    correctIndex: 2,
    tutorIntro: "Here's another one! Look at the colored parts carefully.",
    hintOnWrong: "Let's think about this... the bar has 3 parts and 2 are shaded. What fraction is that?",
    praiseOnCorrect: "That's right! 2 out of 3 parts are shaded. You're getting the hang of fractions!",
  },
  {
    id: 3,
    prompt: "Which fraction is larger?",
    totalParts: 2,
    shadedParts: 1,
    color: "bg-purple-500",
    choices: ["1/2", "1/4"],
    correctIndex: 0,
    tutorIntro: "Now let's compare fractions. Think about which piece is bigger — half of something, or a quarter?",
    hintOnWrong: "Imagine splitting a pizza. Would you rather have 1 out of 2 slices, or 1 out of 4?",
    praiseOnCorrect: "Yes! 1/2 is larger than 1/4. When the top number is the same, fewer total parts means each part is bigger!",
  },
  {
    id: 4,
    prompt: "What fraction of the bar is shaded?",
    totalParts: 8,
    shadedParts: 3,
    color: "bg-amber-500",
    choices: ["3/4", "3/8", "5/8", "1/3"],
    correctIndex: 1,
    tutorIntro: "This one has more parts! Take your time and count carefully.",
    hintOnWrong: "Count all the equal sections — there are 8. Now count the shaded ones.",
    praiseOnCorrect: "Perfect! 3 out of 8 parts are shaded, so it's 3/8. You're a fraction star!",
  },
];

/* ------------------------------------------------------------------ */
/*  Fraction bar visual                                                */
/* ------------------------------------------------------------------ */
function FractionBar({ totalParts, shadedParts, color }) {
  return (
    <div className="flex gap-1 w-full max-w-md mx-auto">
      {Array.from({ length: totalParts }).map((_, i) => (
        <div
          key={i}
          className={`h-16 flex-1 rounded-md border border-white/20 transition-colors duration-300 ${
            i < shadedParts ? color : "bg-slate-800"
          }`}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chat message component                                             */
/* ------------------------------------------------------------------ */
function ChatMessage({ from, text }) {
  const isTutor = from === "tutor";
  return (
    <div className={`flex ${isTutor ? "justify-start" : "justify-end"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
          isTutor
            ? "bg-slate-800 text-slate-200"
            : "bg-blue-600/30 text-blue-100"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Typing indicator                                                   */
/* ------------------------------------------------------------------ */
function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-slate-800 rounded-xl px-4 py-2 flex gap-1 items-center">
        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main lesson component                                              */
/* ------------------------------------------------------------------ */
export default function FractionLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const question = questions[qIndex] || questions[0];
  const progress = ((qIndex + (answered ? 1 : 0)) / questions.length) * 100;
  const isCorrect = selected === question.correctIndex;
  const isLastQuestion = qIndex === questions.length - 1;

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
    // Add student's answer as a chat message
    const studentMsg = { from: "student", text: `I think it's ${question.choices[selected]}` };
    setChatMessages((prev) => [...prev, studentMsg]);

    // Tutor responds after a short delay
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
      navigate(`/exploration/fractions`);
      return;
    }
    setQIndex((prev) => prev + 1);
    setSelected(null);
    setAnswered(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <LessonTopBar
        title={`Fractions — Lesson ${lessonId || 1}`}
        progress={progress}
        onClose={() => navigate("/exploration/fractions")}
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

          {/* Fraction visualization */}
          <FractionBar
            totalParts={question.totalParts}
            shadedParts={question.shadedParts}
            color={question.color}
          />

          {/* Label below bar */}
          <p className="text-slate-400 text-sm m-0">
            {question.shadedParts} of {question.totalParts} parts shaded
          </p>

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
        <div className="flex-[3] border-l border-white/10 bg-slate-950 flex flex-col max-h-screen lg:max-h-none">
          {/* Chat header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 015 5v3H7V7a5 5 0 015-5z" />
                <rect x="3" y="10" width="18" height="12" rx="2" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-semibold m-0">Tutor</p>
              <p className="text-green-400 text-xs m-0">Online</p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {chatMessages.map((msg, i) => (
              <ChatMessage key={i} from={msg.from} text={msg.text} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </div>
      </div>
    </div>
  );
}
