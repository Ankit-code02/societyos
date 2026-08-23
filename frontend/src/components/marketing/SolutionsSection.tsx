import { ArrowRight, Check, Laptop, Smartphone, Tablet } from 'lucide-react'
import type { ReactNode } from 'react'

export function SolutionsSection() {
  return (
    <section id="solutions" className="relative overflow-hidden border-t border-[var(--color-border)] bg-white">
      <div className="absolute left-[-8%] top-20 h-80 w-80 rounded-full bg-[#edf8f4] blur-3xl" />
      <div className="society-dots absolute right-0 top-0 h-full w-1/3 opacity-30" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-teal-700)]">BUILT FOR EVERYONE</p>
            <h2 className="mt-3 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-[var(--color-ink-950)] sm:text-5xl">
              One platform.
              <span className="block text-[var(--color-teal-700)]">Different needs.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[var(--color-ink-500)] sm:text-right">
            SocietyOS adapts to the needs of every user, residents, admins and management committees.
          </p>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          <PersonaCard id="residents" title="For Residents" text="Everything you need, without the confusion." bullets={['Raise & track complaints', 'Stay updated with announcements', 'View meetings & events', 'Check maintenance dues', 'Get instant answers with AI']} cta="Explore resident features" variant="resident" illustration={<ResidentIllustration />} />
          <PersonaCard id="admins" title="For Admins" text="Powerful tools to manage your society." bullets={['Manage residents & roles', 'Handle complaints efficiently', 'Create announcements', 'Schedule meetings', 'Manage maintenance & dues']} cta="Explore admin features" variant="admin" illustration={<AdminIllustration />} />
          <PersonaCard id="committees" title="For Committees" text="Everything you need to keep things running." bullets={['Monitor society activities', 'Track payments & dues', 'Generate reports', 'Ensure transparency']} cta="Explore committee features" variant="committee" illustration={<CommitteeIllustration />} />
        </div>
      </div>
    </section>
  )
}

function PersonaCard({ id, title, text, bullets, cta, illustration, variant }: { id: string; title: string; text: string; bullets: string[]; cta: string; illustration: ReactNode; variant: 'resident' | 'admin' | 'committee'; }) {
  const bg = variant === 'resident' ? 'bg-[#edf8f4]' : variant === 'admin' ? 'bg-[#fff5ea]' : 'bg-[#eef4fb]'
  return (
    <article id={id} className={`relative min-h-[390px] overflow-hidden rounded-2xl border border-[var(--color-border)] ${bg} p-6 shadow-sm`}>
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border-[18px] border-white/30" />
      <div className="relative z-10 max-w-[245px]">
        <p className="text-xs font-bold text-[var(--color-ink-950)]">{title}</p>
        <p className="mt-2 text-sm leading-5 text-[var(--color-ink-600)]">{text}</p>
        <div className="mt-5 space-y-2.5">
          {bullets.map((item) => (
            <div key={item} className="flex items-start gap-2 text-[10px] leading-4 text-[var(--color-ink-700)]">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-teal-700)]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <a href="#contact" className="mt-6 inline-flex items-center rounded-lg bg-[var(--color-forest-900)] px-3.5 py-2.5 text-[10px] font-bold text-white">
          {cta}
          <ArrowRight className="ml-1.5 h-3 w-3" />
        </a>
      </div>
      <div className="absolute bottom-0 right-0 h-[250px] w-[220px]">{illustration}</div>
    </article>
  )
}

function ResidentIllustration() {
  return (
    <div className="absolute bottom-0 right-2 h-full w-full">
      <div className="absolute bottom-0 right-5 h-[190px] w-[132px] rounded-t-[70px] bg-[#2b8a72]" />
      <div className="absolute bottom-[157px] right-[45px] h-[78px] w-[78px] rounded-[46%] bg-[#f2b18b]" />
      <div className="absolute bottom-[202px] right-[38px] h-[50px] w-[92px] rounded-[48%_48%_35%_35%] bg-[#202b29]" />
      <div className="absolute bottom-[120px] right-[10px] h-[120px] w-[66px] rotate-[10deg] rounded-2xl border-4 border-[#102f27] bg-white p-1.5 shadow-lg">
        <div className="h-full rounded-xl bg-[var(--color-ivory-100)] p-2"><div className="h-2 rounded bg-[var(--color-teal-100)]" /><div className="mt-3 h-2 w-4/5 rounded bg-white" /><div className="mt-1 h-2 w-3/5 rounded bg-white" /></div>
      </div>
      <div className="absolute bottom-[78px] right-[88px] h-16 w-10 rotate-[-20deg] rounded-full bg-[#f2b18b]" />
      <div className="absolute bottom-0 right-0 h-4 w-[170px] rounded-full bg-[#d9e8e1]" />
      <Smartphone className="absolute bottom-1 right-1 h-5 w-5 text-[#d5e4de]" />
    </div>
  )
}

function AdminIllustration() {
  return (
    <div className="absolute bottom-0 right-0 h-full w-full">
      <div className="absolute bottom-0 right-8 h-[185px] w-[138px] rounded-t-[75px] bg-[#1f806b]" />
      <div className="absolute bottom-[153px] right-[50px] h-[78px] w-[78px] rounded-[48%] bg-[#f0b18a]" />
      <div className="absolute bottom-[202px] right-[43px] h-[48px] w-[92px] rounded-[48%_48%_35%_35%] bg-[#172d2a]" />
      <div className="absolute bottom-[106px] right-[2px] h-[108px] w-[152px] rounded-xl border-4 border-[#1b3932] bg-[#d7e0de] p-2 shadow-lg">
        <div className="h-full rounded-lg bg-white p-2"><div className="h-2 w-3/4 rounded bg-[var(--color-teal-100)]" /><div className="mt-3 grid grid-cols-3 gap-1"><span className="h-10 rounded bg-[#eef6f3]" /><span className="h-10 rounded bg-[#fff2df]" /><span className="h-10 rounded bg-[#eef2f8]" /></div></div>
      </div>
      <div className="absolute bottom-[75px] right-[103px] h-12 w-9 rotate-[-25deg] rounded-full bg-[#f0b18a]" />
      <Laptop className="absolute bottom-[86px] right-[62px] h-8 w-8 text-[#6a7773]" />
    </div>
  )
}

function CommitteeIllustration() {
  return (
    <div className="absolute bottom-0 right-0 h-full w-full">
      <div className="absolute bottom-0 right-7 h-[192px] w-[132px] rounded-t-[75px] bg-[#176c5b]" />
      <div className="absolute bottom-[157px] right-[50px] h-[78px] w-[78px] rounded-[48%] bg-[#f0b28d]" />
      <div className="absolute bottom-[203px] right-[43px] h-[49px] w-[92px] rounded-[50%_50%_35%_35%] bg-[#1b2e2b]" />
      <div className="absolute bottom-[82px] right-[5px] h-[122px] w-[86px] rotate-[6deg] rounded-xl border-4 border-[#173e35] bg-white p-2 shadow-lg">
        <div className="h-full rounded-lg bg-[var(--color-ivory-100)] p-2"><div className="flex gap-1"><span className="h-2 w-2 rounded-full bg-[var(--color-teal-600)]" /><span className="h-2 w-10 rounded bg-[var(--color-teal-100)]" /></div><div className="mt-3 h-12 rounded bg-white"><div className="h-8 w-8 rounded-full border-4 border-[var(--color-teal-600)] border-r-transparent" /></div></div>
      </div>
      <div className="absolute bottom-[88px] right-[101px] h-12 w-9 rotate-[-20deg] rounded-full bg-[#f0b28d]" />
      <Tablet className="absolute bottom-[103px] right-[31px] h-7 w-7 text-[#6a7773]" />
    </div>
  )
}
