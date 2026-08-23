import '../../components/marketing/marketing.css'
import { HeroSection } from '../../components/marketing/HeroSection'
import { ProductShowcase } from '../../components/marketing/ProductShowcase'
import { SolutionsSection } from '../../components/marketing/SolutionsSection'
import { AiSection } from '../../components/marketing/AiSection'
import { PricingSection } from '../../components/marketing/PricingSection'
import { AboutContactSection } from '../../components/marketing/AboutContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductShowcase />
      <SolutionsSection />
      <AiSection />
      <PricingSection />
      <AboutContactSection />

      <section className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-ivory-100)]">
        <div className="society-grid absolute inset-0 opacity-40" />
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
          <div className="relative flex flex-col gap-5 overflow-hidden rounded-2xl bg-[var(--color-forest-900)] px-5 py-6 text-white shadow-[0_18px_50px_rgba(15,55,45,0.12)] sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[var(--color-teal-600)]/20 blur-2xl" />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                ⌂
              </div>
              <div>
                <p className="text-sm font-bold">
                  Ready to simplify your society management?
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Join communities already using SocietyOS.
                </p>
              </div>
            </div>

            <a
              href="/signup"
              className="relative inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-xs font-bold text-[var(--color-forest-950)] transition hover:-translate-y-0.5 hover:bg-[var(--color-teal-50)]"
            >
              Get started for free
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
