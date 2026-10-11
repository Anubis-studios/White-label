import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const guides = [
  { name: 'Codex', slug: 'codex-cli-skills' },
  { name: 'Claude Code', slug: 'claude-code-skills' },
  { name: 'Cursor', slug: 'cursor-skills' },
  { name: 'Gemini CLI', slug: 'gemini-cli-skills' },
] as const;

export function LandingDiscovery(): React.ReactElement {
  const [query, setQuery] = useState('');
  const [guide, setGuide] = useState<string>(guides[0].slug);
  const navigate = useNavigate();

  return (
    <div className="landing-discovery">
      <form role="search" aria-label="Find a skill" onSubmit={(event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set('q', query.trim());
        navigate(`/core/${params.size ? `?${params}` : ''}`);
      }}>
        <label htmlFor="landing-search">What do you want to build or improve?</label>
        <div className="landing-discovery__search">
          <input id="landing-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills, tools, or frameworks" maxLength={200} />
          <button type="submit" className="landing-cta landing-cta--primary">Find skills</button>
        </div>
      </form>
      <nav className="landing-discovery__shortcuts" aria-label="Explore by goal">
        <Link to="/core/?category=web-development">Build a website</Link>
        <Link to="/core/?category=security">Review security</Link>
        <Link to="/core/?category=automation">Automate a task</Link>
      </nav>
      <div className="landing-discovery__guide">
        <label htmlFor="landing-agent">Using</label>
        <select id="landing-agent" value={guide} onChange={(event) => setGuide(event.target.value)}>
          {guides.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
        <Link to={`/docs/${guide}/`}>Open setup guide →</Link>
      </div>
      <p>Explore skills, compare your shortlist, then copy a brief for your agent.</p>
    </div>
  );
}
