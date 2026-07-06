<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Biodata Siswa</title>
    <style>
        @page { margin: 20px 30px 30px 30px; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #0d1c2e;
        }

        .container { max-width: 800px; margin: 0 auto; padding: 10px; }

        .kop-surat {
            text-align: center;
            padding-bottom: 14px;
            margin-bottom: 12px;
            border-bottom: 3px double #00355f;
        }
        .kop-surat img { max-height: 90px; display: block; margin: 0 auto 6px auto; }
        .kop-surat h1 {
            font-family: 'Trebuchet MS', 'Arial Black', Arial, sans-serif;
            font-size: 16pt; font-weight: 700;
            color: #00355f; text-transform: uppercase;
            letter-spacing: 0.03em; margin: 0;
        }
        .kop-surat p { font-size: 9pt; color: #42474f; margin: 1px 0; }

        .header-section {
            border-bottom: 2px solid #45683b;
            padding-bottom: 10px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .header-section h2 {
            font-family: 'Trebuchet MS', 'Arial Black', Arial, sans-serif;
            font-size: 16pt; font-weight: 700;
            color: #45683b; text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .header-section .subtitle { font-size: 8pt; color: #6b6a33; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
        .header-section .meta { text-align: right; font-size: 7pt; color: #767d71; }

        .card {
            background: #ffffff;
            border: 1px solid #c2c7d1;
            border-radius: 6px;
            padding: 18px 20px;
            margin-bottom: 14px;
        }
        .card-title {
            display: flex;
            align-items: center;
            gap: 8px;
            padding-bottom: 10px;
            margin-bottom: 12px;
            border-bottom: 1px solid #e0e4ea;
            font-size: 10pt;
            font-weight: 700;
            color: #45683b;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }

        .main-layout { width: 100%; border-collapse: collapse; }
        .main-layout td { vertical-align: top; padding: 0; }
        .left-col { width: 65%; padding-right: 16px; }
        .right-col { width: 35%; padding-left: 16px; border-left: 1px solid #e0e4ea; }

        .data-grid { width: 100%; border-collapse: collapse; }
        .data-grid td { padding: 3px 4px; vertical-align: top; }
        .data-grid .label {
            font-size: 6.5pt; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.06em; color: #6b6a33; padding-bottom: 1px;
        }
        .data-grid .value {
            font-size: 9pt; color: #0d1c2e; padding-top: 0;
            padding-bottom: 6px;
        }

        .photo-box {
            width: 140px; margin: 0 auto 10px auto;
            border: 1px solid #c2c7d1; padding: 3px;
            border-radius: 4px; text-align: center;
        }
        .photo-box img { width: 100%; display: block; border-radius: 2px; }
        .photo-box .placeholder {
            width: 100%; height: 180px; background: #f1f5ea;
            line-height: 180px; color: #adb4a7;
            font-size: 7pt; text-align: center;
        }
        .photo-label {
            text-align: center; font-size: 6.5pt; font-weight: 600;
            color: #6b6a33; text-transform: uppercase;
            letter-spacing: 0.06em; margin-top: 4px;
        }

        .family-grid { width: 100%; border-collapse: collapse; }
        .family-grid td { width: 33.33%; vertical-align: top; padding: 10px; }
        .family-card {
            border: 1px solid #d7e7cd;
            border-radius: 4px;
            background: #f8faf1;
            padding: 12px;
        }
        .family-card h4 {
            font-size: 8pt; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.06em; color: #45683b;
            padding-bottom: 6px; margin-bottom: 8px;
            border-bottom: 1px solid #d7e7cd;
        }
        .family-card .row { margin-bottom: 6px; }
        .family-card .row .lbl {
            font-size: 6.5pt; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.04em; color: #6b6a33; display: block;
        }
        .family-card .row .val {
            font-size: 9pt; color: #0d1c2e; display: block;
        }
        .siblings-box {
            text-align: center; padding: 12px;
            border: 1px solid #45683b; border-radius: 4px;
            background: #ebffdf;
        }
        .siblings-box .count {
            font-size: 36pt; font-weight: 700; color: #45683b; line-height: 1;
        }
        .siblings-box .lbl {
            font-size: 7pt; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.06em; color: #6b6a33; margin-top: 4px;
        }

        .footer { text-align: center; padding-top: 16px; }
        .footer p { font-size: 7pt; color: #767d71; }
    </style>
</head>
<body>
    <div class="container">
        <div class="kop-surat">
            @if($kop_surat_base64)
                <img src="{{ $kop_surat_base64 }}" alt="Kop Surat">
            @else
                <h1>{{ $madrasah?->madrasah_name ?? 'MADRASAH ALIYAH' }}</h1>
                <p>{{ $madrasah?->address ?? '' }} {{ $madrasah?->kota ? ', ' . $madrasah->kota : '' }} {{ $madrasah?->propinsi ? ', ' . $madrasah->propinsi : '' }}</p>
                <p>{{ $madrasah?->contact ?? '' }}</p>
            @endif
        </div>

        <div class="header-section">
            <div>
                <h2>Laporan Biodata Siswa</h2>
                <p class="subtitle">Penerimaan Peserta Didik Baru (PPDB) Online</p>
            </div>
            <div class="meta">
                <p>Dicetak pada: {{ \Carbon\Carbon::now()->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') }}</p>
                <p>ID Pendaftaran: #PPDB-{{ str_pad($registration->id, 5, '0', STR_PAD_LEFT) }}</p>
            </div>
        </div>

        <div class="card">
            <div class="card-title">&#9679; Informasi Pribadi</div>
            <table class="main-layout">
                <tr>
                    <td class="left-col">
                        <table class="data-grid">
                            <tr>
                                <td style="width:50%;">
                                    <div class="label">Nama Lengkap</div>
                                    <div class="value" style="font-weight:600;font-size:11pt;color:#00355f;">{{ strtoupper($bio->full_name ?? '-') }}</div>
                                </td>
                                <td style="width:50%;">
                                    <div class="label">NISN</div>
                                    <div class="value" style="font-family:'Courier New',monospace;">{{ $bio->nisn ?? '-' }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="label">NIK</div>
                                    <div class="value" style="font-family:'Courier New',monospace;">{{ $bio->nik ?? '-' }}</div>
                                </td>
                                <td>
                                    <div class="label">Jenis Kelamin</div>
                                    <div class="value">{{ $bio->gender === 'male' ? 'Laki-laki' : ($bio->gender === 'female' ? 'Perempuan' : '-') }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="label">Tempat, Tanggal Lahir</div>
                                    <div class="value">
                                        {{ $bio->birth_place ?? '-' }}{{ $bio->birth_place && $bio->birth_date ? ', ' : '' }}
                                        {{ $bio->birth_date ? \Carbon\Carbon::parse($bio->birth_date)->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') : '' }}
                                    </div>
                                </td>
                                <td>
                                    <div class="label">Agama</div>
                                    <div class="value">Islam</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="label">No. HP / WhatsApp</div>
                                    <div class="value" style="font-family:'Courier New',monospace;">{{ $bio->phone_number ?? '-' }}</div>
                                </td>
                                <td>
                                    <div class="label">Email</div>
                                    <div class="value">{{ $registration->user->email ?? '-' }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <div class="label">Alamat Lengkap</div>
                                    <div class="value">
                                        {{ $bio->address ?? '-' }}{{ $bio->subdistrict ? ', Kel. ' . $bio->subdistrict : '' }}{{ $bio->district ? ', Kec. ' . $bio->district : '' }}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="label">Anak Ke / Jumlah Saudara</div>
                                    <div class="value">{{ $bio->child_order ?? '-' }} dari {{ $bio->siblings_count ?? '-' }} bersaudara</div>
                                </td>
                                <td>
                                    <div class="label">Status Anak</div>
                                    <div class="value">{{ $bio->student_status ?? '-' }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="label">Tinggal Dengan</div>
                                    <div class="value">{{ $bio->living_status ?? '-' }} ({{ $bio->distance_to_school ?? '-' }})</div>
                                </td>
                                <td>
                                    <div class="label">Gol. Darah / Kelainan</div>
                                    <div class="value">{{ $bio->blood_type ?? '-' }} / {{ $bio->disability ?: 'Tidak Ada' }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <div class="label">Asal Sekolah</div>
                                    <div class="value">
                                        {{ $bio->previous_school ?? '-' }} ({{ $bio->previous_school_status ?? '-' }})
                                        @if($bio->previous_school_npsn) &mdash; NPSN: {{ $bio->previous_school_npsn }}@endif
                                    </div>
                                </td>
                            </tr>
                            @if($bio->previous_school_address)
                            <tr>
                                <td colspan="2">
                                    <div class="label">Alamat Sekolah Asal</div>
                                    <div class="value">
                                        {{ $bio->previous_school_address ?? '-' }}
                                        {{ $bio->previous_school_subdistrict ? ', ' . $bio->previous_school_subdistrict : '' }}
                                        {{ $bio->previous_school_district ? ', ' . $bio->previous_school_district : '' }}
                                        {{ $bio->previous_school_city ? ', ' . $bio->previous_school_city : '' }}
                                    </div>
                                </td>
                            </tr>
                            @endif
                        </table>
                    </td>
                    <td class="right-col" style="text-align:center;">
                        <div class="photo-box">
                            @if($photo)
                                <img src="{{ $photo }}" alt="Pas Foto">
                            @else
                                <div class="placeholder">FOTO</div>
                            @endif
                        </div>
                        <p class="photo-label">Pas Foto 3x4</p>
                    </td>
                </tr>
            </table>
        </div>

        @if($parent)
        <div class="card">
            <div class="card-title">&#9679; Informasi Keluarga</div>
            <table class="family-grid">
                <tr>
                    <td>
                        <div class="family-card">
                            <h4>Data Ayah</h4>
                            <div class="row">
                                <span class="lbl">Nama Lengkap</span>
                                <span class="val">{{ $parent->father_name ?? '-' }}</span>
                            </div>
                            <div class="row">
                                <span class="lbl">NIK</span>
                                <span class="val" style="font-family:'Courier New',monospace;">{{ $parent->father_nik ?? '-' }}</span>
                            </div>
                            @if($parent->father_birth_place || $parent->father_birth_date)
                            <div class="row">
                                <span class="lbl">Tempat, Tanggal Lahir</span>
                                <span class="val">
                                    {{ $parent->father_birth_place ?? '-' }}{{ $parent->father_birth_place && $parent->father_birth_date ? ', ' : '' }}
                                    {{ $parent->father_birth_date ? \Carbon\Carbon::parse($parent->father_birth_date)->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') : '' }}
                                </span>
                            </div>
                            @endif
                            <div class="row">
                                <span class="lbl">Pendidikan / Status</span>
                                <span class="val">{{ $parent->father_education ?? '-' }} ({{ $parent->father_status ?? '-' }})</span>
                            </div>
                            @if($parent->father_status === 'Masih Hidup')
                            <div class="row">
                                <span class="lbl">Pekerjaan / Penghasilan</span>
                                <span class="val">{{ $parent->father_occupation ?? '-' }} / {{ $parent->father_income ?? '-' }}</span>
                            </div>
                            <div class="row">
                                <span class="lbl">No. HP</span>
                                <span class="val" style="font-family:'Courier New',monospace;">{{ $parent->father_phone ?? '-' }}</span>
                            </div>
                            @endif
                            @if($parent->father_address)
                            <div class="row">
                                <span class="lbl">Alamat</span>
                                <span class="val">{{ $parent->father_address ?? '-' }}</span>
                            </div>
                            @endif
                        </div>
                    </td>
                    <td>
                        <div class="family-card">
                            <h4>Data Ibu</h4>
                            <div class="row">
                                <span class="lbl">Nama Lengkap</span>
                                <span class="val">{{ $parent->mother_name ?? '-' }}</span>
                            </div>
                            <div class="row">
                                <span class="lbl">NIK</span>
                                <span class="val" style="font-family:'Courier New',monospace;">{{ $parent->mother_nik ?? '-' }}</span>
                            </div>
                            @if($parent->mother_birth_place || $parent->mother_birth_date)
                            <div class="row">
                                <span class="lbl">Tempat, Tanggal Lahir</span>
                                <span class="val">
                                    {{ $parent->mother_birth_place ?? '-' }}{{ $parent->mother_birth_place && $parent->mother_birth_date ? ', ' : '' }}
                                    {{ $parent->mother_birth_date ? \Carbon\Carbon::parse($parent->mother_birth_date)->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') : '' }}
                                </span>
                            </div>
                            @endif
                            <div class="row">
                                <span class="lbl">Pendidikan / Status</span>
                                <span class="val">{{ $parent->mother_education ?? '-' }} ({{ $parent->mother_status ?? '-' }})</span>
                            </div>
                            @if($parent->mother_status === 'Masih Hidup')
                            <div class="row">
                                <span class="lbl">Pekerjaan / Penghasilan</span>
                                <span class="val">{{ $parent->mother_occupation ?? '-' }} / {{ $parent->mother_income ?? '-' }}</span>
                            </div>
                            <div class="row">
                                <span class="lbl">No. HP</span>
                                <span class="val" style="font-family:'Courier New',monospace;">{{ $parent->mother_phone ?? '-' }}</span>
                            </div>
                            @endif
                            @if($parent->mother_address)
                            <div class="row">
                                <span class="lbl">Alamat</span>
                                <span class="val">{{ $parent->mother_address ?? '-' }}</span>
                            </div>
                            @endif
                        </div>
                    </td>
                    <td style="vertical-align:middle;">
                        <div class="siblings-box">
                            <div class="count">{{ $bio->siblings_count ?? '0' }}</div>
                            <div class="lbl">Jumlah Saudara Kandung</div>
                            <div style="margin-top:6px;font-size:6.5pt;color:#6b6a33;font-style:italic;">Data terverifikasi</div>
                        </div>

                        @if($parent->guardian_name)
                        <div class="family-card" style="margin-top:10px;">
                            <h4>Data Wali</h4>
                            <div class="row">
                                <span class="lbl">Nama Lengkap</span>
                                <span class="val">{{ $parent->guardian_name }}</span>
                            </div>
                            <div class="row">
                                <span class="lbl">NIK</span>
                                <span class="val" style="font-family:'Courier New',monospace;">{{ $parent->guardian_nik ?? '-' }}</span>
                            </div>
                            <div class="row">
                                <span class="lbl">Pendidikan / Pekerjaan</span>
                                <span class="val">{{ $parent->guardian_education ?? '-' }} / {{ $parent->guardian_occupation ?? '-' }}</span>
                            </div>
                        </div>
                        @endif
                    </td>
                </tr>
            </table>
        </div>
        @endif

        <div class="footer">
            <p>&copy; {{ date('Y') }} Portal PPDB Online. Dokumen ini dicetak dari sistem.</p>
        </div>
    </div>
</body>
</html>
