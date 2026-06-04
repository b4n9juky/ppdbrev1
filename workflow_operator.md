# Implementasi Fitur Assignment Operator PPDB

## Konteks Aplikasi

Aplikasi PPDB menggunakan:

* Backend: Laravel 13
* Frontend: React + Vite
* Database: MySQL
* Authentication: sudah tersedia
* hanya memiliki User memiliki role admin dan student

Saat ini semua alur bisnis dilakukan dengan user role admin sehingga data pendaftar bisa terjadi bentrok ketika dua user dengan role admin memproses pendaftar yang sama. Oleh karena itu, perlu ada penambahan user dengan role operator untuk memproses pendaftar. Sistem baru harus memiliki alur sebagai berikut:

Belum Diproses
→ Diambil Operator
→ Diproses
→ Selesai

Aturan bisnis:

1. Semua operator dapat melihat seluruh data pendaftar.
2. Operator hanya dapat mengedit pendaftar yang sedang menjadi tanggung jawabnya.
3. Operator dapat mengambil pendaftar yang belum diproses.
4. Setelah diambil, pendaftar terkunci dari operator lain.
5. Operator lain tetap dapat melihat data tetapi tidak dapat mengubahnya.
6. Setelah proses selesai, status menjadi selesai dan nama operator yang memproses tetap tersimpan.
7. Admin dapat mengubah data apa pun dan dapat mengambil alih assignment jika diperlukan.

---

## Perubahan Database

Tambahkan kolom pada tabel pendaftars:

* assigned_operator_id (nullable foreign key ke users)
* assigned_at (nullable timestamp)
* processing_status

Enum processing_status:

* baru
* diproses
* selesai

Buat migration baru, jangan mengubah migration lama.

Tambahkan relasi Eloquent:

Pendaftar.php

```php
public function assignedOperator()
{
    return $this->belongsTo(User::class, 'assigned_operator_id');
}
```

User.php

```php
public function assignedPendaftars()
{
    return $this->hasMany(Pendaftar::class, 'assigned_operator_id');
}
```

---

## Authorization

Buat Policy untuk model Pendaftar.

Rules:

Admin:

* viewAny = true
* view = true
* update = true

Operator:

* viewAny = true
* view = true
* update hanya jika:

```php
$pendaftar->assigned_operator_id === auth()->id()
```

---

## Endpoint Backend

### Ambil Pendaftar

POST

```http
/pendaftars/{id}/claim
```

Behavior:

* hanya operator
* hanya dapat mengambil data dengan status "baru"
* gunakan DB transaction
* gunakan lockForUpdate()
* isi:

```php
assigned_operator_id = auth()->id();
assigned_at = now();
processing_status = 'diproses';
```

Return JSON success.

---

### Selesaikan Proses

POST

```http
/pendaftars/{id}/complete
```

Behavior:

* hanya operator yang ditugaskan
* ubah status menjadi:

```php
processing_status = 'selesai';
```

---

### Lepaskan Assignment

POST

```http
/pendaftars/{id}/release
```

Behavior:

* hanya operator yang ditugaskan atau admin
* set:

```php
assigned_operator_id = null;
assigned_at = null;
processing_status = 'baru';
```

---

## Frontend React

Pada halaman daftar pendaftar tampilkan kolom:

* Status
* Operator Penanggung Jawab

Contoh:

| Nama   | Status   | Operator   |
| ------ | -------- | ---------- |
| Ahmad  | Baru     | -          |
| Siti   | Diproses | Operator A |
| Rahman | Selesai  | Operator B |

---

## Badge Status

baru:

* warna abu-abu

diproses:

* warna kuning

selesai:

* warna hijau

---

## Tombol Aksi

Jika status = baru

Tampilkan:

```text
Ambil
```

Jika status = diproses dan assigned_operator_id = user login

Tampilkan:

```text
Lanjutkan
Selesaikan
Lepaskan
```

Jika status = diproses dan assigned_operator_id != user login

Tampilkan:

```text
Sedang diproses operator lain
```

tanpa tombol edit.

Jika status = selesai

Tampilkan:

```text
Lihat
```

---

## Filter Data

Tambahkan filter:

* Semua Data
* Belum Diproses
* Sedang Saya Proses
* Selesai

---

## Audit Log

Catat aktivitas berikut:

* mengambil pendaftar
* melepaskan pendaftar
* menyelesaikan pendaftar

Format:

```php
user_id
pendaftar_id
action
description
created_at
```

---

## Race Condition

Pastikan dua operator tidak dapat mengambil pendaftar yang sama secara bersamaan.

Gunakan:

```php
DB::transaction()
```

dan

```php
lockForUpdate()
```

pada proses claim.

---

## Kualitas Kode

* Gunakan Laravel Policy
* Gunakan Form Request untuk validasi
* Gunakan Service Class untuk business logic assignment
* Gunakan React hooks yang sudah digunakan pada proyek
* Gunakan TypeScript apabila proyek React sudah menggunakan TypeScript
* Jangan merusak fitur PPDB yang sudah ada
* Buat migration, policy, controller, service, route, React component, dan update UI yang diperlukan
* Sertakan seluruh kode implementasi yang dibutuhkan
