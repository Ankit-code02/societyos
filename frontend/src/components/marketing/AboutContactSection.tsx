import { ArrowRight, Mail, MapPin, MessageCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function AboutContactSection() {
  return (
    <>
      <section id="about" className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-ivory-100)]">
        <div className="society-grid absolute inset-0 opacity-45" />
        <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-teal-700)]">ABOUT SOCIETYOS</p>
              <h2 className="mt-3 max-w-[650px] text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-[var(--color-ink-950)] sm:text-5xl">A calmer way to run a community.</h2>
              <p className="mt-5 max-w-[650px] text-sm leading-7 text-[var(--color-ink-500)]">
                SocietyOS brings residents, administrators and committee members into one simple system. Instead of scattered WhatsApp messages, spreadsheets and disconnected updates, communities get one organized place to manage everyday society work.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Resident-first', 'Transparent', 'Simple to use'].map((item) => <span key={item} className="rounded-full border border-[var(--color-border)] bg-white px-3.5 py-2 text-[10px] font-semibold text-[var(--color-ink-700)]">{item}</span>)}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[var(--color-forest-900)] p-7 text-white shadow-[0_22px_55px_rgba(15,55,45,0.14)]">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[var(--color-teal-600)]/20 blur-2xl" />
              <p className="relative text-xs font-bold text-[var(--color-teal-200)]">WHY SOCIETYOS?</p>
              <div className="relative mt-6 space-y-4">
                {['One place for daily society operations', 'Clear communication between residents and admins', 'Better visibility into complaints, meetings and payments', 'Built to grow with your community'].map((item) => (
                  <div key={item} className="flex gap-3 text-xs leading-5 text-white/70"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-teal-200)]" />{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden border-t border-[var(--color-border)] bg-white">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_center,var(--color-teal-50),transparent_65%)]" />
        <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-teal-700)]">CONTACT</p>
              <h2 className="mt-3 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-[var(--color-ink-950)] sm:text-5xl">Let’s talk about your society.</h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-[var(--color-ink-500)]">Want a walkthrough, have a question, or need help getting your community started? Send us a message.</p>
              <div className="mt-7 space-y-3">
                <ContactLine icon={Mail} text="hello@societyos.in" />
                <ContactLine icon={MessageCircle} text="Book a product demo" />
                <ContactLine icon={MapPin} text="Serving communities across India" />
              </div>
            </div>

            <form className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-ivory-100)] p-6 shadow-sm sm:p-8" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your name" placeholder="Enter your name" />
                <Field label="Email address" placeholder="you@example.com" type="email" />
              </div>
              <div className="mt-4"><Field label="Society name" placeholder="Enter your society name" /></div>
              <div className="mt-4"><label className="text-xs font-semibold text-[var(--color-ink-800)]">How can we help?</label><textarea rows={5} placeholder="Tell us what you need..." className="mt-2 w-full resize-none rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none placeholder:text-[var(--color-ink-400)] focus:border-[var(--color-teal-600)]" /></div>
              <button type="submit" className="mt-5 inline-flex h-11 items-center rounded-xl bg-[var(--color-forest-900)] px-5 text-sm font-bold text-white">Send message <ArrowRight className="ml-2 h-4 w-4" /></button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

function ContactLine({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return <div className="flex items-center gap-3 text-sm text-[var(--color-ink-600)]"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-teal-50)] text-[var(--color-teal-700)]"><Icon className="h-4 w-4" /></span>{text}</div>
}

function Field({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return <label className="block text-xs font-semibold text-[var(--color-ink-800)]">{label}<input type={type} placeholder={placeholder} className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-normal outline-none placeholder:text-[var(--color-ink-400)] focus:border-[var(--color-teal-600)]" /></label>
}
