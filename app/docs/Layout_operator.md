Implementasi Halaman Pendaftar dengan Quick Preview (Master-Detail Layout)
Konteks Project pada role operator

Saat ini halaman Pendaftar dengan role operator masih menggunakan tabel biasa dan operator  harus membuka halaman detail untuk melihat data pendaftar.

Saya ingin mengubah halaman menjadi model Master-Detail Layout seperti Gmail agar operator dapat melakukan verifikasi dengan cepat tanpa berpindah halaman.

Tujuan

Membuat halaman Pendaftar dengan layout 2 kolom:

Kolom Kiri

Menampilkan daftar pendaftar dalam bentuk tabel.

Fitur:

Search
Filter status
Filter jalur
Pagination
Sorting

Kolom minimal:

Foto
Nama
NISN
Jalur
Status Berkas
Status Seleksi
Operator

Ketika baris diklik:

Simpan selectedStudent
Highlight row aktif
Tampilkan detail pada panel kanan
Kolom Kanan (Sticky Preview Panel)

Panel ini selalu terlihat pada layar desktop.

Gunakan position sticky.

Menampilkan:

Identitas
Foto siswa
Nama lengkap
NISN
NIK
Jalur pendaftaran
Nomor pendaftaran
Nilai
Nilai rata-rata
Ranking sementara (jika ada)
Status

Status Berkas:

Belum Diverifikasi
Sedang Diproses
Terverifikasi
Ditolak Berkas

Status Seleksi:

Belum Dinilai
Lulus
Tidak Lulus
Dokumen

Tampilkan checklist dokumen:

✓ Kartu Keluarga

✓ Akta Kelahiran

✓ Ijazah

✓ Rapor

✗ Surat Keterangan

Setiap dokumen dapat diklik untuk preview file.

Gunakan dialog/modal.

Catatan Operator

Tambahkan textarea:

"Catatan Verifikasi"

Operator dapat menyimpan catatan.

Contoh:

Berkas kurang lengkap
Foto kurang jelas
Menunggu revisi
Tombol Aksi

Jika data belum diambil:

[ Ambil Pendaftar ]

Saat diklik:

operator_id = user login
status_operator = diproses

Jika data sudah diambil operator lain:

tampilkan informasi operator
tombol disabled

Jika data sedang diproses oleh operator login:

Tampilkan:

[ Simpan ]
[ Verifikasi ]
[ Tolak Berkas ]

Auto Next Student

Fitur utama:

Ketika operator menekan:

Verifikasi
Tolak Berkas

dan proses berhasil disimpan:

Cari pendaftar berikutnya dengan status:
Belum Diverifikasi
Belum Diproses
Otomatis pilih pendaftar tersebut.
Update panel kanan tanpa reload halaman.

Flow:

Ahmad
↓
Verifikasi
↓
Toast sukses
↓
Otomatis buka Budi
↓
Verifikasi
↓
Otomatis buka Siti

Tujuan:

Operator dapat memverifikasi ratusan data tanpa membuka halaman detail satu per satu.

Responsive Behaviour

Desktop:

Split layout 40% : 60%
Preview panel sticky

Tablet:

Split layout tetap aktif

Mobile:

Tabel full width
Preview menggunakan Drawer/Sheet dari kanan
UX Requirements

Gunakan:

Skeleton loading
Empty state
Toast notification
Confirmation dialog sebelum menolak berkas

Hindari:

Reload halaman penuh
Redirect ke halaman detail
Modal berlapis-lapis

Semua proses harus menggunakan Inertia partial reload atau React state.

Expected Components

resources/js/pages/pendaftar/index.tsx

resources/js/components/pendaftar/
├── StudentTable.tsx
├── StudentPreviewPanel.tsx
├── StudentDocuments.tsx
├── StudentStatusCard.tsx
├── StudentActions.tsx
├── StudentNotes.tsx

Output yang Diharapkan
Refactor halaman pendaftar menjadi master-detail layout.
Implement sticky preview panel.
Implement auto-next-student workflow.
Implement claim/assign operator.
Implement document preview.
Gunakan TypeScript yang strict.
Gunakan komponen Shadcn UI.
Berikan seluruh source code yang diperlukan.