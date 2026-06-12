# Requirements Document

## Introduction

Fitur **Guest/Unauthenticated User Experience** bertujuan memberikan pengalaman penjelajahan yang bermakna bagi pengguna yang belum login di platform BIKA (Bisa Karir — platform karir untuk siswa SMK). Saat ini, semua halaman utama selain Beranda diproteksi sepenuhnya dan langsung mengarahkan pengguna ke `/login`. Kondisi ini menyebabkan user yang baru mengenal BIKA tidak mendapatkan cukup "nilai" sebelum diminta mendaftar, yang dapat menurunkan tingkat konversi pendaftaran.

Fitur ini memperkenalkan halaman-halaman publik yang dapat diakses tanpa login (preview lowongan, preview tutorial, onboarding value proposition), serta mekanisme "soft gate" — batasan akses yang ditampilkan secara kontekstual dengan prompt login yang relevan dan tepat waktu, bukan redirect paksa ke halaman login.

Stack teknologi: React + Vite (frontend), Node.js (backend).

---

## Glossary

- **Guest_User**: Pengguna yang mengakses BIKA tanpa autentikasi (tidak memiliki sesi login aktif).
- **Authenticated_User**: Pengguna yang sudah login dengan akun Google atau Demo Login.
- **Soft_Gate**: Mekanisme pembatasan akses yang menampilkan modal atau prompt login secara kontekstual, tanpa langsung melakukan hard redirect ke `/login`.
- **Hard_Redirect**: Perilaku saat ini di mana `UserRouteGuard` langsung mengalihkan pengguna ke `/login` tanpa penjelasan atau pratinjau konten.
- **Preview_Page**: Halaman yang dapat diakses oleh `Guest_User` namun menampilkan konten terbatas disertai prompt untuk login guna mengakses lebih banyak fitur.
- **Login_Prompt_Modal**: Komponen overlay yang muncul di atas konten untuk mendorong `Guest_User` melakukan login, tanpa meninggalkan halaman saat ini.
- **Onboarding_Page**: Halaman yang menjelaskan nilai dan manfaat BIKA kepada `Guest_User` sebelum mereka mendaftar.
- **CTA**: Call-to-Action — elemen UI (tombol, banner, atau link) yang mendorong `Guest_User` untuk melakukan login atau mendaftar.
- **BottomNav**: Komponen navigasi bawah yang saat ini menampilkan link ke halaman-halaman yang membutuhkan autentikasi.
- **Content_Preview**: Pratinjau terbatas dari konten (misalnya ringkasan lowongan atau judul tutorial) yang ditampilkan kepada `Guest_User`.
- **BIKA**: Platform karir digital untuk siswa SMK di Indonesia.
- **Lowongan**: Data lowongan kerja dan magang yang dikelola admin dan tersedia melalui API publik `/api/contents/lowongan`.
- **Tutorial**: Konten pembelajaran, tips wawancara, dan kuis yang tersedia melalui API publik `/api/contents/tutorial`.
- **App_Router**: Sistem routing React (React Router v6) yang mengelola navigasi antar halaman di `App.jsx`.

---

## Requirements

### Requirement 1: Halaman Preview Lowongan untuk Guest User

**User Story:** Sebagai seorang siswa SMK yang belum memiliki akun, saya ingin bisa melihat daftar lowongan kerja di BIKA, sehingga saya dapat menilai relevansi platform sebelum memutuskan untuk mendaftar.

#### Acceptance Criteria

1. WHEN a `Guest_User` navigates to `/lowongan`, THE `App_Router` SHALL render the lowongan preview page without redirecting to `/login`.
2. THE `Preview_Page` SHALL display a list of `Lowongan` cards including job title, company name, location, and job type for all available jobs fetched from the public API endpoint `/api/contents/lowongan`.
3. THE `Preview_Page` SHALL display search and filter controls (by job type, category, and location) that `Guest_User` can interact with to browse `Lowongan`.
4. WHEN a `Guest_User` clicks the "Apply Now" button on a `Lowongan` card, THE `Soft_Gate` SHALL display a `Login_Prompt_Modal` explaining that login is required to apply, instead of redirecting to `/login`.
5. WHEN a `Guest_User` clicks a `Lowongan` card to view its detail, THE `Preview_Page` SHALL display the job detail modal with full job description, but SHALL replace the "Apply Now" action inside the modal with a `Login_Prompt_Modal` trigger.
6. THE `Preview_Page` SHALL display a sticky CTA banner at the top or bottom of the page prompting `Guest_User` to login, with the message indicating the benefit of logging in (e.g., melamar langsung, simpan lowongan).
7. IF the public API endpoint `/api/contents/lowongan` returns an error or empty response, THEN THE `Preview_Page` SHALL display an informative empty-state message without crashing.

---

### Requirement 2: Halaman Preview Tutorial untuk Guest User

**User Story:** Sebagai seorang siswa SMK yang belum memiliki akun, saya ingin bisa melihat daftar materi tutorial yang tersedia di BIKA, sehingga saya dapat mengevaluasi kualitas konten sebelum mendaftar.

#### Acceptance Criteria

1. WHEN a `Guest_User` navigates to `/tutorial`, THE `App_Router` SHALL render the tutorial preview page without redirecting to `/login`.
2. THE `Preview_Page` SHALL display all available tutorial cards (judul, deskripsi ringkas, gambar) fetched from the public API endpoint `/api/contents/tutorial`.
3. THE `Preview_Page` SHALL display all available quiz cards (judul, deskripsi, gambar) fetched from the public API endpoint `/api/quizzes` with their respective categories (Bank Kuis, Tes Asesmen).
4. WHEN a `Guest_User` clicks a tutorial card to read the full article, THE `Soft_Gate` SHALL display a `Login_Prompt_Modal` instead of opening the full article content.
5. WHEN a `Guest_User` clicks a quiz card and then clicks "Mulai Kuis" or "Mulai Tes", THE `Soft_Gate` SHALL display a `Login_Prompt_Modal` instead of navigating to `/quiz/:id`.
6. THE `Preview_Page` SHALL display a visible teaser section showing the count of available tutorials and quizzes with a CTA to login for full access.
7. IF the public API endpoints for tutorials or quizzes return errors, THEN THE `Preview_Page` SHALL display an informative empty-state for the affected section without crashing.

---

### Requirement 3: Halaman Onboarding "Kenapa Harus Daftar"

**User Story:** Sebagai seorang siswa SMK yang baru mengenal BIKA, saya ingin melihat halaman yang menjelaskan manfaat nyata mendaftar di BIKA, sehingga saya termotivasi untuk membuat akun.

#### Acceptance Criteria

1. WHEN a `Guest_User` navigates to `/tentang` or clicks a CTA "Kenapa Daftar?" from any preview page or the Beranda, THE `App_Router` SHALL render the `Onboarding_Page` without redirecting to `/login`.
2. THE `Onboarding_Page` SHALL display at minimum four distinct value propositions, each with an icon, judul singkat, dan deskripsi manfaat: Portal Karir (akses lowongan & lamaran), Profil Digital (CV online), Tutorial & Kuis (persiapan kerja), dan Kalkulator Usaha (perencanaan wirausaha).
3. WHEN the `Onboarding_Page` has successfully received a response from the public API endpoint `/api/stats/public`, THE `Onboarding_Page` SHALL display the returned numeric values for total lowongan, total tutorial, and total users in the platform statistics section, including actual zero values if the platform has no content yet.
4. THE `Onboarding_Page` SHALL display a prominent CTA button "Daftar Sekarang — Gratis" that navigates `Guest_User` to `/login`.
5. THE `Onboarding_Page` SHALL display a secondary CTA "Jelajahi Lowongan" that navigates `Guest_User` to `/lowongan`.
6. IF the public stats API endpoint `/api/stats/public` returns an error or does not respond within 5 seconds, THEN THE `Onboarding_Page` SHALL display a static fallback value in the format of a positive integer followed by "+" (e.g., "100+") for each statistic, without displaying an error message or crashing.
7. WHILE the `Onboarding_Page` is awaiting a response from the public API endpoint `/api/stats/public`, THE `Onboarding_Page` SHALL display a loading indicator in place of each statistic value.

---

### Requirement 4: Login Prompt Modal (Soft Gate)

**User Story:** Sebagai seorang siswa SMK yang sedang menjelajahi konten BIKA tanpa login, saya ingin melihat pesan yang jelas dan kontekstual ketika saya mencoba mengakses fitur yang membutuhkan akun, sehingga saya memahami mengapa login diperlukan dan termotivasi untuk melakukannya.

#### Acceptance Criteria

1. THE `Login_Prompt_Modal` SHALL be a reusable React component that accepts a `reason` prop (string) describing why login is required, to display a contextual message.
2. WHEN the `Login_Prompt_Modal` is displayed, THE `Login_Prompt_Modal` SHALL overlay the current page content using a backdrop without fully navigating away from the current page.
3. THE `Login_Prompt_Modal` SHALL display a primary action button "Login dengan Google" and a secondary action button "Daftar Gratis" that both navigate to `/login`.
4. WHEN the `Login_Prompt_Modal` dismiss button ("Nanti saja") is clicked, THE modal SHALL close, THE current page SHALL remain visible and interactive, AND keyboard focus SHALL return to the element that triggered the modal, without navigating away from the current page.
5. WHEN the `Login_Prompt_Modal` is displayed and the dismiss button has not been clicked, THE modal SHALL continue to overlay the current page content and SHALL NOT close or navigate away on its own.
6. WHERE the `reason` prop is provided with value "apply_job", THE `Login_Prompt_Modal` SHALL display the message "Login untuk melamar lowongan ini dan melacak status lamaranmu."
7. WHERE the `reason` prop is provided with value "full_tutorial", THE `Login_Prompt_Modal` SHALL display the message "Login untuk membaca artikel lengkap dan mengakses semua materi tutorial."
8. WHERE the `reason` prop is provided with value "start_quiz", THE `Login_Prompt_Modal` SHALL display the message "Login untuk memulai kuis dan menyimpan skor hasil tesmu."
9. WHERE the `reason` prop is provided with value "download_file", THE `Login_Prompt_Modal` SHALL display the message "Login untuk mengunduh file lampiran dari materi ini."
10. THE `Login_Prompt_Modal` SHALL support both light and dark mode themes consistent with the existing `ThemeContext`.

---

### Requirement 5: Pembaruan BottomNav untuk Guest User

**User Story:** Sebagai seorang siswa SMK yang belum login, saya ingin melihat navigasi bawah yang relevan dengan kondisi saya, sehingga saya dapat menavigasi antara halaman-halaman yang tersedia tanpa kebingungan.

#### Acceptance Criteria

1. WHILE a `Guest_User` is on any public page, THE `BottomNav` SHALL display navigation links only to pages accessible to `Guest_User`: Beranda (`/`), Lowongan (`/lowongan`), Tutorial (`/tutorial`), dan Tentang (`/tentang`).
2. WHILE an `Authenticated_User` is logged in, THE `BottomNav` SHALL display the original navigation links: Masa Depan (`/masa-depan`), Tutorial (`/tutorial`), Utama (`/`), Usaha (`/usaha`), dan Profil (`/profil`), preserving existing behavior.
3. THE `BottomNav` SHALL use `AuthContext` to determine whether the current user is a `Guest_User` or `Authenticated_User`. WHEN the `AuthContext` user state is `null` or `undefined`, THE `BottomNav` SHALL render guest navigation links.
3a. WHEN the `AuthContext` indicates an authenticated user but no valid session token exists in `localStorage`, THE `BottomNav` SHALL render guest navigation links as a fallback.
4. WHEN a `Guest_User` taps a navigation item in the `BottomNav` that links to a public page, THE `App_Router` SHALL navigate to that page without displaying a login prompt.
5. THE `BottomNav` for `Guest_User` SHALL display a visually distinct "Login" shortcut icon or label to make it easy to find the login page.

---

### Requirement 6: Pembaruan Tombol CTA di Beranda untuk Guest User

**User Story:** Sebagai seorang siswa SMK yang mengunjungi halaman Beranda tanpa login, saya ingin tombol-tombol ajakan bertindak membawa saya ke halaman yang relevan dan bukan langsung ke login, sehingga saya bisa menjelajahi lebih dulu sebelum mendaftar.

#### Acceptance Criteria

1. WHEN a `Guest_User` clicks the "Cari Lowongan" button on the `Beranda`, THE `App_Router` SHALL navigate to `/lowongan` (the new public preview page) instead of `/masa-depan` (the protected page). WHERE a `Guest_User` navigates directly to `/lowongan` via URL, THE `App_Router` SHALL also render the public preview page without redirecting to `/login`.
2. WHEN a `Guest_User` clicks the "Daftar Sekarang" button on the `Beranda`, THE `App_Router` SHALL navigate to `/login`.
3. WHEN a `Guest_User` clicks the "Mulai Sekarang" button in the CTA card on the `Beranda`, THE `App_Router` SHALL navigate to `/tentang` (the `Onboarding_Page`) to show value propositions before redirecting to login.
4. WHEN a `Guest_User` clicks the "Lihat Semua" link next to the "Tutorial Terbaru" section on the `Beranda`, THE `App_Router` SHALL navigate to `/tutorial` (the new public preview page).
5. WHEN a `Guest_User` clicks the "Jelajahi Peluang Karir Lainnya →" button in the lowongan section of the `Beranda`, THE `App_Router` SHALL navigate to `/lowongan`.
6. THE feature cards on the `Beranda` ("Portal Karir", "Tutorial Skill", "Bangun Profil") SHALL navigate `Guest_User` to `/lowongan`, `/tutorial`, and `/tentang` respectively, instead of the protected `/masa-depan`, `/tutorial` (unchanged), and `/profil`.

---

### Requirement 7: Persistensi Halaman Asal Setelah Login

**User Story:** Sebagai seorang siswa SMK yang mengklik login setelah melihat lowongan yang menarik, saya ingin setelah login langsung kembali ke halaman atau konten yang sedang saya lihat, sehingga saya tidak perlu mencarinya kembali dari awal.

#### Acceptance Criteria

1. WHEN a `Guest_User` is redirected to `/login` after clicking a `Login_Prompt_Modal` action button, THE `App_Router` SHALL preserve the current page path and relevant state (e.g., selected job ID) as a `returnTo` query parameter in the URL (e.g., `/login?returnTo=/lowongan&jobId=123`).
2. WHEN an `Authenticated_User` successfully completes login and a valid `returnTo` parameter exists in the URL, THE `App_Router` SHALL navigate to the `returnTo` path instead of the default `/masa-depan`.
3. IF the `returnTo` parameter value begins with `/admin`, contains `://`, or begins with `//`, THEN THE `App_Router` SHALL ignore the `returnTo` parameter and navigate to the default `/masa-depan` as a security measure.
4. WHEN the `Login_Prompt_Modal` is triggered from the lowongan detail modal with a specific job selected, THE redirect to `/login` SHALL include a `jobId` query parameter so the job detail can be restored after login.

---

### Requirement 8: Aksesibilitas dan Performa Halaman Publik

**User Story:** Sebagai seorang siswa SMK dengan perangkat dan koneksi internet yang beragam, saya ingin halaman-halaman publik BIKA tetap cepat diakses dan mudah digunakan, sehingga saya mendapatkan pengalaman yang baik terlepas dari kondisi perangkat saya.

#### Acceptance Criteria

1. THE public pages (`/lowongan`, `/tutorial`, `/tentang`) SHALL fetch data from the API only once per page load, using React `useEffect` with an empty dependency array to prevent duplicate API calls.
2. WHEN a public page is loading data from the API, THE `Preview_Page` SHALL display skeleton loading placeholders for each content card. WHEN the API call completes, THE skeleton placeholders SHALL be replaced immediately with actual content cards without waiting for additional rendering cycles.
3. THE `Login_Prompt_Modal` SHALL be keyboard-navigable: the "Nanti saja" dismiss button, "Login dengan Google" button, dan "Daftar Gratis" button SHALL be reachable and activatable using the Tab key and Enter/Space keys.
4. THE `Login_Prompt_Modal` SHALL trap keyboard focus within the modal while it is open, preventing focus from moving to background content.
5. WHEN the `Login_Prompt_Modal` is closed, THE focus SHALL return to the element that triggered the modal.
6. THE public pages SHALL render all interactive elements (buttons, links, filter dropdowns) with appropriate ARIA labels and roles to support screen reader accessibility.
7. THE new public routes SHALL be included in the `App_Router` under the existing public `<Route element={<Layout />}>` wrapper to ensure consistent Navbar and Footer rendering.
