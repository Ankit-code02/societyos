import { Check } from 'lucide-react'

const plans = [
  { name: 'Starter', price: '₹2,999', description: 'For smaller communities getting started.', features: ['Resident management', 'Complaints & maintenance', 'Announcements', 'Meetings & events'], featured: false },
  { name: 'Community', price: '₹5,999', description: 'For growing societies that need more control.', features: ['Everything in Starter', 'Payments & dues', 'Admin tools & roles', 'Notifications', 'AI Help Assistant'], featured: true },
  { name: 'Custom', price: 'Let’s talk', description: 'For larger communities with specific needs.', features: ['Custom onboarding', 'Advanced admin workflows', 'Priority support', 'Tailored integrations'], featured: false },
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden border-t border-[var(--color-border)] bg-white">
      <div className="society-dots absolute left-0 top-0 h-full w-1/3 opacity-25" />
      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-teal-700)]">SIMPLE PRICING</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.045em] text-[var(--color-ink-950)] sm:text-5xl">Simple for societies. Powerful as you grow.</h2>
          <p className="mt-4 text-sm leading-6 text-[var(--color-ink-500)]">Choose the plan that fits your community today. Upgrade when you need more.</p>
        </div>

        <div className="mx-auto mt-9 grid max-w-[1120px] gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className={`relative rounded-2xl border p-6 ${plan.featured ? 'border-[var(--color-forest-900)] bg-[var(--color-forest-900)] text-white shadow-[0_22px_55px_rgba(15,55,45,0.18)]' : 'border-[var(--color-border)] bg-white'}`}>
              {plan.featured && <span className="absolute right-5 top-5 rounded-full bg-[var(--color-teal-200)] px-2.5 py-1 text-[9px] font-bold text-[var(--color-forest-950)]">MOST POPULAR</span>}
              <p className={`text-xs font-bold ${plan.featured ? 'text-[var(--color-teal-200)]' : 'text-[var(--color-teal-700)]'}`}>{plan.name}</p>
              <p className="mt-5 text-3xl font-bold tracking-[-0.04em]">{plan.price}</p>
              {plan.price !== 'Let’s talk' && <p className={`mt-1 text-[9px] ${plan.featured ? 'text-white/50' : 'text-[var(--color-ink-400)]'}`}>per month</p>}
              <p className={`mt-4 text-xs leading-5 ${plan.featured ? 'text-white/65' : 'text-[var(--color-ink-500)]'}`}>{plan.description}</p>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => <div key={feature} className={`flex items-start gap-2 text-[10px] ${plan.featured ? 'text-white/75' : 'text-[var(--color-ink-600)]'}`}><Check className={`mt-0.5 h-3 w-3 shrink-0 ${plan.featured ? 'text-[var(--color-teal-200)]' : 'text-[var(--color-teal-700)]'}`} />{feature}</div>)}
              </div>
              <a href={plan.name === 'Custom' ? '#contact' : '/signup'} className={`mt-7 flex h-10 items-center justify-center rounded-xl text-xs font-bold ${plan.featured ? 'bg-white text-[var(--color-forest-950)]' : 'bg-[var(--color-forest-900)] text-white'}`}>
                {plan.name === 'Custom' ? 'Talk to us' : 'Get started'}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
