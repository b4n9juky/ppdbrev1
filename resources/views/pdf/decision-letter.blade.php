<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Keputusan Kelulusan</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 10px;
        }
        .kop-surat {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .kop-surat img {
            max-height: 90px;
            display: block;
            margin: 0 auto 5px auto;
        }
        .kop-surat h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
        }
        .kop-surat p {
            font-size: 10pt;
            margin: 2px 0;
        }
        .title {
            text-align: center;
            font-size: 13pt;
            font-weight: bold;
            text-decoration: underline;
            margin: 15px 0 3px 0;
            text-transform: uppercase;
        }
        .subtitle {
            text-align: center;
            font-size: 11pt;
            margin: 0 0 20px 0;
        }
        .content {
            text-align: justify;
            margin-bottom: 20px;
        }
        .content p {
            margin: 10px 0;
            text-indent: 30px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        .info-table td {
            padding: 4px 8px;
            vertical-align: top;
        }
        .info-table td.label {
            font-weight: bold;
            width: 160px;
        }
        .info-table td.colon {
            width: 10px;
        }
        .score-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        .score-table th, .score-table td {
            border: 1px solid #000;
            padding: 5px 8px;
            text-align: center;
        }
        .score-table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .decision-box {
            text-align: center;
            margin: 25px auto;
            padding: 12px;
            border: 2px solid #000;
            width: 80%;
        }
        .decision-box h3 {
            font-size: 14pt;
            font-weight: bold;
            margin: 0;
            letter-spacing: 1px;
        }
        .decision-box p {
            font-size: 10pt;
            margin: 5px 0 0 0;
        }
        .footer-table {
            width: 100%;
            margin-top: 30px;
        }
        .footer-left {
            width: 40%;
            text-align: left;
            padding-top: 10px;
        }
        .photo-box {
            border: 1px solid #ccc;
            padding: 4px;
            background: #fff;
            display: inline-block;
        }
        .photo-box img {
            width: 4cm;
            height: 6cm;
            object-fit: cover;
            display: block;
        }
        .signature-col {
            text-align: right;
        }
        .signature-area {
            display: inline-block;
            text-align: center;
            min-width: 220px;
        }
        .signature-date {
            margin-bottom: 5px;
        }
        .signature-title {
            margin-bottom: 55px;
        }
        .stamp-overlay {
            position: relative;
            display: inline-block;
            height: 60px;
            margin-bottom: 10px;
        }
        .signature-img {
            max-height: 55px;
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
        }
        .stamp-img {
            max-height: 75px;
            position: absolute;
            top: -25px;
            left: 20px;
            z-index: 1;
            opacity: 0.75;
        }
        .headmaster-name {
            font-weight: bold;
            text-decoration: underline;
            margin: 0;
        }
        .headmaster-nip {
            font-size: 9pt;
            margin: 2px 0 0 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Kop Surat -->
        <div class="kop-surat">
            @if($kop_surat_base64)
                <img src="{{ $kop_surat_base64 }}" alt="Kop Surat">
            @else
                <h1>{{ $madrasah->madrasah_name ?? 'MADRASAH ALIYAH' }}</h1>
                <p>{{ $madrasah->address ?? '' }}</p>
                <p>Telp: {{ $madrasah->contact ?? '' }}</p>
            @endif
        </div>

        <h2 class="title">SURAT KEPUTUSAN KELULUSAN</h2>
        <p class="subtitle">
            Nomor: 421.3/{{ str_pad($registration->id, 4, '0', STR_PAD_LEFT) }}/PPDB/{{ str_replace('/', '-', $registration->academicYear->name ?? date('Y')) }}
        </p>

        <div class="content">
            <p>
                Yang bertanda tangan di bawah ini, Panitia PPDB {{ $registration->academicYear->name ?? '' }} 
                {{ $madrasah->madrasah_name ?? 'Madrasah Aliyah' }}, 
                menerangkan bahwa calon peserta didik baru:
            </p>

            <table class="info-table">
                <tbody>
                    <tr>
                        <td class="label">Nama Lengkap</td>
                        <td class="colon">:</td>
                        <td>{{ $registration->studentBiodata->full_name ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="label">NISN</td>
                        <td class="colon">:</td>
                        <td>{{ $registration->studentBiodata->nisn ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="label">Tempat, Tanggal Lahir</td>
                        <td class="colon">:</td>
                        <td>
                            {{ $registration->studentBiodata->birth_place ?? '-' }}, 
                            {{ $registration->studentBiodata->birth_date ? $registration->studentBiodata->birth_date->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') : '-' }}
                        </td>
                    </tr>
                    <tr>
                        <td class="label">Asal Sekolah</td>
                        <td class="colon">:</td>
                        <td>{{ $registration->studentBiodata->previous_school ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="label">Jalur Pendaftaran</td>
                        <td class="colon">:</td>
                        <td>{{ $registration->admissionPath->name ?? '-' }}</td>
                    </tr>
                </tbody>
            </table>

            @if($registration->subjectScores && $registration->subjectScores->count() > 0)
                <p>Berdasarkan hasil seleksi administrasi dan ujian masuk, dengan pencapaian nilai sebagai berikut:</p>
                <table class="score-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;">No</th>
                            <th>Mata Pelajaran</th>
                            <th>Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($registration->subjectScores as $index => $score)
                            <tr>
                                <td>{{ $index + 1 }}</td>
                                <td style="text-align: left;">{{ $score->subject->name ?? '-' }}</td>
                                <td>{{ $score->scores ?? '-' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif

            <p>
                @if($registration->total_score !== null)
                    Total Nilai Seleksi: <strong>{{ number_format($registration->total_score, 2) }}</strong>.
                @endif
                Berdasarkan evaluasi kriteria kelulusan Penerimaan Peserta Didik Baru (PPDB), maka dengan ini dinyatakan:
            </p>
        </div>

        <!-- Decision Box -->
        <div class="decision-box">
            @if($registration->status === 'accepted')
                <h3>DITERIMA</h3>
            @elseif($registration->status === 'reserve')
                <h3>DITETAPKAN SEBAGAI CADANGAN</h3>
                <p>Status dapat dinaikkan menjadi diterima jika terdapat kuota yang tersedia.</p>
            @else
                <h3>DITOLAK</h3>
            @endif
        </div>

        <!-- Signature Section -->
        <table class="footer-table">
            <tr>
                <td class="footer-left">
                    @if($photo)
                        <div class="photo-box">
                            <img src="{{ $photo }}" alt="Pas Foto">
                        </div>
                    @endif
                </td>
                <td class="signature-col">
                    <div class="signature-area">
                        <div class="signature-date">
                            {{ \Carbon\Carbon::now()->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') }}
                        </div>
                        <div class="signature-title">
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
</body>
</html>
