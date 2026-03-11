import { Link } from "react-router-dom";
import siteData from "../data/site-data.json";
import StudentCard from "../components/StudentCard";

const { students: studentsPage } = siteData.pages;
const students = siteData.students;

export default function Students() {
  return (
    <div className="bg-starfield min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-semibold text-white mb-10">{studentsPage.heading}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 w-full max-w-lg">
        {students.map((student, i) => (
          <StudentCard
            key={student.name}
            student={student}
            index={i}
            linkTo="/account/billing"
          />
        ))}
      </div>

      <Link
        to={studentsPage.addStudentLink}
        className="text-slate-400 hover:text-white text-sm no-underline transition-colors"
      >
        + {studentsPage.addStudentLabel}
      </Link>
    </div>
  );
}
