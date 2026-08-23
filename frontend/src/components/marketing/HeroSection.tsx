import { ArrowRight, Check, Search, Bell, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[var(--color-teal-50)]/70 blur-3xl" />
      <div className="absolute right-[-8%] top-[-15%] h-[520px] w-[520px] rounded-full bg-[var(--color-mint-50)] blur-3xl" />
      <div className="society-dots absolute right-0 top-0 h-[440px] w-[48%] opacity-60" />

      <div className="relative mx-auto max-w-[1440px] px-5 pb-12 pt-12 sm:px-8 sm:pb-14 sm:pt-14 lg:px-10 lg:pb-16 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
          <div className="max-w-[560px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/90 px-4 py-2.5 text-[13px] font-semibold text-[var(--color-teal-700)] shadow-sm">
              <span className="text-[var(--color-warning)]">✦</span>
              All-in-one society management
            </div>

            <h1 className="mt-7 text-[3.7rem] font-bold leading-[0.97] tracking-[-0.06em] text-[var(--color-ink-950)] sm:text-[4.6rem] lg:text-[5rem]">
              Your society,
              <span className="block text-[var(--color-teal-700)]">finally in</span>
              <span className="block text-[var(--color-teal-700)]">one place.</span>
            </h1>

            <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-[var(--color-ink-500)] sm:text-base">
              SocietyOS helps residents and admins manage everything from
              complaints to meetings, maintenance, announcements and more,
              simple, transparent and hassle-free.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--color-forest-900)] px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-forest-800)]"
              >
                Get started for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <a
                href="#contact"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-6 text-sm font-bold text-[var(--color-ink-950)] transition hover:bg-[var(--color-ivory-100)]"
              >
                Book a demo
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[var(--color-ink-500)]">
              <Trust text="Easy to use" />
              <Trust text="Secure & private" />
              <Trust text="Trusted by communities" />
            </div>
          </div>

          <DashboardMockup />
        </div>

        <TrustedStrip />
      </div>
    </section>
  )
}

function Trust({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-teal-50)] text-[var(--color-teal-700)]">
        <Check className="h-3.5 w-3.5" />
      </span>
      {text}
    </span>
  )
}

function DashboardMockup() {
  const nav = ['Home', 'Complaints', 'Announcements', 'Meetings', 'Maintenance', 'Residents', 'Help & Support', 'Settings']

  return (
    <div className="relative min-w-0">
      <div className="absolute -inset-16 rounded-[50%] bg-[radial-gradient(circle,var(--color-mint-50)_0%,rgba(255,255,255,0)_68%)]" />

      <div className="relative mx-auto max-w-[780px] overflow-hidden rounded-[1.6rem] border border-[var(--color-border)] bg-white shadow-[0_28px_80px_rgba(16,55,46,0.14)]">
        <div className="grid min-h-[390px] grid-cols-[132px_1fr] sm:min-h-[430px] sm:grid-cols-[154px_1fr]">
          <aside className="border-r border-[var(--color-border)] bg-[var(--color-ivory-50)] p-3.5 sm:p-4">
            <div className="flex items-center gap-2 px-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-forest-900)] text-[11px] font-bold text-white">
                S
              </div>
              <span className="text-[10px] font-bold text-[var(--color-ink-950)]">SocietyOS</span>
            </div>
            <div className="mt-6 space-y-1.5">
              {nav.map((item, index) => (
                <div
                  key={item}
                  className={`rounded-lg px-2.5 py-2 text-[9px] ${
                    index === 0
                      ? 'bg-[var(--color-teal-50)] font-bold text-[var(--color-teal-700)]'
                      : 'text-[var(--color-ink-500)]'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="min-w-0 bg-white p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-[var(--color-ink-400)]" />
                <div className="h-10 rounded-lg bg-[var(--color-ivory-100)] pl-9 text-[9px] leading-10 text-[var(--color-ink-400)]">
                  Search anything...
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)]">
                <Bell className="h-3.5 w-3.5 text-[var(--color-ink-500)]" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)]">
                <UserRound className="h-3.5 w-3.5 text-[var(--color-ink-500)]" />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--color-teal-700)]">
                YOUR SOCIETY
              </p>
              <h3 className="mt-1.5 text-lg font-bold text-[var(--color-ink-950)] sm:text-xl">
                Good morning, Ankit 👋
              </h3>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <Stat label="Open Complaints" value="12" />
              <Stat label="Pending Payments" value="₹4,250" />
              <Stat label="Upcoming Meetings" value="2" />
            </div>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-xl border border-[var(--color-border)] p-3.5">
                <p className="text-[9px] font-bold text-[var(--color-ink-950)]">Recent Updates</p>
                <div className="mt-3.5 space-y-3.5">
                  <Update title="Water supply issue in Block A resolved" time="2 hours ago" tone="teal" />
                  <Update title="Lift maintenance scheduled for tomorrow" time="5 hours ago" tone="teal" />
                  <Update title="Society meeting on Sunday" time="1 day ago" tone="orange" />
                </div>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] p-3.5">
                <p className="text-[9px] font-bold text-[var(--color-ink-950)]">Quick Actions</p>
                <div className="mt-3.5 space-y-2">
                  {['Raise a Complaint', 'View Announcements', 'Check Maintenance Dues', 'View Meetings'].map(
                    (item) => (
                      <div key={item} className="rounded-lg border border-[var(--color-border)] px-2.5 py-2.5 text-[8px] font-semibold text-[var(--color-ink-700)]">
                        {item}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--color-forest-900)] px-4 py-3 text-white">
              <div>
                <p className="text-[9px] font-bold">Need help?</p>
                <p className="mt-0.5 text-[8px] text-white/55">
                  Ask our AI assistant anything about your society.
                </p>
              </div>
              <span className="rounded-lg border border-white/20 px-3.5 py-2 text-[8px] font-bold">Ask now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] p-3.5">
      <p className="text-[8px] text-[var(--color-ink-400)]">{label}</p>
      <p className="mt-1.5 text-base font-bold text-[var(--color-ink-950)] sm:text-lg">{value}</p>
    </div>
  )
}

function Update({ title, time, tone }: { title: string; time: string; tone: 'teal' | 'orange' }) {
  return (
    <div className="flex gap-2.5">
      <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${tone === 'teal' ? 'bg-[var(--color-teal-50)] text-[var(--color-teal-700)]' : 'bg-[var(--color-apricot-100)] text-[var(--color-warning)]'}`}>
        <Check className="h-3 w-3" />
      </div>
      <div>
        <p className="text-[8px] font-semibold leading-4 text-[var(--color-ink-800)]">{title}</p>
        <p className="text-[7px] text-[var(--color-ink-400)]">{time}</p>
      </div>
    </div>
  )
}

function TrustedStrip() {
  return (
    <div className="mx-auto mt-9 flex max-w-[650px] flex-col items-center rounded-xl border border-[var(--color-border)] bg-white/95 px-6 py-4 shadow-sm sm:flex-row sm:justify-center sm:gap-6">
      <p className="whitespace-nowrap text-[10px] font-semibold text-[var(--color-ink-700)]">
        Trusted by <strong>500+</strong> societies across India
      </p>
      <div className="hidden h-5 w-px bg-[var(--color-border)] sm:block" />
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[8px] text-[var(--color-ink-400)]">
        <span>◉ Green Residency</span>
        <span>◈ Sunrise Apartments</span>
        <span>✣ Maple Heights</span>
        <span>✦ Lakeview Society</span>
      </div>
    </div>
  )
}
