# Design Document — Guest/Unauthenticated User Experience

## Overview

This document describes the technical design for adding public-access pages and a "soft gate" experience to the BIKA frontend. No backend changes are needed; all required data comes from existing public API endpoints.

---

## Architecture

### Files Created

| File | Purpose |
|------|---------|
| `src/components/LoginPromptModal.jsx` | Reusable soft-gate modal overlay |
| `src/pages/LowonganPreviewPage.jsx` | Public lowongan preview at `/lowongan` |
| `src/pages/TutorialPreviewPage.jsx` | Public tutorial/quiz preview at `/tutorial` |
| `src/pages/OnboardingPage.jsx` | Value-proposition page at `/tentang` |

### Files Modified

| File | What Changes |
|------|-------------|
| `src/App.jsx` | Add `/lowongan`, `/tentang` routes to public `<Layout>` block; make `/tutorial` also public; update `LoginGuard` to handle `returnTo` |
| `src/pages/LoginPage.jsx` | Read `returnTo` query param, validate, navigate post-login; remove unused `hoveredFeature`/`stats` state |
| `src/pages/beranda.jsx` | Fix CTA link targets to new public routes |
| `src/components/BottomNav.jsx` | Conditionally render guest vs. authenticated nav items |

### Component Tree

```
<App>
  <AuthProvider>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          {/* Public — no auth required */}
          <Route element={<Layout />}>         ← existing public wrapper
            <Route path="/"       element={<Home />} />
            <Route path="/lowongan" element={<LowonganPreviewPage />} />   ← NEW
            <Route path="/tentang" element={<OnboardingPage />} />         ← NEW
            <Route path="/tutorial" element={<TutorialPreviewPage />} />   ← MOVED from protected
          </Route>

          {/* Protected */}
          <Route element={<UserRouteGuard />}>
            <Route path="/dashboard" ... />
            <Route path="/masa-depan" ... />
            {/* /tutorial removed from here */}
            ...
          </Route>

        </Routes>

        {/* LoginPromptModal is rendered inside each public page,
            NOT at router level — it opens/closes per-page state */}
      </BrowserRouter>
    </ThemeProvider>
  </AuthProvider>
</App>
```

`BottomNav` is rendered via `UserSidebar` → `Layout`, so it already appears on all Layout-wrapped routes including the new public ones.

---

## Components and Interfaces

---

### 2.1 `LoginPromptModal`

**File:** `src/components/LoginPromptModal.jsx`

#### Props Interface

```js
LoginPromptModal.propTypes = {
  reason:      PropTypes.string.isRequired, // 'apply_job' | 'full_tutorial' | 'start_quiz' | 'download_file'
  isOpen:      PropTypes.bool.isRequired,
  onClose:     PropTypes.func.isRequired,   // called when "Nanti saja" is clicked
  returnTo:    PropTypes.string,            // current path, forwarded to /login?returnTo=...
  jobId:       PropTypes.string,            // optional, forwarded as ?jobId=... when reason=apply_job
  triggerRef:  PropTypes.object,            // React ref of the element that opened the modal
                                            // focus returns here on close
}
```

#### Key State

```js
// No internal state needed beyond props.
// Focus trap managed via useEffect + DOM query on modal container ref.
```

#### Behavior

1. Renders only when `isOpen === true`; returns `null` otherwise.
2. On mount (when `isOpen` transitions to `true`):
   - Sets `document.body.style.overflow = 'hidden'` to prevent background scroll.
   - Moves focus to the first focusable element inside the modal (the "Login" button).
3. `Tab` / `Shift+Tab` cycles focus only among the three buttons inside the modal (focus trap).
4. Clicking the backdrop (not the card) calls `onClose`.
5. `Escape` key calls `onClose`.
6. On `onClose`:
   - Restores `document.body.style.overflow = 'unset'`.
   - Returns focus to `triggerRef.current` if provided.
7. Both primary buttons ("Login dengan Google", "Daftar Gratis") navigate to `/login` with query params built as:
   ```
   /login?returnTo=<returnTo>&jobId=<jobId>   // jobId omitted if undefined
   ```
8. Uses `useNavigate` (React Router) — does NOT use `window.location.href`.

#### reason → message Mapping

See Section 5 for the full table.

#### UI Description

- Full-screen semi-transparent backdrop: `bg-black/60 backdrop-blur-sm`, `fixed inset-0 z-[9999]`
- Centered card: `bg-white dark:bg-zinc-900`, `rounded-[32px]`, `max-w-sm w-full`, `p-8`, `shadow-2xl`
- Top icon: 64px circle with emoji or icon contextual to `reason` (🔐 default)
- Title: `text-xl font-black text-blue-950 dark:text-white`
- Message: `text-sm text-slate-500 dark:text-slate-400` (from reason mapping)
- Primary button "Login dengan Google": `bg-blue-600 text-white rounded-2xl py-3 w-full font-black`
- Secondary button "Daftar Gratis": `border border-slate-200 dark:border-zinc-700 rounded-2xl py-3 w-full font-bold text-slate-600 dark:text-slate-300`
- Dismiss link "Nanti saja": `text-sm text-slate-400 underline cursor-pointer text-center mt-2`

---

### 2.2 `LowonganPreviewPage`

**File:** `src/pages/LowonganPreviewPage.jsx`

#### Props Interface

None (route component).

#### Key State

```js
const [lowongans, setLowongans]         = useState([]);
const [loading, setLoading]             = useState(true);
const [search, setSearch]               = useState('');
const [filterTipe, setFilterTipe]       = useState('');
const [filterLokasi, setFilterLokasi]   = useState('');
const [filterMagang, setFilterMagang]   = useState('');
const [openFilter, setOpenFilter]       = useState(null);
const [selectedJob, setSelectedJob]     = useState(null);   // job detail modal
const [modalReason, setModalReason]     = useState(null);   // 'apply_job' | null
const [loginModalOpen, setLoginModalOpen] = useState(false);
const applyBtnRef = useRef(null);        // triggerRef passed to LoginPromptModal
```

#### Behavior

1. **Data fetch** — single `useEffect([], [])`:
   ```js
   useEffect(() => {
     setLoading(true);
     api.getContents('lowongan')
       .then(d => setLowongans(Array.isArray(d) ? d : []))
       .catch(() => setLowongans([]))
       .finally(() => setLoading(false));
   }, []);
   ```
2. **Filters** — same `useMemo` filter logic as `MasaDepanPage` (search, tipe, lokasi, magang). Reuse the `SearchableFilter` sub-component imported from `MasaDepanPage` or duplicated inline — **preferred: extract `SearchableFilter` to `src/components/SearchableFilter.jsx`** so both pages share it.
3. **Clicking a job card** — opens job detail modal (`setSelectedJob(job)`). Inside the modal, "Apply Now" button calls `setModalReason('apply_job'); setLoginModalOpen(true)`.
4. **Clicking "Lamar" / "Apply Now" directly on card** — same: opens modal.
5. **Sticky CTA banner** — fixed top banner (below any potential sidebar) with message and "Login untuk Melamar" button linking to `/login?returnTo=/lowongan`.
6. **Skeleton loading** — while `loading === true`, render 6× `<SkeletonCard />` in a grid instead of job cards.
7. **Empty state** — if `lowongans.length === 0 && !loading`, show empty-state UI.
8. Body scroll locked when `selectedJob` is open (same pattern as `MasaDepanPage`).

#### UI Description

- Same page structure as `MasaDepanPage`: background ornaments, centered header, search + filter bar, job grid.
- Header pill label: "Preview Lowongan" in blue.
- Sticky CTA banner: `fixed top-0` (or `sticky top-0`) gradient `from-blue-600 to-indigo-700` strip, text-white, `z-30`, with "Login untuk Melamar & Menyimpan Lowongan" and a white ghost button.
- Job cards: identical appearance to `MasaDepanPage` cards.
- "Apply Now" button inside card/modal triggers `LoginPromptModal` instead of navigating.

---

### 2.3 `TutorialPreviewPage`

**File:** `src/pages/TutorialPreviewPage.jsx`

#### Props Interface

None (route component).

#### Key State

```js
const [tutorials, setTutorials]           = useState([]);
const [quizzes, setQuizzes]               = useState([]);
const [loading, setLoading]               = useState(true);
const [activeTab, setActiveTab]           = useState('bank_kuis');
const [loginModalOpen, setLoginModalOpen] = useState(false);
const [loginModalReason, setLoginModalReason] = useState('full_tutorial');
const [selectedQuiz, setSelectedQuiz]     = useState(null);  // quiz detail modal
const triggerRef = useRef(null);
```

#### Behavior

1. **Data fetch** — single `useEffect([], [])`:
   ```js
   useEffect(() => {
     setLoading(true);
     Promise.all([
       api.getContents('tutorial').then(d => Array.isArray(d) ? d : []),
       api.getQuizzes().then(d => Array.isArray(d) ? d : []),
     ])
       .then(([t, q]) => { setTutorials(t); setQuizzes(q); })
       .catch(() => {})
       .finally(() => setLoading(false));
   }, []);
   ```
2. **Clicking a tutorial card** — stores `triggerRef.current = event.currentTarget`; sets `loginModalReason('full_tutorial')`; opens modal.
3. **Clicking a quiz card "Mulai Kuis" / "Mulai Tes"** — stores `triggerRef.current`; sets `loginModalReason('start_quiz')`; opens modal.
4. **"Mulai Kuis" in quiz detail modal** — same as above.
5. **Skeleton loading** — while `loading`, render 3× `<SkeletonCard />` per section.
6. **Teaser counter section** — displays `{tutorials.length} Tutorial` and `{quizzes.length} Kuis` with a CTA "Login untuk Akses Penuh".
7. Tab navigation (bank_kuis / wawancara / asesmen) mirrors `TutorialPage` using `activeTab` state (no URL hash needed since this is a separate page; URL hash support is optional).

#### UI Description

- Same visual as `TutorialPage` (rose/violet theme, tabs, card grids).
- Teaser section above the tabs: `bg-white dark:bg-zinc-900 rounded-[32px] p-6`, shows counts + CTA.
- Tutorial cards and quiz cards render as-is; click triggers soft gate instead of navigation.
- No "read full article" inline view — all clicks open `LoginPromptModal`.

---

### 2.4 `OnboardingPage`

**File:** `src/pages/OnboardingPage.jsx`

#### Props Interface

None (route component).

#### Key State

```js
const [stats, setStats]     = useState(null);   // null = loading
const [statsError, setStatsError] = useState(false);
```

#### Behavior

1. **Data fetch** — single `useEffect([], [])` with 5-second timeout:
   ```js
   useEffect(() => {
     const controller = new AbortController();
     const timeout = setTimeout(() => controller.abort(), 5000);
     api.getPublicStats({ signal: controller.signal })
       .then(d => { clearTimeout(timeout); setStats(d); })
       .catch(() => { clearTimeout(timeout); setStatsError(true); });
     return () => { clearTimeout(timeout); controller.abort(); };
   }, []);
   ```
   > Note: `api.getPublicStats` in `src/utils/api.js` must be updated to accept and forward a `signal` option. This is a one-line change to that method.
2. **Stats display**:
   - `stats === null && !statsError` → show `<SkeletonCard />` inline (small, for each stat value).
   - `statsError === true` → show static fallbacks: `"100+"`, `"50+"`, `"500+"`.
   - Otherwise → show `stats.totalJobs`, `stats.totalTutorials`, `stats.totalUsers` (include actual zero values as-is per R3.3).
3. **"Daftar Sekarang — Gratis"** → `<Link to="/login" />`.
4. **"Jelajahi Lowongan"** → `<Link to="/lowongan" />`.
5. No `LoginPromptModal` needed on this page — all CTAs go directly to `/login`.

#### UI Description

- Full-screen hero with gradient: `bg-gradient-to-br from-blue-950 to-indigo-900` or white background with blue accent depending on scroll position.
- 4 value-proposition cards in a `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` layout:
  1. **Portal Karir** — 💼 icon, "Akses ribuan lowongan & lacak lamaran kamu."
  2. **Profil Digital** — 👤 icon, "Buat CV online yang bisa dibagikan ke HRD."
  3. **Tutorial & Kuis** — 📚 icon, "Persiapan wawancara, kuis, dan psikotes."
  4. **Kalkulator Usaha** — 🧮 icon, "Rencanakan bisnis dengan simulasi keuangan."
- Stats row: 3 counters (Lowongan, Tutorial, Pengguna) using same `StatItem` visual as `beranda.jsx`.
- Primary CTA: `bg-blue-600 text-white px-10 py-4 rounded-[20px] font-black text-lg shadow-xl shadow-blue-600/30`
- Secondary CTA: ghost button style, `border border-blue-300 text-blue-600 dark:text-blue-400`

---

### 2.5 `SkeletonCard`

**File:** Defined inline in each page OR extracted to `src/components/SkeletonCard.jsx` for sharing.

Recommendation: extract to `src/components/SkeletonCard.jsx`.

#### Props Interface

```js
SkeletonCard.propTypes = {
  variant: PropTypes.oneOf(['job', 'tutorial', 'stat']),  // controls shape
}
SkeletonCard.defaultProps = { variant: 'job' }
```

#### Implementation

```jsx
// Pulse animation provided by Tailwind's `animate-pulse`
export default function SkeletonCard({ variant = 'job' }) {
  if (variant === 'stat') {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-20 bg-slate-200 dark:bg-zinc-700 rounded-xl mb-2" />
        <div className="h-3 w-28 bg-slate-100 dark:bg-zinc-800 rounded-full" />
      </div>
    );
  }
  if (variant === 'tutorial') {
    return (
      <div className="animate-pulse bg-white dark:bg-zinc-900 rounded-[24px] border border-slate-100 dark:border-zinc-800 p-5 space-y-3">
        <div className="h-32 bg-slate-200 dark:bg-zinc-700 rounded-2xl" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-zinc-700 rounded-full" />
        <div className="h-3 w-1/2 bg-slate-100 dark:bg-zinc-800 rounded-full" />
      </div>
    );
  }
  // variant === 'job' (default)
  return (
    <div className="animate-pulse bg-white dark:bg-zinc-900 rounded-[24px] border border-slate-100 dark:border-zinc-800 p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 bg-slate-200 dark:bg-zinc-700 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded-full w-3/4" />
          <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full" />
        <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full w-4/5" />
      </div>
      <div className="h-8 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
    </div>
  );
}
```

---

## Data Models

The feature introduces no new database tables or backend models. All data shapes are derived from existing API responses.

### Lowongan item shape (from `GET /api/contents/lowongan`)

```js
{
  id: number,
  judul: string,
  perusahaan: string | null,
  deskripsi: string | null,
  lokasi: string | null,
  detail_lokasi: string | null,
  tipe_pekerjaan: string | null,
  is_magang: boolean,
  gambar: string | null,       // image URL
  link_eksternal: string | null,
}
```

### Tutorial item shape (from `GET /api/contents/tutorial`)

```js
{
  id: number,
  judul: string,
  deskripsi: string | null,
  isi_konten: string | null,
  gambar: string | null,
  link_eksternal: string | null,
  file_tambahan: string | null,  // JSON-encoded array of { name, type, data }
}
```

### Quiz item shape (from `GET /api/quizzes`)

```js
{
  id: number,
  judul: string,
  deskripsi: string | null,
  gambar: string | null,
  kategori: string | null,       // 'psikotes' | 'umum' | ...
  link_eksternal: string | null,
}
```

### Public stats shape (from `GET /api/stats/public`)

```js
{
  totalJobs: number,
  totalTutorials: number,
  totalUsers: number,
}
```

### LoginPromptModal internal prop types

```js
// Not a data model, but documents the interface contract
{
  reason: 'apply_job' | 'full_tutorial' | 'start_quiz' | 'download_file',
  isOpen: boolean,
  onClose: () => void,
  returnTo: string,       // e.g. '/lowongan'
  jobId: string | null,   // optional, for apply_job reason only
  triggerRef: React.RefObject<HTMLElement>,
}
```

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| `GET /api/contents/lowongan` fails | `setLowongans([])`, show empty-state UI, no crash |
| `GET /api/contents/tutorial` fails | `setTutorials([])`, show empty-state for that section |
| `GET /api/quizzes` fails | `setQuizzes([])`, show empty-state for quiz section |
| `GET /api/stats/public` fails or times out (>5s) | `setStatsError(true)`, show static fallback values (`"100+"`, `"50+"`, `"500+"`) |
| `returnTo` param is malformed / unsafe | `getSafeReturnTo()` returns `'/masa-depan'` as fallback |
| `LoginPromptModal` opened without `triggerRef` | `onClose` skips `triggerRef.current.focus()` gracefully |

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

- `LoginPromptModal`: renders correct message for each `reason` value; closes on Escape; closes on backdrop click; focus trap cycles through three buttons only; focus returns to `triggerRef` on close.
- `getSafeReturnTo`: returns `/masa-depan` for `/admin/...`, URLs with `://`, URLs starting with `//`; returns the path for valid inputs like `/lowongan`.
- `SkeletonCard`: renders without error for each variant.

### Integration Tests

- `LowonganPreviewPage`: clicking "Apply Now" opens `LoginPromptModal` (not navigating to `/login`).
- `TutorialPreviewPage`: clicking a tutorial card opens `LoginPromptModal` with reason `full_tutorial`.
- `BottomNav`: renders guest links when `useAuth().user` is `null`; renders auth links when user is set.
- `beranda.jsx`: "Cari Lowongan" links to `/lowongan`; "Mulai Sekarang" links to `/tentang`.

### Manual / E2E Checks

- Full `returnTo` round-trip: guest clicks Lamar → login → lands back on `/lowongan`.
- Dark mode: all new components render correctly in dark theme.
- Keyboard: Tab through `LoginPromptModal` stays trapped; Escape closes it.
- Mobile: `BottomNav` shows correct guest links on viewport < 1024px.

---

## Correctness Properties

### Property 1: LoginPromptModal reason coverage
For any `reason` value in `['apply_job', 'full_tutorial', 'start_quiz', 'download_file']`, `LoginPromptModal` renders a non-empty, distinct message string specific to that reason.

**Validates: Requirements 4.6, 4.7, 4.8, 4.9**

### Property 2: returnTo security — unsafe paths blocked
For any `returnTo` string that begins with `/admin`, contains `://`, or begins with `//`, `getSafeReturnTo` always returns `'/masa-depan'` and never returns the unsafe path.

**Validates: Requirements 7.3**

### Property 3: returnTo security — safe paths preserved
For any valid relative pathname (e.g. `/lowongan`, `/tentang`, `/tutorial`) that does not begin with `/admin`, does not contain `://`, and does not begin with `//`, `getSafeReturnTo` returns the path unchanged.

**Validates: Requirements 7.2**

### Property 4: Public pages resilience to empty API data
Each of the three public pages (`LowonganPreviewPage`, `TutorialPreviewPage`, `OnboardingPage`) renders without throwing when the relevant API endpoint returns an empty array or an error.

**Validates: Requirements 1.7, 2.7, 3.6**

### Property 5: BottomNav item count invariant
`BottomNav` renders exactly 5 navigation items in both guest and authenticated configurations.

**Validates: Requirements 5.1, 5.2**

### Property 6: OnboardingPage stats always non-empty
`OnboardingPage` displays a non-empty string for each stat value (totalJobs, totalTutorials, totalUsers) regardless of whether the API call succeeds, fails, or times out — either the actual numeric value or a fallback like `"100+"`.

**Validates: Requirements 3.6, 3.7**


---

### 3.1 `src/App.jsx`

**Changes:**

1. Import the three new page components:
   ```js
   import LowonganPreviewPage from './pages/LowonganPreviewPage';
   import TutorialPreviewPage from './pages/TutorialPreviewPage';
   import OnboardingPage      from './pages/OnboardingPage';
   ```

2. Move `/tutorial` out of `<UserRouteGuard>` into the public `<Layout>` block, pointing to `TutorialPreviewPage`. The existing `TutorialPage` (full authenticated version) stays at its path but is now only reachable internally (no nav link for guests). Simplest approach — keep `/tutorial` as one route: `TutorialPreviewPage` for guests, and `TutorialPage` for authenticated users, discriminated inside the component using `useAuth`:
   > **Preferred:** Route `/tutorial` to `TutorialPreviewPage` in the public block. `TutorialPreviewPage` is the canonical `/tutorial` page — it renders full content for guests (with soft gate on actions) and can optionally redirect authenticated users to the full experience. Since both pages have the same data, there is no need for a separate authenticated `/tutorial` route. **Remove `/tutorial` from `UserRouteGuard` entirely.**

3. Add new public routes:
   ```jsx
   // BEFORE (public Layout block):
   <Route element={<Layout />}>
     <Route path="/" element={<Home />} />
   </Route>

   // AFTER:
   <Route element={<Layout />}>
     <Route path="/"          element={<Home />} />
     <Route path="/lowongan"  element={<LowonganPreviewPage />} />
     <Route path="/tentang"   element={<OnboardingPage />} />
     <Route path="/tutorial"  element={<TutorialPreviewPage />} />
   </Route>
   ```

4. Remove `/tutorial` from the `UserRouteGuard` block.

5. Update `LoginGuard` to handle `returnTo`:
   ```jsx
   // BEFORE:
   const LoginGuard = () => {
     const { user } = useAuth();
     if (user) return <Navigate to="/dashboard" replace />;
     return <LoginPage />;
   };

   // AFTER:
   const LoginGuard = () => {
     const { user } = useAuth();
     if (user) {
       // If already logged in, redirect to returnTo (validated) or /dashboard
       const params = new URLSearchParams(window.location.search);
       const returnTo = params.get('returnTo') || '';
       const safe = returnTo &&
         !returnTo.startsWith('/admin') &&
         !returnTo.includes('://') &&
         !returnTo.startsWith('//');
       return <Navigate to={safe ? returnTo : '/dashboard'} replace />;
     }
     return <LoginPage />;
   };
   ```
   > This handles the case where an already-logged-in user somehow visits `/login?returnTo=...`.

---

### 3.2 `src/pages/LoginPage.jsx`

**Changes:**

1. **Remove unused state** — delete `hoveredFeature`, `setHoveredFeature`, `stats` (fixes existing lint warnings).

2. **Read `returnTo` and navigate post-login:**
   ```js
   // Add to imports
   import { useNavigate, useSearchParams } from 'react-router-dom';

   // Inside component
   const [searchParams] = useSearchParams();

   const getSafeReturnTo = () => {
     const returnTo = searchParams.get('returnTo') || '';
     if (
       !returnTo ||
       returnTo.startsWith('/admin') ||
       returnTo.includes('://') ||
       returnTo.startsWith('//')
     ) return '/masa-depan';
     return returnTo;
   };

   const finishLogin = (userData, token) => {
     if (token) localStorage.setItem('bika_token', token);
     loginUser(userData);
     navigate(getSafeReturnTo());   // ← was hardcoded to '/masa-depan'
   };
   ```

3. **No other logic changes** — `handleDemoLogin` also calls `finishLogin`, so it automatically picks up `returnTo`.

4. Remove the `loginStats` polling and the `stats` array (the `useEffect` that calls `api.getLoginStats` on a 30-second interval). The stats are no longer rendered in the updated login page design. If keeping them is desired, they should remain — but the current code already has `stats` declared and unused, so removal is the correct fix.

---

### 3.3 `src/pages/beranda.jsx`

**Changes** — update link targets only, no logic changes:

| Element | Old `to` / `href` | New `to` |
|---------|-------------------|---------|
| Hero "Cari Lowongan" button | `/masa-depan` | `/lowongan` |
| Hero "Daftar Sekarang" button | `/login` | `/login` _(unchanged)_ |
| Lowongan section "Lihat Semua" | `/masa-depan` | `/lowongan` |
| "Jelajahi Peluang Karir Lainnya →" button | `window.location.href = '/masa-depan'` | `<Link to="/lowongan">` (use NavLink, remove imperative nav) |
| CTA card "Mulai Sekarang" button | `window.location.href = '/login'` | `<Link to="/tentang">` (use NavLink) |
| Tutorial "Lihat Semua" button | `window.location.href = '/tutorial'` | `<Link to="/tutorial">` (use NavLink) |
| `FeatureCard` "Portal Karir" | `link="/masa-depan"` | `link="/lowongan"` |
| `FeatureCard` "Tutorial Skill" | `link="/tutorial"` | `link="/tutorial"` _(unchanged)_ |
| `FeatureCard` "Bangun Profil" | `link="/profil"` | `link="/tentang"` |

Replace all `window.location.href` assignments with `<Link>`/`<NavLink>` or `useNavigate()` calls. This is also an accessibility improvement.

---

### 3.4 `src/components/BottomNav.jsx`

**Changes:**

1. Import `useAuth`:
   ```js
   import { useAuth } from '../context/AuthContext';
   ```

2. Inside the component, determine guest vs. authenticated:
   ```js
   const { user } = useAuth();
   const token = localStorage.getItem('bika_token');
   const isGuest = !user || !token;
   ```

3. Define two nav link arrays:
   ```js
   const guestNavLinks = [
     { path: '/',        label: 'Beranda',  icon: FiHome },
     { path: '/lowongan',label: 'Lowongan', icon: FiBriefcase },
     { path: '/tutorial',label: 'Tutorial', icon: FiBookOpen, isCenter: true },
     { path: '/tentang', label: 'Tentang',  icon: FiInfo },
     { path: '/login',   label: 'Login',    icon: FiLogIn },
   ];

   const authNavLinks = [
     { path: '/masa-depan', label: 'Masa',    icon: FiTrendingUp },
     { path: '/tutorial',   label: 'Tutorial',icon: FiBookOpen },
     { path: '/',           label: 'Utama',   icon: FiPlus, isCenter: true },
     { path: '/usaha',      label: 'Usaha',   icon: FiBriefcase },
     { path: '/profil',     label: 'Profil',  icon: FiUser },
   ];

   const navLinks = isGuest ? guestNavLinks : authNavLinks;
   ```

4. Add `FiInfo` and `FiLogIn` to imports from `react-icons/fi`.

5. The Login link in the guest nav should be visually distinct:
   ```jsx
   // In the render, for the Login item (path === '/login'):
   <Link
     to="/login"
     className="flex flex-col items-center gap-1 text-blue-600 dark:text-blue-400 w-full py-2"
   >
     <FiLogIn size={22} />
     <span className="text-[9px] font-extrabold uppercase tracking-widest">Login</span>
   </Link>
   ```

6. No changes to the SVG notch background or center button logic.

---

## 4. returnTo Flow

```
GUEST on /lowongan
│
├─ Sees job card → clicks "Apply Now"
│
├─ LoginPromptModal opens
│   reason="apply_job"
│   returnTo="/lowongan"
│   jobId="123"               ← from selectedJob.id
│
├─ Guest clicks "Login dengan Google"
│
├─ navigate('/login?returnTo=/lowongan&jobId=123')
│   (modal closes, page stays in DOM briefly then navigates)
│
LoginPage renders
│
├─ User completes Google OAuth
│
├─ finishLogin(userData, token) called
│   └─ getSafeReturnTo() reads searchParams.get('returnTo')
│       → '/lowongan' (passes security check)
│
└─ navigate('/lowongan')
    └─ LowonganPreviewPage renders
        └─ (Optional: read jobId from URL and auto-open that job's modal)


SECURITY GUARD — getSafeReturnTo():
  returnTo = '/admin/users'  → blocked (starts with /admin) → go to /masa-depan
  returnTo = 'https://evil'  → blocked (contains ://)       → go to /masa-depan
  returnTo = '//evil'        → blocked (starts with //)      → go to /masa-depan
  returnTo = '/lowongan'     → allowed                        → go to /lowongan
  returnTo = ''              → empty                          → go to /masa-depan
```

### jobId Restoration (optional enhancement, not blocking)

After navigating to `/lowongan` post-login, `LowonganPreviewPage` can read `jobId` from the URL:
```js
const [searchParams] = useSearchParams();
const jobIdFromUrl = searchParams.get('jobId');

useEffect(() => {
  if (jobIdFromUrl && lowongans.length > 0) {
    const job = lowongans.find(l => String(l.id) === jobIdFromUrl);
    if (job) setSelectedJob(job);
  }
}, [jobIdFromUrl, lowongans]);
```

---

## 5. LoginPromptModal — reason → message Mapping

| `reason` value | Icon | Title | Message displayed |
|----------------|------|-------|-------------------|
| `apply_job` | 💼 | Lamar Lowongan | "Login untuk melamar lowongan ini dan melacak status lamaranmu." |
| `full_tutorial` | 📖 | Baca Artikel | "Login untuk membaca artikel lengkap dan mengakses semua materi tutorial." |
| `start_quiz` | 🧠 | Mulai Kuis | "Login untuk memulai kuis dan menyimpan skor hasil tesmu." |
| `download_file` | 📥 | Unduh File | "Login untuk mengunduh file lampiran dari materi ini." |

Default fallback (unknown reason): Icon 🔐, Title "Login Diperlukan", Message "Login untuk mengakses fitur ini."

---

## 6. Guest vs. Authenticated BottomNav Items

### Guest Nav (5 items)

| Position | Label | Icon | Path | Notes |
|----------|-------|------|------|-------|
| 1 | Beranda | `FiHome` | `/` | |
| 2 | Lowongan | `FiBriefcase` | `/lowongan` | |
| 3 (center) | Tutorial | `FiBookOpen` | `/tutorial` | Center floating button |
| 4 | Tentang | `FiInfo` | `/tentang` | |
| 5 | Login | `FiLogIn` | `/login` | Blue color always (not just active) |

### Authenticated Nav (5 items — unchanged from current)

| Position | Label | Icon | Path | Notes |
|----------|-------|------|------|-------|
| 1 | Masa | `FiTrendingUp` | `/masa-depan` | |
| 2 | Tutorial | `FiBookOpen` | `/tutorial` | |
| 3 (center) | Utama | `FiPlus` | `/` | Center floating button |
| 4 | Usaha | `FiBriefcase` | `/usaha` | |
| 5 | Profil | `FiUser` | `/profil` | |

---

## 7. API Usage Summary

All public pages use only these existing, unauthenticated endpoints:

| Page | Endpoint | Method |
|------|----------|--------|
| `LowonganPreviewPage` | `GET /api/contents/lowongan` | `api.getContents('lowongan')` |
| `TutorialPreviewPage` | `GET /api/contents/tutorial` | `api.getContents('tutorial')` |
| `TutorialPreviewPage` | `GET /api/quizzes` | `api.getQuizzes()` |
| `OnboardingPage` | `GET /api/stats/public` | `api.getPublicStats()` |
| `beranda.jsx` | All three above | Already in place |

No new API methods are required in `src/utils/api.js` except forwarding an `AbortSignal` to `getPublicStats` for the timeout behavior in `OnboardingPage`.

---

## 8. Styling Conventions

All new components follow the existing patterns:

- **Border radius**: `rounded-[24px]` cards, `rounded-[32px]` modals, `rounded-2xl` buttons
- **Primary color**: `bg-blue-600`, `text-blue-600`
- **Dark mode**: all elements use `dark:` variants matching the existing codebase
- **Shadows**: `shadow-xl shadow-blue-600/30` for primary CTAs
- **Typography**: `font-black` for headings/labels, `font-bold` for secondary, `font-medium` for body
- **Backdrop**: `bg-black/60 backdrop-blur-sm` for modals
- **Transitions**: `transition-all duration-300`
- **Skeleton**: `animate-pulse` with `bg-slate-200 dark:bg-zinc-700` shapes
