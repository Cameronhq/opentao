/** @jsxImportSource preact */
import { useEffect, useRef, useState } from 'preact/hooks';

// Pagefind is loaded dynamically at runtime — types are loose because it's an external static asset
type PagefindResult = {
  id: string;
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta: { title: string };
  }>;
};

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ url: string; title: string; excerpt: string }>>([]);
  const [loading, setLoading] = useState(false);
  const pagefindRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open on ⌘K / Ctrl-K; close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  // Lazy-load Pagefind on first open
  useEffect(() => {
    if (!open || pagefindRef.current) return;
    (async () => {
      try {
        // Pagefind is generated at /pagefind/pagefind.js during `pagefind --site dist`
        // @ts-ignore — dynamic external module
        const pf = await import(/* @vite-ignore */ '/pagefind/pagefind.js');
        await pf.options({ excerptLength: 30 });
        pagefindRef.current = pf;
      } catch (err) {
        console.warn('[search] Pagefind unavailable — run `bun run build` to generate the index.', err);
      }
    })();
  }, [open]);

  // Run search when query changes
  useEffect(() => {
    if (!query || !pagefindRef.current) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const search = await pagefindRef.current.search(query);
      const top = await Promise.all(search.results.slice(0, 8).map((r: PagefindResult) => r.data()));
      if (cancelled) return;
      setResults(top.map((d: any) => ({ url: d.url, title: d.meta?.title || d.url, excerpt: d.excerpt })));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        class="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] flex items-center gap-1.5 px-2 py-1 rounded border hairline"
        aria-label="Open search"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
        <span class="hidden sm:inline text-xs">Search</span>
        <kbd class="hidden sm:inline font-mono text-[10px] text-[color:var(--color-fg-dim)] border hairline rounded px-1">⌘K</kbd>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        class="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] flex items-center gap-1.5 px-2 py-1 rounded border hairline"
        aria-label="Open search"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
        <span class="hidden sm:inline text-xs">Search</span>
        <kbd class="hidden sm:inline font-mono text-[10px] text-[color:var(--color-fg-dim)] border hairline rounded px-1">⌘K</kbd>
      </button>

      <div
        class="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      >
        <div
          class="w-full max-w-[640px] bg-white border hairline-strong rounded-lg shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="flex items-center gap-3 px-5 py-4 border-b hairline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-[color:var(--color-fg-dim)]">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
              placeholder="Search every page, concept, subnet, playbook, idea…"
              class="flex-1 bg-transparent outline-none text-[color:var(--color-fg)] placeholder-[color:var(--color-fg-dim)] text-base"
            />
            <kbd class="font-mono text-[10px] text-[color:var(--color-fg-dim)] border hairline rounded px-1.5 py-0.5">Esc</kbd>
          </div>

          <div class="max-h-[60vh] overflow-y-auto">
            {!query && (
              <div class="px-5 py-10 text-center text-sm text-[color:var(--color-fg-dim)]">
                Type to search across all 73 pages. Powered by Pagefind.
              </div>
            )}
            {query && loading && (
              <div class="px-5 py-10 text-center text-sm text-[color:var(--color-fg-dim)] font-mono">searching…</div>
            )}
            {query && !loading && results.length === 0 && (
              <div class="px-5 py-10 text-center text-sm text-[color:var(--color-fg-dim)]">
                No matches for "<span class="text-[color:var(--color-fg)]">{query}</span>". Try a shorter term.
              </div>
            )}
            {results.map((r) => (
              <a
                key={r.url}
                href={r.url}
                class="block px-5 py-4 border-b hairline last:border-b-0 hover:bg-[color:var(--color-surface)] group"
              >
                <div class="text-sm font-medium text-[color:var(--color-fg)] group-hover:text-[color:var(--color-accent)]">{r.title}</div>
                <div
                  class="text-xs text-[color:var(--color-fg-muted)] mt-1 leading-relaxed line-clamp-2"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Pagefind returns sanitized highlighted HTML
                  dangerouslySetInnerHTML={{ __html: r.excerpt }}
                />
                <div class="text-[10px] font-mono text-[color:var(--color-fg-dim)] mt-1">{r.url}</div>
              </a>
            ))}
          </div>

          <div class="px-5 py-2.5 border-t hairline bg-[color:var(--color-surface)] flex items-center justify-between text-[10px] font-mono text-[color:var(--color-fg-dim)]">
            <span>↵ open · esc close</span>
            <span>Pagefind</span>
          </div>
        </div>
      </div>
    </>
  );
}
