import siteData from "../data/site-data.json";
import Sidebar from "../components/Sidebar";

const { accountSubscribe } = siteData.pages;
const user = siteData.user;

export default function Subscribe() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-white mb-8">{accountSubscribe.heading}</h1>

        {/* Account details */}
        <div className="rounded-xl border border-white/10 bg-black p-6 mb-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <span className="text-slate-400">Email</span>
              <p className="text-white mt-1">{user.email}</p>
            </div>
            <div>
              <span className="text-slate-400">Status</span>
              <p className="text-white mt-1">{user.accountStatus}</p>
            </div>
            <div>
              <span className="text-slate-400">Plan</span>
              <p className="text-white mt-1">{user.plan.name}</p>
            </div>
            <div>
              <span className="text-slate-400">Type</span>
              <p className="text-white mt-1">{user.plan.type}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {accountSubscribe.actions.map((action) => (
              <button
                key={action}
                className="rounded-lg border-2 border-white/20 bg-transparent text-white hover:bg-white/10 px-4 py-2 font-medium text-sm cursor-pointer transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Billing section */}
        <section className="mb-8 max-w-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Billing</h2>
          <div className="rounded-xl border border-white/10 bg-black p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 text-sm">Next billing cycle</span>
              <span className="text-white text-sm">{user.plan.nextBillingCycle}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 text-sm">Amount due</span>
              <span className="text-white text-sm">${user.plan.amountDue} {user.plan.currency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Payment method</span>
              <span className="text-white text-sm">
                **** {user.paymentMethod.lastFour} &middot; Exp {user.paymentMethod.expiration}
              </span>
            </div>
          </div>
        </section>

        {/* Students section */}
        <section className="mb-8 max-w-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Students</h2>
          <div className="rounded-xl border border-white/10 bg-black p-6">
            {siteData.students.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold text-white">
                  {s.initial}
                </div>
                <span className="text-white text-sm">{s.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Referral section */}
        <section className="mb-8 max-w-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Referral</h2>
          <div className="rounded-xl border border-white/10 bg-black p-6">
            <p className="text-slate-400 text-sm mb-3">
              Share your referral link and earn credits toward your subscription.
            </p>
            <a
              href="/referral"
              className="text-blue-400 hover:text-blue-300 text-sm no-underline"
            >
              View Referral Program &rarr;
            </a>
          </div>
        </section>

        {/* Invoices table */}
        <section className="mb-8 max-w-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Invoices</h2>
          <div className="rounded-xl border border-white/10 bg-black overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 font-medium px-6 py-3">Date</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-3">Amount</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 text-slate-400" colSpan={3}>
                    No invoices yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Logout button */}
        <button className="rounded-lg border-2 border-white/20 bg-transparent text-slate-400 hover:text-white hover:bg-white/10 px-4 py-2 font-medium text-sm cursor-pointer transition-colors">
          Log Out
        </button>
      </main>
    </div>
  );
}
