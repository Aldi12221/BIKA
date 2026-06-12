# Implementation Plan: Guest/Unauthenticated User Experience

## Overview

Implement public-access pages and a soft-gate pattern for BIKA's guest users. Work is split into: shared utility components (no dependencies), three new public pages (depend on shared components), and updates to existing files (routing, login, beranda, and BottomNav). All work is frontend-only — no backend changes required.

---

## Tasks

- [x] 1. Create shared `SkeletonCard` component
  - [x] 1.1 Create `src/components/SkeletonCard.jsx` with `variant` prop
    - Implement three variants: `'job'` (default), `'tutorial'`, and `'stat'`
    - Use Tailwind `animate-pulse` for all variants; match the exact markup from the design document Section 2.5
    - Export as default; add `SkeletonCard.propTypes` and `SkeletonCard.defaultProps`
    - _Requirements: 8.2_

- [x] 2. Create `LoginPromptModal` component
  - [x] 2.1 Create `src/components/LoginPromptModal.jsx` with all props and focus-trap logic
    - Accept props: `reason`, `isOpen`, `onClose`, `returnTo`, `jobId`, `triggerRef`
    - Return `null` when `isOpen === false`
    - On open: set `document.body.style.overflow = 'hidden'`; move focus to first focusable button
    - Implement focus trap: `Tab` / `Shift+Tab` cycles only among the three buttons inside the modal
    - On close (`onClose`): restore `document.body.style.overflow = 'unset'`; call `triggerRef.current?.focus()`
    - Close on backdrop click and `Escape` key
    - Map `reason` → message per design Section 5 (apply_job, full_tutorial, start_quiz, download_file, default fallback)
    - Both primary/secondary buttons call `useNavigate` to `/login?returnTo=<returnTo>&jobId=<jobId>` (omit `jobId` param if not provided)
    - Apply light/dark styling from `ThemeContext` using Tailwind dark: variants (no manual theme reads needed)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 8.3, 8.4, 8.5_

  - [ ]* 2.2 Write property test for `LoginPromptModal` reason coverage
    - **Property 1: LoginPromptModal reason coverage**
    - For each value in `['apply_job', 'full_tutorial', 'start_quiz', 'download_file']`, render the modal and assert the displayed message is non-empty and distinct from the other three
    - **Validates: Requirements 4.6, 4.7, 4.8, 4.9**

  - [ ]* 2.3 Write property test for `getSafeReturnTo` security
    - Extract `getSafeReturnTo` to `src/utils/returnTo.js` so it can be tested in isolation
    - **Property 2: returnTo security — unsafe paths blocked**: for any input beginning with `/admin`, containing `://`, or beginning with `//`, the function always returns `'/masa-depan'`
    - **Property 3: returnTo security — safe paths preserved**: for any valid relative path (e.g. `/lowongan`, `/tentang`, `/tutorial`) that passes all three blocked checks, the function returns the path unchanged
    - **Validates: Requirements 7.2, 7.3**

- [x] 3. Checkpoint — shared components complete
  - Ensure `SkeletonCard` and `LoginPromptModal` render without errors in isolation. Ask the user if any questions arise before proceeding.

- [ ] 4. Create `LowonganPreviewPage`
  - [ ] 4.1 Create `src/pages/LowonganPreviewPage.jsx` with data fetching and filter state
    - Fetch `api.getContents('lowongan')` in a single `useEffect([], [])`, set `loading` true before and false in `.finally()`
    - On error or non-array response, set `lowongans` to `[]` (no crash)
    - Implement search and filter state: `search`, `filterTipe`, `filterLokasi`, `filterMagang`, `openFilter`
    - Derive filtered list via `useMemo` (same logic pattern as `MasaDepanPage`)
    - Show 6× `<SkeletonCard variant="job" />` while `loading === true`; replace with job cards when done
    - Show empty-state UI when `lowongans.length === 0 && !loading`
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 8.1, 8.2_

  - [ ] 4.2 Add job detail modal and soft-gate apply flow to `LowonganPreviewPage`
    - Add `selectedJob`, `loginModalOpen`, and `applyBtnRef` state/ref
    - Clicking a job card sets `selectedJob` and shows the detail modal (lock body scroll)
    - Inside the detail modal, replace "Apply Now" action with a button that sets `loginModalOpen(true)` and `modalReason('apply_job')`
    - Clicking "Apply Now" / "Lamar" directly on any card also opens `LoginPromptModal` (soft gate, not navigation)
    - Render `<LoginPromptModal reason="apply_job" isOpen={loginModalOpen} onClose={...} returnTo="/lowongan" jobId={selectedJob?.id} triggerRef={applyBtnRef} />` at page level
    - Add sticky CTA banner (gradient strip) at top of page with "Login untuk Melamar & Menyimpan Lowongan" and ghost button linking to `/login?returnTo=/lowongan`
    - Add filter search controls with appropriate ARIA labels and roles
    - _Requirements: 1.4, 1.5, 1.6, 8.6_

  - [ ]* 4.3 Write unit tests for `LowonganPreviewPage` soft gate
    - Mock `api.getContents` to return a job array
    - Assert clicking "Apply Now" opens `LoginPromptModal` (check modal becomes visible) and does NOT navigate to `/login`
    - Assert empty API response renders empty-state without throwing
    - _Requirements: 1.4, 1.7_

- [ ] 5. Create `TutorialPreviewPage`
  - [ ] 5.1 Create `src/pages/TutorialPreviewPage.jsx` with parallel data fetching
    - Fetch both `api.getContents('tutorial')` and `api.getQuizzes()` with a single `Promise.all` in `useEffect([], [])`; set `loading` true before and false in `.finally()`
    - On individual endpoint error, set that state to `[]`; the other section renders normally
    - Show 3× `<SkeletonCard variant="tutorial" />` per section while loading
    - Implement tab navigation state (`activeTab`: `'bank_kuis'` | `'wawancara'` | `'asesmen'`) mirroring `TutorialPage`
    - Render a teaser counter section above the tabs: `{tutorials.length} Tutorial` and `{quizzes.length} Kuis` with "Login untuk Akses Penuh" CTA
    - _Requirements: 2.1, 2.2, 2.3, 2.6, 2.7, 8.1, 8.2_

  - [ ] 5.2 Add soft-gate click handlers to `TutorialPreviewPage`
    - Clicking a tutorial card: set `triggerRef.current = event.currentTarget`, set `loginModalReason('full_tutorial')`, open modal
    - Clicking a quiz card's "Mulai Kuis" / "Mulai Tes": set `triggerRef.current`, set `loginModalReason('start_quiz')`, open modal
    - Render `<LoginPromptModal reason={loginModalReason} isOpen={loginModalOpen} onClose={...} returnTo="/tutorial" triggerRef={triggerRef} />` at page level
    - Add ARIA labels on all interactive elements (buttons, tabs)
    - _Requirements: 2.4, 2.5, 8.6_

  - [ ]* 5.3 Write unit tests for `TutorialPreviewPage` soft gate
    - Mock both API calls; assert clicking a tutorial card opens `LoginPromptModal` with reason `full_tutorial`
    - Assert clicking "Mulai Kuis" opens modal with reason `start_quiz` and does NOT navigate to `/quiz/:id`
    - _Requirements: 2.4, 2.5_

- [ ] 6. Create `OnboardingPage`
  - [ ] 6.1 Create `src/pages/OnboardingPage.jsx` with stats fetch and 5-second timeout
    - Fetch `api.getPublicStats({ signal })` in `useEffect([], [])` using `AbortController` with a 5000ms timeout
    - `stats === null && !statsError` → show `<SkeletonCard variant="stat" />` for each of the three stat values
    - `statsError === true` → show static fallbacks `"100+"`, `"50+"`, `"500+"` (no error message to user)
    - `stats` available → render `stats.totalJobs`, `stats.totalTutorials`, `stats.totalUsers` (render actual zero values as-is)
    - Update `src/utils/api.js`: add `signal` parameter forwarding to `getPublicStats` (one-line change)
    - _Requirements: 3.1, 3.3, 3.6, 3.7, 8.1, 8.2_

  - [ ] 6.2 Add value proposition cards and CTA buttons to `OnboardingPage`
    - Render exactly 4 value-prop cards in a `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` layout: Portal Karir 💼, Profil Digital 👤, Tutorial & Kuis 📚, Kalkulator Usaha 🧮 — each with icon, title, and description per design Section 2.4
    - Primary CTA "Daftar Sekarang — Gratis": `<Link to="/login" />`
    - Secondary CTA "Jelajahi Lowongan": `<Link to="/lowongan" />`
    - Stats row reuses `StatItem` visual pattern from `beranda.jsx`
    - Add ARIA labels to all buttons and icon elements
    - _Requirements: 3.2, 3.4, 3.5, 8.6_

  - [ ]* 6.3 Write property test for `OnboardingPage` stats invariant
    - **Property 6: OnboardingPage stats always non-empty**
    - Render `OnboardingPage` with mocked API returning success, failure, and timeout scenarios
    - For each scenario, assert each stat slot displays a non-empty string (either numeric value or fallback like `"100+"`)
    - **Validates: Requirements 3.6, 3.7**

- [ ] 7. Checkpoint — new pages complete
  - Ensure all three public pages render without errors with both populated and empty API responses. Ask the user if any questions arise before proceeding.

- [ ] 8. Update routing in `App.jsx`
  - [ ] 8.1 Add new public routes and remove `/tutorial` from protected block
    - Import `LowonganPreviewPage`, `TutorialPreviewPage`, and `OnboardingPage`
    - Add `<Route path="/lowongan" element={<LowonganPreviewPage />} />`, `<Route path="/tentang" element={<OnboardingPage />} />`, and `<Route path="/tutorial" element={<TutorialPreviewPage />} />` inside the existing public `<Route element={<Layout />}>` block
    - Remove the `<Route path="/tutorial" element={<TutorialPage />} />` entry from inside `<UserRouteGuard>` (the page still exists but is no longer route-registered here)
    - _Requirements: 1.1, 2.1, 3.1, 8.7_

  - [ ] 8.2 Update `LoginGuard` to handle `returnTo` for already-authenticated users
    - When `user` is already set, read `returnTo` from `window.location.search`, validate it (not `/admin*`, not `://`, not `//`), then `<Navigate to={safe ? returnTo : '/dashboard'} replace />`
    - _Requirements: 7.2, 7.3_

- [ ] 9. Update `LoginPage.jsx` for `returnTo` navigation
  - [ ] 9.1 Read `returnTo` from URL params and navigate post-login
    - Add `useSearchParams` import; implement `getSafeReturnTo()` inline using the same three validation rules (blocks `/admin*`, `://`, `//`; fallback to `'/masa-depan'`)
    - Update `finishLogin` to call `navigate(getSafeReturnTo())` instead of the hardcoded `navigate('/masa-depan')`
    - `handleDemoLogin` calls `finishLogin` so it picks up `returnTo` automatically
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 9.2 Remove unused state from `LoginPage.jsx`
    - Delete `hoveredFeature`, `setHoveredFeature` state and all references
    - Delete `stats` variable (derived from `loginStats`) and all references — it is declared but never rendered
    - Delete the `loginStats` polling `useEffect` (the `setInterval` calling `api.getLoginStats` every 30 seconds) and the `defaultLoginStats` / `loginStats` state if the stats section is no longer rendered; if keeping the stats display, remove only the `stats` derived variable and `hoveredFeature` state
    - _Requirements: (code quality — resolves existing lint warnings)_

- [ ] 10. Update CTA links in `beranda.jsx`
  - [ ] 10.1 Replace all stale link targets and imperative navigation with declarative links
    - Hero "Cari Lowongan" `<NavLink to="/masa-depan">` → `<NavLink to="/lowongan">`
    - Lowongan section "Lihat Semua" `<NavLink to="/masa-depan">` → `<NavLink to="/lowongan">`
    - "Jelajahi Peluang Karir Lainnya →" `button onClick={() => window.location.href = '/masa-depan'}` → `<NavLink to="/lowongan">` (remove the button wrapper and use NavLink directly)
    - CTA card "Mulai Sekarang" `button onClick={() => window.location.href = '/login'}` → `<NavLink to="/tentang">` (change destination to `/tentang`, replace with NavLink)
    - Tutorial sidebar "Lihat Semua" in `SectionHeader`: `button onClick={() => link && (window.location.href = link)}` → use `<NavLink>` or pass through `useNavigate` inside `SectionHeader`; the call site already passes `link="/tutorial"` so it stays unchanged
    - `FeatureCard` "Portal Karir" `link="/masa-depan"` → `link="/lowongan"`
    - `FeatureCard` "Bangun Profil" `link="/profil"` → `link="/tentang"`
    - `FeatureCard` "Tutorial Skill" `link="/tutorial"` stays unchanged
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 11. Update `BottomNav.jsx` for guest vs. authenticated navigation
  - [ ] 11.1 Add `useAuth` import and define guest/auth nav link arrays
    - Import `useAuth` from `'../context/AuthContext'`
    - Import `FiInfo` and `FiLogIn` from `react-icons/fi`
    - Inside component: `const { user } = useAuth(); const token = localStorage.getItem('bika_token'); const isGuest = !user || !token;`
    - Define `guestNavLinks` (5 items): Beranda `/`, Lowongan `/lowongan`, Tutorial `/tutorial` (isCenter), Tentang `/tentang`, Login `/login`
    - Define `authNavLinks` (5 items): unchanged from current `navLinks` array
    - Set `const navLinks = isGuest ? guestNavLinks : authNavLinks;`
    - Render the Login item in guest nav with `text-blue-600 dark:text-blue-400` always active styling (not conditional on `isActive`)
    - _Requirements: 5.1, 5.2, 5.3, 5.3a, 5.4, 5.5_

  - [ ]* 11.2 Write unit tests for `BottomNav` item count invariant
    - **Property 5: BottomNav renders exactly 5 navigation items**
    - Render with `useAuth` mocked to return `{ user: null }` → assert exactly 5 nav items are present
    - Render with `useAuth` mocked to return `{ user: { id: 1 } }` and `localStorage.bika_token` set → assert exactly 5 nav items are present
    - **Validates: Requirements 5.1, 5.2**

- [ ] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass and all new public routes are reachable without authentication. Ask the user if any questions arise before proceeding.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at natural milestones
- Property tests validate universal correctness properties (Properties 1–6 from design Section "Correctness Properties")
- Unit tests validate specific examples and edge cases
- `getSafeReturnTo` is used in both `LoginPage.jsx` (task 9.1) and `LoginGuard` in `App.jsx` (task 8.2) — the utility version extracted in task 2.3 (`src/utils/returnTo.js`) should be imported by both once created
- The existing `TutorialPage.jsx` is not deleted; it just loses its route registration. It can be repurposed or removed in a future cleanup task.

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["4.1", "5.1", "6.1"] },
    { "id": 4, "tasks": ["4.2", "5.2", "6.2"] },
    { "id": 5, "tasks": ["4.3", "5.3", "6.3", "8.1", "9.1", "10.1", "11.1"] },
    { "id": 6, "tasks": ["8.2", "9.2", "11.2"] }
  ]
}
```
