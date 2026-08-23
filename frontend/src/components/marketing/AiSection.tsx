import { ArrowRight, Bot, CheckCircle2, MessageCircle } from 'lucide-react'

export function AiSection() {
  return (
    <section id="ai" className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-ivory-100)]">
      <div className="society-grid absolute inset-0 opacity-35" />
      <div className="absolute left-[-10%] top-1/3 h-72 w-72 rounded-full bg-[var(--color-teal-50)] blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-teal-700)]">SMARTER COMMUNITY SUPPORT</p>
            <h2 className="mt-3 max-w-[520px] text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-[var(--color-ink-950)] sm:text-5xl">
              Help residents get answers,
              <span className="block text-[var(--color-teal-700)]">without the waiting.</span>
            </h2>
            <p className="mt-5 max-w-[500px] text-sm leading-6 text-[var(--color-ink-500)]">
              SocietyOS AI helps residents find useful guidance for everyday community questions while keeping society information organized.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-[var(--color-forest-900)] p-4 shadow-[0_22px_60px_rgba(15,55,45,0.12)] sm:p-5">
            <div className="grid gap-4 sm:grid-cols-[0.7fr_1.3fr]">
              <div className="flex flex-col justify-between rounded-xl bg-[var(--color-forest-950)] p-6 text-white">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10"><Bot className="h-5 w-5 text-[var(--color-teal-200)]" /></div>
                  <h3 className="mt-8 text-2xl font-bold leading-tight">Your society knowledge,<span className="block text-[var(--color-teal-200)]">available when needed.</span></h3>
                </div>
                <div className="mt-8 space-y-2.5">
                  {['Society-specific questions', 'Guidance for everyday issues', 'Available whenever residents need help'].map((item) => (
                    <div key={item} className="flex gap-2 text-[10px] leading-4 text-white/65"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-teal-200)]" />{item}</div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white p-5">
                <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-teal-50)]"><Bot className="h-4 w-4 text-[var(--color-teal-700)]" /></div>
                  <div><p className="text-sm font-bold text-[var(--color-ink-950)]">SocietyOS AI</p><p className="text-[9px] text-[var(--color-ink-400)]">Smart community assistant</p></div>
                </div>
                <div className="mt-5 flex justify-end"><div className="max-w-[80%] rounded-xl rounded-br-sm bg-[var(--color-forest-900)] px-3.5 py-2.5 text-[10px] leading-4 text-white">There is water leaking from my bathroom pipe. What should I do?</div></div>
                <div className="mt-4 flex gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-teal-50)]"><Bot className="h-4 w-4 text-[var(--color-teal-700)]" /></div>
                  <div className="rounded-xl rounded-tl-sm bg-[var(--color-ivory-100)] p-3.5 text-[10px] leading-4 text-[var(--color-ink-600)]"><p className="font-semibold text-[var(--color-ink-950)]">SocietyOS AI</p><p className="mt-1">Turn off the nearby water supply if possible, contain the water, and raise a plumbing complaint through SocietyOS.</p></div>
                </div>
                <div className="mt-5 flex items-center gap-2 border-t border-[var(--color-border)] pt-3"><MessageCircle className="h-4 w-4 text-[var(--color-ink-400)]" /><span className="flex-1 text-[9px] text-[var(--color-ink-400)]">Ask about your society...</span><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-forest-900)]"><ArrowRight className="h-3.5 w-3.5 text-white" /></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
