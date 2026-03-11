import { Link } from "react-router-dom";

const avatarColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-rose-500",
];

export default function StudentCard({ student, index = 0, linkTo }) {
  const color = avatarColors[index % avatarColors.length];

  const card = (
    <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-white/10 bg-black hover:bg-white/5 transition-colors cursor-pointer">
      <div
        className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-2xl font-semibold text-white`}
      >
        {student.initial || student.name.charAt(0).toUpperCase()}
      </div>
      <span className="text-white font-medium text-lg">{student.name}</span>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="no-underline">
        {card}
      </Link>
    );
  }

  return card;
}
