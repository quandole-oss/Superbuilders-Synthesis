import { Link } from "react-router-dom";
import siteData from "../data/site-data.json";
import ReferralStep from "../components/ReferralStep";

const { referral } = siteData;

export default function Referral() {
  return (
    <div className="bg-starfield min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Back to dashboard */}
        <Link
          to="/students"
          className="text-slate-400 hover:text-white text-sm no-underline transition-colors mb-8 inline-block"
        >
          &larr; Back to dashboard
        </Link>

        <h1 className="text-4xl font-semibold text-white mb-3">{referral.heading}</h1>
        <p className="text-slate-400 mb-10">{referral.description}</p>

        {/* Steps */}
        <div className="flex flex-col gap-4">
          {referral.steps.map((step) => (
            <ReferralStep key={step.step} step={step} />
          ))}
        </div>
      </div>
    </div>
  );
}
