import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Students from "./pages/Students";
import Activity from "./pages/Activity";
import Billing from "./pages/Billing";
import Subscribe from "./pages/Subscribe";
import Gift from "./pages/Gift";
import Referral from "./pages/Referral";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import FractionsUnit from "./pages/FractionsUnit";
import FractionLesson from "./pages/FractionLesson";
import BonusUnit from "./pages/BonusUnit";
import FlashcardFrenzy from "./pages/FlashcardFrenzy";
import UnitPage from "./components/UnitPage";
import LessonShell from "./components/LessonShell";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/signup" element={<Signup />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/account/billing" element={<Billing />} />
        <Route path="/account/subscribe" element={<Subscribe />} />
        <Route path="/gift" element={<Gift />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/exploration/fractions" element={<FractionsUnit />} />
        <Route path="/exploration/fractions/:lessonId" element={<FractionLesson />} />
        <Route path="/exploration/bonus" element={<BonusUnit />} />
        <Route path="/exploration/flashcard_frenzy_multiply" element={<FlashcardFrenzy />} />
        <Route path="/exploration/:subjectSlug" element={<UnitPage />} />
        <Route path="/exploration/:subjectSlug/:lessonId" element={<LessonShell />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
