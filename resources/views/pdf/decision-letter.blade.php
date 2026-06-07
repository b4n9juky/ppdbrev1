<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Surat Keputusan Kelulusan PPDB</title>
    <style>
        @page {
            margin: 20px 30px 30px 30px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #0d1c2e;
            background: #f8f9ff;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 10px;
        }

        .kop-surat {
            text-align: center;
            padding-bottom: 14px;
            margin-bottom: 18px;
            border-bottom: 3px double #00355f;
        }
        .kop-surat img {
            max-height: 90px;
            display: block;
            margin: 0 auto 6px auto;
        }
        .kop-surat h1 {
            font-family: 'Trebuchet MS', 'Arial Black', Arial, sans-serif;
            font-size: 16pt;
            font-weight: 700;
            color: #00355f;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            margin: 0;
        }
        .kop-surat p {
            font-size: 9pt;
            color: #42474f;
            margin: 1px 0;
        }

        .title-section {
            text-align: center;
            margin-bottom: 20px;
        }
        .title-section h2 {
            font-family: 'Trebuchet MS', 'Arial Black', Arial, sans-serif;
            font-size: 16pt;
            font-weight: 700;
            color: #00355f;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }
        .title-section .doc-number {
            font-size: 10pt;
            color: #42474f;
            margin-top: 3px;
        }

        .card {
            background: #ffffff;
            border: 1px solid #c2c7d1;
            border-radius: 6px;
            padding: 24px;
            margin-bottom: 18px;
        }

        .content-text {
            text-align: justify;
            margin-bottom: 18px;
            font-size: 10.5pt;
            line-height: 1.7;
        }
        .content-text p {
            margin: 8px 0;
            text-indent: 28px;
        }

        .data-grid {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0 16px 0;
        }
        .data-grid td {
            padding: 5px 6px;
            vertical-align: top;
        }
        .data-grid .label {
            font-size: 7.5pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #42474f;
            padding-bottom: 1px;
        }
        .data-grid .value {
            font-size: 10pt;
            color: #0d1c2e;
            padding-top: 1px;
            padding-bottom: 8px;
        }
        .data-grid .full-name {
            font-family: 'Trebuchet MS', 'Arial Black', Arial, sans-serif;
            font-size: 14pt;
            font-weight: 600;
            color: #00355f;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            padding-bottom: 6px;
        }
        .data-grid .value-mono {
            font-family: 'Courier New', 'Lucida Console', monospace;
            font-size: 9.5pt;
        }

        .score-section {
            margin: 16px 0;
        }
        .score-section p {
            font-size: 10pt;
            margin-bottom: 8px;
            text-align: justify;
        }
        .score-table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
        }
        .score-table th {
            background: #dce9ff;
            color: #00355f;
            font-size: 9pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            padding: 7px 10px;
            text-align: center;
            border: 1px solid #b0c9e8;
        }
        .score-table td {
            padding: 6px 10px;
            text-align: center;
            font-size: 10pt;
            border: 1px solid #c2c7d1;
        }
        .score-table td.subject-name {
            text-align: left;
        }
        .score-table tbody tr:nth-child(even) {
            background: #f0f4ff;
        }
        .score-total {
            text-align: right;
            font-size: 10pt;
            margin-top: 6px;
            font-weight: 600;
        }

        .decision-box {
            text-align: center;
            margin: 22px auto;
            padding: 14px 18px;
            width: 75%;
            border-radius: 6px;
        }
        .decision-accepted {
            border: 2.5px solid #065f46;
            background: rgba(209, 250, 229, 0.35);
        }
        .decision-reserve {
            border: 2.5px solid #92400e;
            background: rgba(254, 243, 199, 0.35);
        }
        .decision-rejected {
            border: 2.5px solid #991b1b;
            background: rgba(254, 226, 226, 0.35);
        }
        .decision-default {
            border: 2.5px solid #727780;
            background: rgba(229, 231, 235, 0.35);
        }
        .decision-box h3 {
            font-family: 'Trebuchet MS', 'Arial Black', Arial, sans-serif;
            font-size: 16pt;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }
        .decision-accepted h3 { color: #065f46; }
        .decision-reserve h3 { color: #92400e; }
        .decision-rejected h3 { color: #991b1b; }
        .decision-default h3 { color: #374151; }
        .decision-box p {
            font-size: 9pt;
            color: #42474f;
            margin: 4px 0 0 0;
            line-height: 1.4;
        }

        .footer-divider {
            border: none;
            border-top: 1px solid #d5e3fc;
            margin: 16px 0 14px 0;
        }

        .signature-table {
            width: 100%;
            border-collapse: collapse;
        }
        .signature-table td {
            vertical-align: bottom;
            padding: 4px 6px;
        }
        .signature-left {
            width: 35%;
            text-align: left;
        }
        .signature-right {
            width: 65%;
            text-align: right;
        }

        .photo-box {
            width: 130px;
            border: 1px solid #c2c7d1;
            padding: 3px;
            background: #f8f9ff;
            border-radius: 3px;
            display: inline-block;
        }
        .photo-box img {
            width: 100%;
            height: 175px;
            object-fit: cover;
            display: block;
        }

        .signature-box {
            display: inline-block;
            text-align: center;
        }
        .signature-box .date-text {
            font-size: 10pt;
            margin-bottom: 2px;
        }
        .signature-box .title-text {
            font-size: 9pt;
            color: #42474f;
            margin-bottom: 48px;
            line-height: 1.4;
        }

        .stamp-overlay {
            position: relative;
            display: inline-block;
            height: 60px;
            margin-bottom: 8px;
            width: 160px;
        }
        .stamp-overlay .signature-img {
            max-height: 52px;
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
        }
        .stamp-overlay .stamp-img {
            max-height: 70px;
            position: absolute;
            top: -22px;
            left: 18px;
            z-index: 1;
            opacity: 0.7;
        }

        .signature-box .name-text {
            font-weight: 700;
            text-decoration: underline;
            font-size: 10pt;
            margin: 0;
        }
        .signature-box .nip-text {
            font-size: 8pt;
            color: #42474f;
            margin: 1px 0 0 0;
        }

        @media print {
            body {
                background: white;
            }
            .card {
                box-shadow: none !important;
                border: 1px solid #c2c7d1;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="kop-surat">
            @if($kop_surat_base64)
                <img src="{{ $kop_surat_base64 }}" alt="Kop Surat">
            @else
                <h1>{{ $madrasah->madrasah_name ?? 'MADRASAH ALIYAH' }}</h1>
                <p>{{ $madrasah->address ?? '' }}</p>
                <p>{{ $madrasah->contact ?? '' }}</p>
            @endif
        </div>

        <div class="title-section">
            <h2>SURAT KEPUTUSAN KELULUSAN</h2>
            <div class="doc-number">
                Nomor: 421.3/{{ str_pad($registration->id, 4, '0', STR_PAD_LEFT) }}/PPDB/{{ str_replace('/', '-', $registration->academicYear->name ?? date('Y')) }}
            </div>
        </div>

        <div class="card">
            <div class="content-text">
                <p>
                    Yang bertanda tangan di bawah ini, Panitia PPDB {{ $registration->academicYear->name ?? '' }}
                    {{ $madrasah->madrasah_name ?? 'Madrasah Aliyah' }},
                    menerangkan bahwa calon peserta didik baru:
                </p>
            </div>

            <table class="data-grid">
                <tr>
                    <td colspan="2">
                        <div class="label">Nama Lengkap</div>
                        <div class="value full-name">{{ $registration->studentBiodata->full_name ?? '-' }}</div>
                    </td>
                </tr>
                <tr>
                    <td style="width:50%;">
                        <div class="label">NISN</div>
                        <div class="value value-mono">{{ $registration->studentBiodata->nisn ?? '-' }}</div>
                    </td>
                    <td style="width:50%;">
                        <div class="label">Tempat, Tanggal Lahir</div>
                        <div class="value">
                            {{ $registration->studentBiodata->birth_place ?? '-' }}{{ $registration->studentBiodata->birth_place && $registration->studentBiodata->birth_date ? ', ' : '' }}
                            {{ $registration->studentBiodata->birth_date ? $registration->studentBiodata->birth_date->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') : '' }}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="label">Asal Sekolah</div>
                        <div class="value">{{ $registration->studentBiodata->previous_school ?? '-' }}</div>
                    </td>
                    <td>
                        <div class="label">Jalur Pendaftaran</div>
                        <div class="value">{{ $registration->admissionPath->name ?? '-' }}</div>
                    </td>
                </tr>
            </table>

            @if($registration->subjectScores && $registration->subjectScores->count() > 0)
                <div class="score-section">
                    <p>Berdasarkan hasil seleksi administrasi dan ujian masuk, dengan pencapaian nilai sebagai berikut:</p>
                    <table class="score-table">
                        <thead>
                            <tr>
                                <th style="width:50px;">No</th>
                                <th>Mata Pelajaran</th>
                                <th style="width:100px;">Nilai</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($registration->subjectScores as $index => $score)
                                <tr>
                                    <td>{{ $index + 1 }}</td>
                                    <td class="subject-name">{{ $score->subject->name ?? '-' }}</td>
                                    <td>{{ $score->scores ?? '-' }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    @if($registration->total_score !== null)
                        <div class="score-total">
                            Total Nilai Seleksi: <strong>{{ number_format($registration->total_score, 2) }}</strong>
                        </div>
                    @endif
                </div>
            @endif

            <div class="content-text">
                <p>
                    Berdasarkan evaluasi kriteria kelulusan Penerimaan Peserta Didik Baru (PPDB), maka dengan ini dinyatakan:
                </p>
            </div>

            <div class="decision-box
                @if($registration->status === 'accepted') decision-accepted
                @elseif($registration->status === 'reserve') decision-reserve
                @elseif($registration->status === 'rejected') decision-rejected
                @else decision-default
                @endif">
                @if($registration->status === 'accepted')
                    <h3>DITERIMA</h3>
                @elseif($registration->status === 'reserve')
                    <h3>DITETAPKAN SEBAGAI CADANGAN</h3>
                    <p>Status dapat dinaikkan menjadi diterima jika terdapat kuota yang tersedia.</p>
                @elseif($registration->status === 'rejected')
                    <h3>DITOLAK</h3>
                @else
                    <h3>{{ strtoupper($registration->status ?? 'BELUM DITETAPKAN') }}</h3>
                @endif
            </div>

            <hr class="footer-divider">

            <table class="signature-table">
                <tr>
                    <td class="signature-left">
                        @if($photo)
                            <div class="photo-box">
                                <img src="{{ $photo }}" alt="Pas Foto">
                            </div>
                        @endif
                    </td>
                    <td class="signature-right">
                        <div class="signature-box">
                            <div class="date-text">
                                {{ \Carbon\Carbon::now()->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') }}
                            </div>
                            <div class="title-text">
                                Panitia PPDB {{ $registration->academicYear->name ?? '' }}<br>
                                {{ $madrasah->madrasah_name ?? 'Madrasah' }},
                            </div>

                            <div class="stamp-overlay">
                                @if($signature_base64)
                                    <img src="{{ $signature_base64 }}" class="signature-img" alt="Tanda Tangan">
                                @endif
                                @if($stamp_base64)
                                    <img src="{{ $stamp_base64 }}" class="stamp-img" alt="Stempel">
                                @endif
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
