<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Bukti Pendaftaran PPDB</title>
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
            line-height: 1.5;
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
            margin-bottom: 22px;
        }
        .title-section h2 {
            font-family: 'Trebuchet MS', 'Arial Black', Arial, sans-serif;
            font-size: 18pt;
            font-weight: 700;
            color: #00355f;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }
        .title-section p {
            font-size: 10pt;
            color: #42474f;
            margin-top: 3px;
        }

        .card {
            background: #ffffff;
            border: 1px solid #c2c7d1;
            border-radius: 6px;
            padding: 22px 24px;
            margin-bottom: 18px;
        }

        .main-layout {
            width: 100%;
            border-collapse: collapse;
        }
        .main-layout td {
            vertical-align: top;
        }
        .left-column {
            width: 200px;
            padding-right: 20px;
            border-right: 1px solid #e0e4ea;
        }
        .right-column {
            padding-left: 20px;
        }

        .photo-box {
            width: 170px;
            margin: 0 auto 12px auto;
            border: 1px solid #c2c7d1;
            padding: 4px;
            background: #f8f9ff;
            border-radius: 4px;
        }
        .photo-box img {
            width: 100%;
            height: 225px;
            object-fit: cover;
            display: block;
        }

        .badge {
            text-align: center;
            margin-bottom: 14px;
        }
        .badge span {
            display: inline-block;
            background: #00714e;
            color: #ffffff;
            padding: 4px 14px;
            font-size: 8pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            border-radius: 4px;
        }

        .qr-section {
            text-align: center;
            margin-top: 6px;
        }
        .qr-section img {
            width: 90px;
            height: 90px;
            display: inline-block;
        }
        .qr-section .qr-label {
            font-size: 7pt;
            color: #727780;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            font-weight: 700;
            margin-top: 3px;
            line-height: 1.3;
        }

        .data-grid {
            width: 100%;
            border-collapse: collapse;
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
        .data-grid .value-mono {
            font-family: 'Courier New', 'Lucida Console', monospace;
            font-size: 9.5pt;
            letter-spacing: 0.03em;
        }
        .data-grid .value-code {
            display: inline-block;
            background: rgba(15, 76, 129, 0.07);
            padding: 2px 10px;
            border-radius: 3px;
            font-family: 'Courier New', 'Lucida Console', monospace;
            font-size: 9.5pt;
            color: #00355f;
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

        .highlight-row td {
            background: rgba(213, 227, 252, 0.25);
            padding: 8px 6px;
            border-left: 3px solid #0f4c81;
        }
        .highlight-row .label {
            padding-top: 8px;
        }
        .highlight-row .value {
            font-weight: 600;
            font-size: 10.5pt;
            padding-bottom: 8px;
        }

        .status-badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 3px;
            font-size: 8pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }
        .status-accepted {
            background: #d1fae5;
            color: #065f46;
        }
        .status-pending {
            background: #dbeafe;
            color: #1e40af;
        }
        .status-reserve {
            background: #fef3c7;
            color: #92400e;
        }
        .status-rejected {
            background: #fee2e2;
            color: #991b1b;
        }
        .status-draft {
            background: #e5e7eb;
            color: #374151;
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
            width: 45%;
            text-align: left;
        }
        .signature-right {
            width: 55%;
            text-align: right;
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

        .no-print {
            display: none;
        }

        @media print {
            body {
                background: white;
            }
            .card {
                box-shadow: none !important;
                border: 1px solid #c2c7d1;
            }
            .no-print {
                display: none;
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
            <h2>BUKTI PENDAFTARAN PPDB</h2>
            <p>Tahun Ajaran {{ $registration->academicYear->name ?? '' }}</p>
        </div>

        <div class="card">
            <table class="main-layout">
                <tr>
                    <td class="left-column">
                        <div class="photo-box">
                            @if($photo)
                                <img src="{{ $photo }}" alt="Pas Foto">
                            @else
                                <div style="width:100%;height:225px;background:#eef3ff;text-align:center;line-height:225px;color:#c2c7d1;font-size:8pt;">FOTO</div>
                            @endif
                        </div>

                        <div class="badge">
                            <span>✓ VERIFIED</span>
                        </div>

                        <div class="qr-section">
                            @if($qrcode)
                                <img src="data:image/png;base64,{{ $qrcode }}" alt="QR Code">
                            @else
                                <div style="width:90px;height:90px;background:#eef3ff;margin:0 auto;text-align:center;line-height:90px;border-radius:3px;color:#c2c7d1;font-size:6pt;">QR</div>
                            @endif
                            <div class="qr-label">SCAN TO VERIFY</div>
                            <div class="qr-label" style="font-weight:400;text-transform:none;letter-spacing:0;margin-top:1px;">
                                NISN: {{ $registration->studentBiodata->nisn ?? '-' }}
                            </div>
                        </div>
                    </td>

                    <td class="right-column">
                        <table class="data-grid">
                            <tr>
                                <td style="width:50%;">
                                    <div class="label">No. Pendaftaran</div>
                                    <div class="value">
                                        <span class="value-code">{{ str_pad($registration->id, 5, '0', STR_PAD_LEFT) }}</span>
                                    </div>
                                </td>
                                <td style="width:50%;">
                                    <div class="label">Tanggal Pendaftaran</div>
                                    <div class="value">
                                        {{ $registration->created_at ? $registration->created_at->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') : '-' }}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <div class="label">Nama Lengkap</div>
                                    <div class="value full-name">{{ $registration->studentBiodata->full_name ?? '-' }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="label">NISN</div>
                                    <div class="value value-mono">{{ $registration->studentBiodata->nisn ?? '-' }}</div>
                                </td>
                                <td>
                                    <div class="label">Tempat, Tanggal Lahir</div>
                                    <div class="value">
                                        {{ $registration->studentBiodata->birth_place ?? '-' }}{{ $registration->studentBiodata->birth_place && $registration->studentBiodata->birth_date ? ', ' : '' }}
                                        {{ $registration->studentBiodata->birth_date ? $registration->studentBiodata->birth_date->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') : '' }}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="label">Jenis Kelamin</div>
                                    <div class="value">
                                        @php
                                            $gender = $registration->studentBiodata->gender ?? null;
                                        @endphp
                                        @if($gender === 'male')
                                            Laki-laki
                                        @elseif($gender === 'female')
                                            Perempuan
                                        @else
                                            -
                                        @endif
                                    </div>
                                </td>
                                <td>
                                    <div class="label">Asal Sekolah</div>
                                    <div class="value">{{ $registration->studentBiodata->previous_school ?? '-' }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <div class="label">Alamat</div>
                                    <div class="value">{{ $registration->studentBiodata->address ?? '-' }}</div>
                                </td>
                            </tr>
                            <tr class="highlight-row" >
                                <td colspan="2">
                                    <div class="label">Jalur Pendaftaran</div>
                                    <div class="value">{{ $registration->admissionPath->name ?? '-' }}</div>
                                </td>
                                
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <hr class="footer-divider">

            <table class="signature-table">
                <tr>
                    <td class="signature-left">
                        <div style="font-size:7.5pt;color:#727780;max-width:140px;line-height:1.3;text-align:left;">
                            Dokumen ini sah dan terdaftar di database resmi PPDB.
                        </div>
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
