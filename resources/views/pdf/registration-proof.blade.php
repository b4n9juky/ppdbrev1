<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bukti Pendaftaran</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.4;
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
            margin-bottom: 20px;
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
            margin: 15px 0 5px 0;
        }
        .subtitle {
            text-align: center;
            font-size: 10pt;
            margin-bottom: 20px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .info-table td {
            padding: 6px 8px;
            vertical-align: top;
        }
        .info-table td.label {
            font-weight: bold;
            width: 160px;
        }
        .info-table td.colon {
            width: 10px;
        }
        .footer-table {
            width: 100%;
            margin-top: 40px;
        }
        .footer-table td {
            vertical-align: top;
        }
        .footer-left {
            width: 40%;
            text-align: left;
            padding-top: 10px;
        }
        .footer-left-content {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        .photo-box {
            border: 1px solid #ccc;
            padding: 4px;
            background: #fff;
        }
        .photo-box img {
            width: 4cm;
            height: 6cm;
            object-fit: cover;
            display: block;
        }
        .qrcode-box {
            display: inline-block;
            border: 1px solid #ccc;
            padding: 8px;
            background: #fff;
        }
        .qrcode-box img {
            width: 90px;
            height: 90px;
        }
        .qrcode-text {
            font-size: 8pt;
            color: #666;
            margin-top: 4px;
            text-align: center;
        }
        .signature-col {
            width: 60%;
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

        <h2 class="title">BUKTI PENDAFTARAN PPDB</h2>
        <p class="subtitle">Tahun Ajaran {{ $registration->academicYear->name ?? '' }}</p>

        <!-- Registrant Info Table -->
        <table class="info-table">
            <tbody>
                <tr>
                    <td class="label">Nomor Pendaftaran</td>
                    <td class="colon">:</td>
                    <td>{{ str_pad($registration->id, 5, '0', STR_PAD_LEFT) }}</td>
                </tr>
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
                    <td class="label">Jenis Kelamin</td>
                    <td class="colon">:</td>
                    <td>{{ ($registration->studentBiodata->gender ?? '') === 'male' ? 'Laki-laki' : 'Perempuan' }}</td>
                </tr>
                <tr>
                    <td class="label">Alamat</td>
                    <td class="colon">:</td>
                    <td>{{ $registration->studentBiodata->address ?? '-' }}</td>
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
                <tr>
                    <td class="label">Status</td>
                    <td class="colon">:</td>
                    <td style="text-transform: capitalize;">{{ $registration->status }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Footer Section (Photo + QR Code on Left, Signature on Right) -->
        <table class="footer-table">
            <tr>
                <!-- Photo & QR Code -->
                <td class="footer-left">
                    <div class="footer-left-content">
                        @if($photo)
                            <div class="photo-box">
                                <img src="{{ $photo }}" alt="Pas Foto">
                            </div>
                        @endif
                        @if($qrcode)
                            <div class="qrcode-box">
                                <img src="data:image/svg+xml;base64,{{ $qrcode }}" alt="QR Code">
                                <div class="qrcode-text">NISN: {{ $registration->studentBiodata->nisn ?? '-' }}</div>
                            </div>
                        @endif
                    </div>
                </td>

                <!-- Signature & Stamp -->
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
