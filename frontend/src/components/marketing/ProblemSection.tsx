import {
  FileSpreadsheet,
  MessageCircle,
  Phone,
  ClipboardX,
  ArrowDown,
  Check,
} from 'lucide-react'

const problems = [
  {
    icon: MessageCircle,
    title: 'WhatsApp groups',
    description: 'Important notices disappear between hundreds of messages.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Excel sheets',
    description: 'Resident, payment and maintenance information lives in scattered files.',
  },
  {
    icon: Phone,
    title: 'Phone calls',
    description: 'Issues are discussed, but there is often no proper record or follow-up.',
  },
  {
    icon: ClipboardX,
    title: 'Manual complaints',
    description: 'Residents have no clear way to track what happened after raising an issue.',
  },
]

export function ProblemSection() {
  return (
    <section
      id="problems"
      className="scroll-mt-24 border-t border-[var(--color-border)] bg-[var(--color-forest-950)] text-white"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

        {/* Heading */}
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-teal-100)]">
              THE OLD WAY
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Your society shouldn't run on
              <span className="block text-[var(--color-teal-200)]">
                WhatsApp and spreadsheets.
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-white/65 lg:justify-self-end lg:text-lg lg:leading-8">
            Everyday society operations are still spread across chat groups,
            phone calls, spreadsheets and paper notices. SocietyOS brings them
            together into one connected place.
          </p>
        </div>

        {/* Problems */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem) => {
            const Icon = problem.icon

            return (
              <article
                key={problem.title}
                className="group rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[var(--color-teal-200)]">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-8 text-xl font-semibold">
                  {problem.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/60">
                  {problem.description}
                </p>
              </article>
            )
          })}
        </div>

        {/* Transition */}
        <div className="mt-14 flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5">
            <ArrowDown className="h-4 w-4 text-[var(--color-teal-200)]" />
          </div>

          <p className="mt-5 text-sm font-medium text-white/50">
            There is a better way.
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-full border border-[var(--color-teal-200)]/20 bg-[var(--color-teal-200)]/10 px-4 py-2 text-sm text-[var(--color-teal-100)]">
            <Check className="h-4 w-4" />
            One connected community platform
          </div>
        </div>

      </div>
    </section>
  )
}