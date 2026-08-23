import { ArrowRight, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../components/auth/AuthProvider'

const navigation = [
  ['#features', 'Features'],
  ['#residents', 'For Residents'],
  ['#admins', 'For Admins'],
  ['#pricing', 'Pricing'],
  ['#about', 'About'],
  ['#contact', 'Contact'],
]

export function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-white text-[var(--color-ink-950)]">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[70px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-forest-900)] text-sm text-white">♙</div>
            <span className="text-lg font-bold tracking-tight text-[var(--color-ink-950)]">SocietyOS</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-7 lg:flex">
            {navigation.map(([href, label]) => (
              <a key={`${href}-${label}`} href={href} className="text-xs font-semibold text-[var(--color-ink-700)] transition hover:text-[var(--color-teal-700)]">{label}</a>
            ))}
          </nav>

          <div className="ml-8 hidden items-center gap-2 lg:flex">
            {!loading && user ? (
              <>
                <Link
                  to="/account"
                  className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-xs font-bold text-[var(--color-ink-950)] transition hover:bg-[var(--color-ivory-100)]"
                >
                  Account
                </Link>

                <Link
                  to="/account/profile"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-forest-900)] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--color-forest-800)]"
                >
                  <User className="h-3.5 w-3.5" />
                  {user.firstName || 'Profile'}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-xs font-bold text-[var(--color-ink-950)] transition hover:bg-[var(--color-ivory-100)]"
                >
                  Sign in
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center rounded-lg bg-[var(--color-forest-900)] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--color-forest-800)]"
                >
                  Get started
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>

          <button type="button" onClick={() => setMobileOpen((value) => !value)} className="ml-auto rounded-lg p-2 lg:hidden" aria-label="Toggle navigation">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-[var(--color-border)] bg-white px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navigation.map(([href, label]) => (
                <a key={`${href}-${label}`} href={href} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-[var(--color-ink-700)] hover:bg-[var(--color-ivory-100)]">{label}</a>
              ))}
              <div className="my-1 h-px bg-[var(--color-border)]" />

              {!loading && user ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-bold"
                  >
                    Account
                  </Link>

                  <Link
                    to="/account/profile"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-[var(--color-forest-900)] px-3 py-3 text-center text-sm font-bold text-white"
                  >
                    My Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-bold"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-[var(--color-forest-900)] px-3 py-3 text-center text-sm font-bold text-white"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-forest-950)] text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-10">
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.7fr_0.7fr_0.7fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">♙</div><span className="text-lg font-bold">SocietyOS</span></div>
              <p className="mt-4 max-w-xs text-xs leading-5 text-white/55">Simple, transparent and smart society management for modern communities.</p>
            </div>
            <FooterColumn title="Product" items={['Features', 'For Residents', 'For Admins', 'Pricing']} />
            <FooterColumn title="Company" items={['About Us', 'Contact Us']} />
            <FooterColumn title="Support" items={['Help Center', 'FAQs', 'Book a Demo']} />
            <div className="rounded-xl border border-white/10 bg-white/5 p-5"><p className="text-sm font-bold">Stay in the loop</p><p className="mt-2 text-xs leading-5 text-white/50">Get updates and tips on managing your society efficiently.</p><div className="mt-4 flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2.5"><span className="flex-1 text-[10px] text-white/35">Enter your email</span><ArrowRight className="h-3.5 w-3.5 text-[var(--color-teal-200)]" /></div></div>
          </div>
          <div className="mt-9 border-t border-white/10 pt-5 text-[10px] text-white/35">© 2026 SocietyOS. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return <div><p className="text-xs font-bold">{title}</p><div className="mt-4 flex flex-col gap-2.5">{items.map((item) => <a key={item} href={item === 'For Residents' ? '#residents' : item === 'For Admins' ? '#admins' : item === 'Pricing' ? '#pricing' : item === 'About Us' ? '#about' : item === 'Contact Us' || item === 'Book a Demo' ? '#contact' : '#features'} className="text-[10px] text-white/50 transition hover:text-white">{item}</a>)}</div></div>
}
