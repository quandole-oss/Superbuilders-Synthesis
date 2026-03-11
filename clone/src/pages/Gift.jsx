import { useState } from "react";
import siteData from "../data/site-data.json";
import GiftTierCard from "../components/GiftTierCard";

const { gift } = siteData;

export default function Gift() {
  const [selectedTier, setSelectedTier] = useState(gift.tiers[1]); // default Three Months
  const [dateOption, setDateOption] = useState(gift.datePicker.options[0]);
  const [yourEmail, setYourEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [customDate, setCustomDate] = useState("");

  const total = selectedTier?.price ?? gift.defaultTotal;

  return (
    <div className="bg-starfield min-h-screen flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-semibold text-white mb-10 text-center">{gift.heading}</h1>

        {/* Email fields */}
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Your Email</label>
            <input
              type="email"
              value={yourEmail}
              onChange={(e) => setYourEmail(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Recipient Email</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
              placeholder="recipient@example.com"
            />
          </div>
        </div>

        {/* Gift tier cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {gift.tiers.map((tier) => (
            <GiftTierCard
              key={tier.name}
              tier={tier}
              selected={selectedTier?.name === tier.name}
              onSelect={setSelectedTier}
            />
          ))}
        </div>

        {/* Date picker toggle */}
        <div className="mb-8">
          <label className="block text-sm text-slate-400 mb-2">When to send</label>
          <div className="flex gap-2 mb-3">
            {gift.datePicker.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setDateOption(opt)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border bg-transparent ${
                  dateOption === opt
                    ? "border-white text-white"
                    : "border-white/20 text-slate-400 hover:border-white/40 hover:text-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {dateOption === "Set a Date" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
            />
          )}
        </div>

        {/* Message */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-slate-400">Message (optional)</label>
            <span className="text-xs text-slate-500">
              {message.length}/{gift.message.maxChars}
            </span>
          </div>
          <textarea
            value={message}
            onChange={(e) =>
              e.target.value.length <= gift.message.maxChars && setMessage(e.target.value)
            }
            rows={4}
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40 resize-none"
            placeholder="Add a personal message..."
          />
        </div>

        {/* Payment section */}
        <div className="rounded-xl border border-white/10 bg-black p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Payment</h2>
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 text-sm">Total</span>
            <span className="text-white text-xl font-semibold">${total}</span>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-1">Card number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full bg-slate-950 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full bg-slate-950 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">CVC</label>
              <input
                type="text"
                placeholder="123"
                className="w-full bg-slate-950 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
          <button className="w-full rounded-lg border-4 border-white bg-transparent text-white hover:bg-white/10 px-4 py-3 font-semibold transition-colors cursor-pointer text-lg">
            Purchase Gift
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-slate-500 text-center">
          By purchasing, you agree to the{" "}
          <a href={gift.links.terms} className="text-slate-400 hover:text-white no-underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href={gift.links.privacy} className="text-slate-400 hover:text-white no-underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
