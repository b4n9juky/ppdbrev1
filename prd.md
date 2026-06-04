# PRODUCT REQUIREMENTS DOCUMENT (PRD) - REVISI V2

**Project Name:** Sistem Aplikasi PPDB (Penerimaan Peserta Didik Baru) Madrasah Aliyah
**Target Implementation:** Siklus Tahun Ajaran 2026/2027
**Architecture:** Monolithic SPA (Single Page Application)
**Tech Stack:** Laravel (Backend), Inertia.js (Connector), React.js (Frontend), Tailwind CSS & Shadcn UI (Styling).

---

## 1. Executive Summary

Aplikasi PPDB Madrasah Aliyah adalah platform berbasis web untuk mengelola penerimaan siswa baru secara *end-to-end*. Aplikasi ini menangani publikasi informasi (*landing page*), registrasi siswa, pengunggahan dokumen, hingga manajemen kelulusan oleh admin dengan mempertimbangkan kuota jalur pendaftaran dan sistem cadangan. Arsitektur backend dirancang menggunakan pendekatan SRP, di mana *Model* hanya bertugas sebagai representasi data dan relasi, sementara komputasi diletakkan pada level *Controller* atau *Service*.

---

## 2. Core Architecture, Database Schema, & SRP Models

Sistem menggunakan *relational database* dengan skema dan representasi *Model* Eloquent yang ketat mematuhi *Single Responsibility Principle*.

### 2.1. Tabel Referensi Utama

| Tabel | Model | Fungsi | Fillable / Kolom | Relasi / Catatan Khusus |
| :--- | :--- | :--- | :--- | :--- |
| **`users`** | `User` | Manajemen autentikasi & otorisasi. | `name`, `email`, `password`, `role` | `hasMany(Registration)` <br> *Casts: password (hashed)* |
| **`academic_years`** | `AcademicYear` | Mengatur scope tahun pendaftaran aktif. | `name`, `is_active` | `hasMany(Registration)`, `hasMany(Subject)` <br> *Casts: is_active (boolean)* |
| **`madrasah_settings`**| `MadrasahSetting`| Konfigurasi profil dan legalitas cetak (Single Row). | `madrasah_name`, `address`, `contact`, `headmaster_name`, `headmaster_nip`, `kop_surat_path`, `signature_path`, `stamp_path` | - |
| **`admission_paths`** | `AdmissionPath` | Master data jalur pendaftaran dinamis. | `name`, `description`, `quota`, `is_active` | `hasMany(Registration)` <br> *Casts: quota (int), is_active (bool)* <br> *Accessor: getAvailableQuotaAttribute()* |
| **`subjects`** | `Subject` | Master data mata pelajaran ujian dinamis per tahun ajaran. | `academic_year_id`, `name`, `is_active` | `belongsTo(AcademicYear)`, `hasMany(SubjectScore)` <br> *Casts: is_active (bool)* |

### 2.2. Tabel Transaksional Pendaftaran

| Tabel | Model | Fungsi | Fillable / Kolom | Relasi / Catatan Khusus |
| :--- | :--- | :--- | :--- | :--- |
| **`registrations`** | `Registration` | Tabel pivot utama (Agregator) pendaftaran siswa. | `user_id`, `academic_year_id`, `admission_path_id`, `status`, `total_score` | `belongsTo` (User, AcademicYear, AdmissionPath), `hasOne` (StudentBiodata), `hasMany` (StudentDocument, SubjectScore) <br> *Casts: total_score (decimal:2)* |
| **`student_biodatas`** | `StudentBiodata` | Rincian profil calon siswa. | `registration_id`, `nisn`, `full_name`, `gender`, `birth_place`, `birth_date`, `address`, `previous_school` | `belongsTo(Registration)` <br> *Casts: birth_date (date)* |
| **`student_documents`**| `StudentDocument`| Referensi path file dokumen persyaratan. | `registration_id`, `document_type`, `file_path` | `belongsTo(Registration)` |
| **`subject_scores`** | `SubjectScore` | Pivot many-to-many untuk nilai seleksi per mata pelajaran. | `registration_id`, `subject_id`, `ijazah_score`, `test_score` | `belongsTo(Registration)`, `belongsTo(Subject)` <br> *Casts: ijazah_score (decimal:2), test_score (decimal:2)* |

---

## 3. Core Business Logic & Rules

1. **SRP Constraints:** Seluruh *Model* DILARANG berisi logika kalkulasi nilai, unggah file, atau manipulasi *state*. Operasi bisnis wajib diletakkan di *Controller* atau *Service Class* khusus (misal: `ScoringService`, `RegistrationService`).
2. **Scope Validation:** Seluruh transaksi pendaftaran, tampilan mapel, dan dasbor harus di-filter berdasarkan `academic_year_id` yang `is_active = true`.
3. **Scoring System:** Pengakumulasian skor total (`ijazah_score` + `test_score`) dilakukan di *Controller/Service* menggunakan fitur *DB Transaction* untuk menjamin konsistensi data, lalu di-update ke tabel `registrations`.
4. **Quota & Decision Support:** Kuota pada `admission_paths` HANYA berfungsi sebagai indikator panduan visual (berupa progress bar dan warning) di Dasbor Admin, TIDAK mengunci sistem secara otomatis dari pendaftar baru.
5. **Reserve System (Cadangan):** Admin dapat menentukan kelulusan siswa dengan status `accepted` (Utama) atau `reserve` (Cadangan). Siswa `reserve` dapat dinaikkan statusnya menjadi `accepted` secara manual.
6. **State Management Siswa:** Status awal `draft` berubah ke `pending` saat siswa menekan tombol finalisasi (Kirim Pendaftaran). Pasca perubahan ini, komponen UI React harus me-render form dalam mode terkunci (*read-only*).

---

## 4. Development Execution Phases (Instruksi Eksekusi Agen AI)

> **[UNTUK AI AGENT]:** Jalankan pengembangan sistem ini secara bertahap (Fase 1 hingga 5). Dilarang melompat ke fase berikutnya sebelum fase saat ini selesai diimplementasi dan dites tanpa error. Semua lapisan backend wajib mematuhi standar Single Responsibility Principle.

### Phase 1: Environment Setup, Database Modeling, & SRP Setup
1. Inisialisasi proyek Laravel (Breeze dengan React & Inertia).
2. Buat file Migration secara berurutan (Tabel Referensi lalu Transaksional) dengan Foreign Key constraints yang sesuai (`onDelete('cascade')` atau `onDelete('restrict')`).
3. Implementasikan ke-9 Model Eloquent tepat seperti spesifikasi Bab 2 (hanya memuat `$fillable`, `$casts`, dan Relations).
4. Buat Database Seeder untuk data awal (1 Admin, 1 Tahun Ajaran Aktif, 2 Jalur Pendaftaran, 2 Mata Pelajaran).

### Phase 2: Services & Backend Controllers
1. Buat `MadrasahSettingController` dengan logika penyimpanan file statis (Kop Surat, Stempel, TTD) ke Storage disk public.
2. Buat Controller CRUD standar untuk manajemen `AdmissionPath` dan `Subject` oleh Admin.
3. Buat logika komputasi nilai pada `ScoreController` (atau pisahkan ke `ScoringService`). Gunakan `DB::transaction()` untuk menyimpan array data dari frontend ke tabel `subject_scores` dan mengakumulasikan skor agregatnya langsung ke kolom `total_score` tabel `registrations`.

### Phase 3: Admin Dashboard (React + Inertia + Tailwind/Shadcn)
1. Bangun layout Dasbor Admin yang responsif.
2. Integrasikan antarmuka form pengaturan profil dan unggah berkas madrasah.
3. Buat komponen Monitoring Kuota. Kalkulasi nilai `getAvailableQuotaAttribute()` dari backend harus di-render dalam bentuk progress bar indikator keterisian, lengkap dengan sinyal peringatan jika kuota utama berlebih.
4. Tampilkan Tabel Verifikasi Pendaftar dengan dukungan sorting berdasarkan `total_score` tertinggi.
5. Buat Action Buttons dinamis untuk mengubah status pendaftaran secara manual: "Terima Utama" (`accepted`), "Jadikan Cadangan" (`reserve`), dan "Tolak" (`rejected`).

### Phase 4: Public Landing Page & Student Portal
1. Buat Landing Page informatif yang menarik data dinamis dari tabel `madrasah_settings` dan menyembunyikan tombol daftar jika tidak ada tahun ajaran aktif.
2. Buat form registrasi yang secara dinamis me-render jalur pendaftaran berstatus `is_active = true`.
3. Buat form validasi reaktif menggunakan state management React (Pilih Jalur -> Biodata -> Upload Dokumen).
4. Kunci seluruh form (*disabled inputs*) jika respon dari backend mengindikasikan status pendaftaran `!= 'draft'`.

### Phase 5: Reporting & Document Generation
1. Rancang endpoint cetak dokumen (Bukti Pendaftaran Siswa & Surat Keputusan Kelulusan).
2. Implementasikan layouting cetak (menggunakan `@media print` CSS atau paket PDF spesifik) tanpa menampilkan elemen navigasi dasbor.
3. Susun hirarki cetak: `kop_surat_path` (Header full-width) -> Konten Data -> `signature_path` bertumpuk dengan `stamp_path` di atas area penandatanganan `headmaster_name` (Footer kanan bawah).