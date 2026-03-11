export default function ReferralStep({ step }) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl border border-white/10 bg-black">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold text-lg shrink-0">
        {step.step}
      </div>
      <span className="text-white font-medium">{step.label}</span>
    </div>
  );
}
