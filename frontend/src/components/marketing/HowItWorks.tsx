import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Users,
} from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Building2,
    title: 'Set up your society',
    description:
      'Create your society, add buildings and units, and configure the basic information your community needs.',
    points: [
      'Create society profile',
      'Add buildings and units',
      'Configure society details',
    ],
  },
  {
    number: '02',
    icon: Users,
    title: 'Bring residents together',
    description:
      'Invite residents and administrators into one secure community workspace instead of managing scattered groups and spreadsheets.',
    points: [
      'Invite residents',
      'Assign roles and units',
      'Keep resident information organized',
    ],
  },
  {
    number: '03',
    icon: ClipboardCheck,
    title: 'Run everyday operations',
    description:
      'Handle complaints, meetings, notices, maintenance and payments from one connected platform.',
    points: [
      'Track complaints',
      'Manage meetings and notices',
      'Handle maintenance and payments',
    ],
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-[var(--color-border)] bg-[var(--color-forest-950)] text-white"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">

        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-teal-200)]">
              HOW IT WORKS
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              From setup to everyday
              <span className="block text-[var(--color-teal-200)]">
                community management.
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-white/60 lg:justify-self-end lg:text-lg lg:leading-8">
            SocietyOS is designed to make the transition simple. Set up your
            community once, bring everyone together, and manage everyday
            operations from one place.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div
                key={step.number}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07] sm:p-8"
              >
                {/* Number */}
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-teal-200)]/10 text-[var(--color-teal-200)]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-sm font-bold tracking-[0.15em] text-white/25">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-10">
                  <h3 className="text-2xl font-bold tracking-[-0.025em]">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
                    {step.description}
                  </p>
                </div>

                {/* Points */}
                <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
                  {step.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-teal-200)]" />

                      <span className="text-sm text-white/65">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 translate-y-[-50%] items-center justify-center rounded-full border border-white/10 bg-[var(--color-forest-950)] lg:flex">
                    <ArrowRight className="h-4 w-4 text-[var(--color-teal-200)]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 rounded-[1.75rem] border border-[var(--color-teal-200)]/15 bg-[var(--color-teal-200)]/[0.06] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-lg font-semibold">
                One connected community workspace.
              </p>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                Residents know where to go. Administrators know what needs
                attention. Everyone works from the same information.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-[var(--color-teal-200)]">
              <CheckCircle2 className="h-5 w-5" />
              Built for real communities
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}