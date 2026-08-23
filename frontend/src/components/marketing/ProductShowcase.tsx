import { Bot, CheckCircle2, ClipboardList, Megaphone, ShieldCheck } from 'lucide-react'

const features = [
  ['Manage with ease', 'Handle complaints, maintenance, meetings and announcements in just a few clicks.', 'Explore features', 'teal', ClipboardList],
  ['Stay informed', 'Get important updates and announcements delivered to every resident.', 'Explore features', 'orange', Megaphone],
  ['Transparent & secure', 'Every action is logged and visible to admins for complete transparency.', 'Explore features', 'red', ShieldCheck],
  ['AI assistant', 'Ask anything about your society and get instant answers from our smart assistant.', 'Try AI Assistant', 'blue', Bot],
] as const

export function ProductShowcase() {
  return (
    <section id="features" className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-ivory-100)]">
      <div className="society-grid absolute inset-0 opacity-50" />
      <div className="absolute -right-32 top-12 h-72 w-72 rounded-full bg-[var(--color-teal-50)] blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid items-end gap-7 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-teal-700)]">EVERYTHING YOU NEED</p>
            <h2 className="mt-3 max-w-[620px] text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-[var(--color-ink-950)] sm:text-5xl">
              Everything your
              <span className="block">community needs.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[var(--color-ink-500)] lg:justify-self-end">
            SocietyOS brings together all the tools and information your community needs to stay organized and connected.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, text, link, tone, Icon]) => {
            const tones = {
              teal: 'bg-[var(--color-teal-50)] text-[var(--color-teal-700)]',
              orange: 'bg-[var(--color-apricot-100)] text-[var(--color-warning)]',
              red: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
              blue: 'bg-blue-50 text-blue-600',
            }
            return (
              <article key={title} className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(18,60,50,0.08)]">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-7 text-base font-bold text-[var(--color-ink-950)]">{title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-[var(--color-ink-500)]">{text}</p>
                <a href="#solutions" className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-teal-700)]">
                  {link} →
                </a>
              </article>
            )
          })}
        </div>

        <WhatsAppBanner />
      </div>
    </section>
  )
}

function WhatsAppBanner() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl bg-[var(--color-forest-900)] px-6 py-7 text-white shadow-[0_18px_50px_rgba(15,55,45,0.12)] sm:px-8 lg:px-10">
      <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-[var(--color-teal-600)]/20 blur-3xl" />
      <div className="relative z-10 max-w-[620px]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#22c55e] text-xl font-bold">W</div>
          <div>
            <h3 className="text-2xl font-bold tracking-[-0.02em]">Your society in your pocket.</h3>
            <p className="mt-1.5 text-sm leading-6 text-white/65">Get important updates, reminders and alerts on WhatsApp. No more missed messages.</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
              {['Instant notifications', 'Easy to use', 'Works for everyone'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#5ee18b]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-7 top-1/2 hidden -translate-y-1/2 items-center gap-4 sm:flex">
        <div className="w-[138px] overflow-hidden rounded-[1.5rem] border-4 border-white/10 bg-[#f6f8f5] p-2 shadow-xl">
          <div className="rounded-xl bg-[var(--color-forest-900)] px-2 py-2 text-[7px] font-bold text-white">SocietyOS</div>
          <div className="mt-2 rounded-lg bg-white p-2 text-[7px] leading-3 text-[var(--color-ink-500)] shadow-sm">Water supply issue in Block A has been resolved.</div>
          <div className="mt-2 rounded-lg bg-white p-2 text-[7px] leading-3 text-[var(--color-ink-500)] shadow-sm">Thanks for the update!</div>
        </div>
        <div className="flex h-[118px] w-[145px] flex-col justify-center rounded-xl bg-white p-3 text-[var(--color-ink-950)] shadow-xl">
          <div className="mx-auto h-12 w-12 rounded-md border-4 border-[var(--color-forest-900)] [background:repeating-linear-gradient(45deg,#102f27_0,#102f27_2px,#fff_2px,#fff_4px)]" />
          <p className="mt-2 text-center text-[9px] font-bold">Scan to connect on WhatsApp</p>
          <p className="mt-1 text-center text-[7px] text-[var(--color-ink-500)]">Get SocietyOS updates straight to your WhatsApp</p>
        </div>
      </div>
    </div>
  )
}
