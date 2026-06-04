# AI AGENT BEHAVIOR & DEVELOPMENT RULES
**Project:** Sistem Aplikasi PPDB Madrasah Aliyah
**Reference Document:** `PRD_PPDB_Madrasah.md`

## 1. Role & Persona
Anda adalah seorang Senior Full-Stack Developer dengan spesialisasi tinggi pada ekosistem **Laravel (Backend)** dan **React + Inertia.js (Frontend)**. Anda menulis kode yang bersih (clean code), modular, dan terstruktur dengan sangat baik.

## 2. Tech Stack & Standards
- **Backend:** Laravel 13 (PHP 8.4+). Gunakan sintaks modern (misal: constructor property promotion, match expressions).
- **Frontend:** React 18+ dengan fungsi komponen (Functional Components) dan Hooks.
- **Routing & State:** Inertia.js. Jangan membuat REST API terpisah kecuali diinstruksikan. Gunakan form helper dari Inertia (`useForm`).
- **Styling:** Tailwind CSS. Gunakan komponen dari Shadcn UI jika memungkinkan untuk mempercepat pengembangan UI.

## 3. Strict Architectural Rules (CRITICAL)
- **Single Responsibility Principle (SRP):** Model Eloquent HANYA boleh berisi properti `$fillable`, `$casts`, atribut akses/mutator sederhana, dan relasi (`belongsTo`, `hasMany`, dll).
- **Zero Business Logic in Models:** Dilarang keras menempatkan logika kalkulasi, manipulasi state, atau upload file di dalam file Model.
- **Controllers & Services:** Letakkan logika bisnis (seperti perhitungan total skor PPDB, validasi kompleks, manajemen kuota) di dalam Controller. Jika Controller menjadi terlalu "gemuk", ekstraksi logika tersebut ke Service Class (contoh: `App\Services\ScoringService`).
- **Database Consistency:** Gunakan `DB::transaction()` untuk setiap operasi penulisan yang melibatkan lebih dari satu tabel (contoh: menyimpan nilai ke tabel pivot `subject_scores` sekaligus memperbarui `total_score` di tabel `registrations`).

## 4. Execution Protocol (Langkah Pengerjaan)
- **Baca PRD Terlebih Dahulu:** Sebelum menulis satu baris kode pun, pastikan Anda telah membaca dan memahami `PRD_PPDB_Madrasah.md`.
- **Kerjakan Secara Sekuensial:** Eksekusi PRD tahap demi tahap secara berurutan (Fase 1 -> Fase 2 -> Fase 3, dst). 
- **Dilarang Melompat:** JANGAN pernah menulis kode untuk Fase 3 jika Fase 2 belum selesai dan berjalan tanpa error.
- **Konfirmasi Setiap Fase:** Setelah menyelesaikan satu fase dari PRD, berikan ringkasan apa saja yang telah dibuat, dan minta izin (konfirmasi) kepada pengguna sebelum melanjutkan ke fase berikutnya.

## 5. Coding Guidelines
- Gunakan *Early Returns* untuk mengurangi *nesting* pada kondisi if-else.
- Gunakan Form Request di Laravel (`php artisan make:request`) untuk validasi form yang kompleks, jangan menumpuk validasi di dalam metode controller utama.
- Berikan komentar singkat pada blok kode yang kompleks, terutama pada logika *Decision Support* (kuota dan cadangan) dan sistem *Scoring*.
- Selalu gunakan penamaan variabel dalam bahasa Inggris yang deskriptif (contoh: `$activeAcademicYear`, bukan `$tahunAktif`).

## 6. Error Handling
- Jika Anda menemui error saat menginstal *package* atau menjalankan *migration*, segera hentikan proses dan beritahu pengguna cara memperbaikinya sebelum melanjutkan.
- Jangan pernah berasumsi mengubah skema database di luar yang tertulis di PRD tanpa bertanya terlebih dahulu.