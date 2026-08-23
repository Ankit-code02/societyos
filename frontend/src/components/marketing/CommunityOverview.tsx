import {
  BellRing,
  Building2,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
  Check,
} from 'lucide-react'

const areas = [
  {
    icon: Building2,
    eyebrow: 'MANAGE',
    title: 'Everything about your society.',
    description:
      'Keep buildings, units, residents, maintenance and everyday operations organized from one place.',
    items: [
      'Society and unit information',
      'Maintenance and payments',
      'Meetings and notices',
    ],
    accent: 'bg-[var(--color-teal-100)] text-[var(--color-teal-600)]',
  },
  {
    icon: MessageCircle,
    eyebrow: 'CONNECT',
    title: 'Communication without the chaos.',
    description:
      'Give residents a proper place to raise issues, share updates and stay connected with their community.',
    items: [
      'Complaints and helpdesk',
      'Community updates',
      'Resident communication',
    ],
    accent: 'bg-[var(--color-apricot-100)] text-[var(--color-warning)]',
  },
  {
    icon: BellRing,
    eyebrow: 'STAY INFORMED',
    title: 'Know what is happening.',
    description:
      'Important community information should not disappear inside chat groups or get lost in spreadsheets.',
    items: [
      'Announcements',
      'Meeting reminders',
      'Maintenance notifications',
    ],
    accent: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
  },
  {
    icon: Sparkles,
    eyebrow: 'ASSIST',
    title: 'A smarter community experience.',
    description:
      'SocietyOS AI helps residents find answers and understand what to do next when they need help.',
    items: [
      'AI-powered assistance',
      'Society-specific questions',
      'Guidance for everyday issues',
    ],
    accent: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  },
]

export function CommunityOverview() {
  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-ivory-100)]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Section heading */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-teal-600)]">
              ONE CONNECTED PLATFORM
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[var(--color-forest-950)] sm:text-5xl">
              Everything your community needs.
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-[var(--color-ink-500)] lg:justify-self-end lg:text-lg lg:leading-8">
            SocietyOS brings the everyday parts of community living together,
            so residents know where to go and administrators know what needs
            attention.
          </p>
        </div>

        {/* Feature composition */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {areas.map((area, index) => {
            const Icon = area.icon
            const isLarge = index === 0

            return (
              <article
                key={area.title}
                className={[
                  'group relative overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(18,60,50,0.08)] sm:p-8',
                  index === 0
                    ? 'bg-white md:row-span-2'
                    : index === 1
                      ? 'bg-[var(--color-teal-50)]'
                      : index === 2
                        ? 'bg-[var(--color-apricot-50)]'
                        : 'bg-[var(--color-forest-900)] md:col-span-2',
                ].join(' ')}
              >
                {/* Decorative shape */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[var(--color-teal-100)]/50 blur-3xl transition-transform duration-500 group-hover:scale-125"
                />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${area.accent}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowUpRight
                      className={[
                        'h-5 w-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
                        index === 3
                          ? 'text-white/60 group-hover:text-white'
                          : 'text-[var(--color-ink-300)] group-hover:text-[var(--color-forest-900)]',
                      ].join(' ')}
                    />
                  </div>

                  <div className="mt-10">
                    <p
                      className={[
                        'text-[10px] font-bold tracking-[0.18em]',
                        index === 3
                          ? 'text-white/60'
                          : 'text-[var(--color-ink-400)]',
                      ].join(' ')}
                    >
                      {area.eyebrow}
                    </p>

                    <h3
                      className={[
                        'mt-2 font-bold leading-tight tracking-[-0.025em]',
                        index === 3
                          ? 'text-white'
                          : 'text-[var(--color-ink-950)]',
                        isLarge ? 'text-3xl sm:text-4xl' : 'text-2xl',
                      ].join(' ')}
                    >
                      {area.title}
                    </h3>

                    <p
                      className={[
                        'mt-4 max-w-2xl text-sm leading-6 sm:text-base sm:leading-7',
                        index === 3
                          ? 'text-white/70'
                          : 'text-[var(--color-ink-500)]',
                      ].join(' ')}
                    >
                      {area.description}
                    </p>
                  </div>

                  <div className="mt-8 space-y-3">
                    {area.items.map((item) => (
                      <div
                        key={item}
                        className={[
                          'flex items-center gap-2.5 text-sm',
                          index === 3
                            ? 'text-white/80'
                            : 'text-[var(--color-ink-700)]',
                        ].join(' ')}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white">
                          <Check className="h-3 w-3 text-[var(--color-success)]" />
                        </span>

                        {item}
                      </div>
                    ))}
                  </div>

                  {isLarge && (
                    <div className="mt-auto pt-10">
                      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[var(--color-teal-100)] text-[10px] font-bold text-[var(--color-forest-900)]">
                              AM
                            </span>

                            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[var(--color-apricot-100)] text-[10px] font-bold text-[var(--color-warning)]">
                              RK
                            </span>

                            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[var(--color-success-bg)] text-[10px] font-bold text-[var(--color-success)]">
                              PS
                            </span>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-[var(--color-ink-950)]">
                              One community workspace
                            </p>

                            <p className="text-[10px] text-[var(--color-ink-500)]">
                              Residents and administrators, together.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}