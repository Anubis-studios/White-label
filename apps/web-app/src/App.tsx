import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Link, NavLink, Route, Routes } from 'react-router';
import { redactAnalyticsUrl } from './utils/analyticsPrivacy';
import { Analytics } from '@vercel/analytics/react';
import { Icon } from './components/ui/Icon';
import { toIndexableRoutePath } from './utils/seo';

const InformationPage = lazy(() => import('./pages/InformationPage'));
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const SharedSelection = lazy(() => import('./pages/SharedSelection'));
const SkillDetail = lazy(() => import('./pages/SkillDetail'));
const Workbench = lazy(() => import('./pages/Workbench'));
const Plugins = lazy(() => import('./pages/Plugins'));
const Docs = lazy(() => import('./pages/Docs'));
const TopicLanding = lazy(() => import('./pages/TopicLanding'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CatalogRouteProvider = lazy(() => import('./context/CatalogRouteProvider'));

function App(): React.ReactElement {
  const logoSrc = `${import.meta.env.BASE_URL}aas-wordmark.png`;

  return (
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <div className="app-shell min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)]">
        <header className="app-header">
          <div className="app-header__inner">
            <Link to="/" className="brand-link" aria-label="Agentic Awesome Skills home">
              <img
                src={logoSrc}
                alt="AAS"
                className="brand-link__logo"
              />
              <span className="brand-link__name">
                Agentic Awesome Skills
              </span>
            </Link>

            <nav className="app-nav" aria-label="Primary navigation">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `app-nav__link ${isActive ? 'is-active' : ''}`}
              >
                Home
              </NavLink>
              <NavLink
                to={toIndexableRoutePath('/core')}
                className={({ isActive }) => `app-nav__link ${isActive ? 'is-active' : ''}`}
              >
                Catalog
              </NavLink>
              <NavLink
                to={toIndexableRoutePath('/workbench')}
                className={({ isActive }) => `app-nav__link ${isActive ? 'is-active' : ''}`}
              >
                Workbench
              </NavLink>
              <NavLink
                to={toIndexableRoutePath('/plugins')}
                className={({ isActive }) => `app-nav__link ${isActive ? 'is-active' : ''}`}
              >
                Plugins
              </NavLink>
              <NavLink to="/teams/" className={({ isActive }) => `app-nav__link ${isActive ? 'is-active' : ''}`}>For teams</NavLink>
              <NavLink to="/docs/" className={({ isActive }) => `app-nav__link ${isActive ? 'is-active' : ''}`}>
                Docs
              </NavLink>
            </nav>

            <div className="app-header__actions">
              <a
                href="https://github.com/sickn33/agentic-awesome-skills"
                target="_blank"
                rel="noreferrer"
                className="github-link"
              >
                <Icon name="github" size={19} weight="fill" />
                <span>View on GitHub</span>
              </a>

              <details className="mobile-nav">
                <summary aria-label="Open navigation">Menu</summary>
                <nav aria-label="Mobile navigation">
                  <Link to="/">Home</Link>
                  <Link to={toIndexableRoutePath('/core')}>Catalog</Link>
                  <Link to={toIndexableRoutePath('/workbench')}>Workbench</Link>
                  <Link to={toIndexableRoutePath('/plugins')}>Plugins</Link>
                  <Link to="/teams/">For teams</Link>
                  <Link to="/docs/">Docs</Link>
                  <a href="https://github.com/sickn33/agentic-awesome-skills" target="_blank" rel="noreferrer">View on GitHub</a>
                </nav>
              </details>
            </div>
          </div>
        </header>

        <main className="app-main">
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--text-muted)]">
                Loading...
              </div>
            }
          >
            <Routes>
              <Route element={<CatalogRouteProvider />}>
                <Route path="/" element={<Landing />} />
                <Route path="/core" element={<Home />} />
                <Route path="/share" element={<SharedSelection />} />
                <Route path="/topics/:slug" element={<TopicLanding />} />
                <Route path="/skill/:id" element={<SkillDetail />} />
              </Route>
              <Route path="/teams" element={<InformationPage />} />
              <Route path="/trust" element={<InformationPage />} />
              <Route path="/plugins" element={<Plugins />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/docs/:slug" element={<Docs />} />
              <Route path="/workbench" element={<Workbench />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="app-footer">
          <p>Independent, community-curated project. Review skills before use.</p>
          <nav aria-label="Footer navigation">
            <Link to="/docs/">Documentation</Link>
            <Link to="/teams/">For teams</Link>
            <Link to="/trust/">Trust & transparency</Link>
            <a href="https://github.com/sickn33/agentic-awesome-skills/blob/main/PRIVACY.md">Privacy</a>
            <a href="https://github.com/sickn33/agentic-awesome-skills/blob/main/TERMS.md">Terms</a>
            <a href="https://github.com/sickn33/agentic-awesome-skills/blob/main/SECURITY.md">Security</a>
            <a href="https://github.com/sickn33/agentic-awesome-skills#contributing" target="_blank" rel="noreferrer">Contributing</a>
            <a href="https://github.com/sickn33/agentic-awesome-skills/blob/main/LICENSE" target="_blank" rel="noreferrer">License</a>
            <a href="https://github.com/sickn33/agentic-awesome-skills/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noreferrer">Code of Conduct</a>
          </nav>
        </footer>
      </div>
      <Analytics beforeSend={(event) => ({ ...event, url: redactAnalyticsUrl(event.url) })} />
    </Router>
  );
}

export default App;
