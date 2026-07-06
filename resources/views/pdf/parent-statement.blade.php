<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Surat Pernyataan Orang Tua / Wali Siswa</title>
    <style>
        @page {
            margin: 1in;
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
            background: #ffffff;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 10px;
        }

        .kop-surat {
            text-align: center;
            padding-bottom: 14px;
            margin-bottom: 22px;
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
            margin-bottom: 24px;
        }
        .title-section h2 {
            font-family: 'Trebuchet MS', 'Arial Black', Arial, sans-serif;
            font-size: 13pt;
            font-weight: 700;
            color: #00355f;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            text-decoration: underline;
        }

        .content-text {
            text-align: justify;
            margin-bottom: 14px;
            font-size: 10.5pt;
            line-height: 1.7;
        }
        .content-text p {
            margin: 8px 0;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0 16px 24px;
        }
        .data-table td {
            padding: 3px 6px;
            vertical-align: top;
            font-size: 10.5pt;
        }
        .data-table td.label-col {
            width: 180px;
            color: #42474f;
        }
        .data-table td.semi-col {
            width: 15px;
            text-align: center;
        }

        .points-list {
            margin: 12px 0 24px 24px;
            font-size: 10.5pt;
        }
        .points-list li {
            margin-bottom: 8px;
            text-align: justify;
            padding-left: 6px;
        }

        .signature-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 36px;
        }
        .signature-table td {
            vertical-align: top;
            padding: 4px 6px;
            width: 50%;
        }

        .signature-box-left {
            text-align: center;
            margin-right: auto;
            width: 250px;
        }
        .signature-box-right {
            text-align: center;
            margin-left: auto;
            width: 250px;
        }

        .signature-box-left .date-text,
        .signature-box-right .date-text {
            font-size: 10.5pt;
            margin-bottom: 6px;
        }

        .signature-box-left .title-text,
        .signature-box-right .title-text {
            font-size: 10.5pt;
            margin-bottom: 12px;
            height: 38px;
        }

        .signature-box-left .name-text,
        .signature-box-right .name-text {
            font-weight: 700;
            text-decoration: underline;
            font-size: 10.5pt;
            margin: 0;
        }
        .signature-box-left .name-text {
            text-transform: uppercase;
        }

        .signature-box-left .info-text,
        .signature-box-right .info-text {
            font-size: 9pt;
            color: #42474f;
            margin-top: 2px;
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
    </style>
</head>
<body>
    @php
        $parent = $registration->studentParent;
        $parentName = '-';
        $parentNik = '-';
        $parentOccupation = '-';
        $parentPhone = '-';
        $parentAddress = '-';


         <!--if ($registration->studentBiodata && $registration->studentBiodata->living_status === 'Wali' && $parent) {-->

        if ($registration->studentBiodata && $registration->studentBiodata->living_status === 'Wali' && $parent && $parent->guardian_name) {
            $parentName = $parent->guardian_name;
            $parentNik = $parent->guardian_nik;
            $parentOccupation = $parent->guardian_occupation;
            $parentPhone = $parent->guardian_phone;
            $parentAddress = $parent->guardian_address;
        } elseif ($parent) {
            if ($parent->father_status === 'Masih Hidup' && $parent->father_name) {
                $parentName = $parent->father_name;
                $parentNik = $parent->father_nik;
                $parentOccupation = $parent->father_occupation;
                $parentPhone = $parent->father_phone;
                $parentAddress = $parent->father_address;
            } elseif ($parent->mother_status === 'Masih Hidup' && $parent->mother_name) {
                $parentName = $parent->mother_name;
                $parentNik = $parent->mother_nik;
                $parentOccupation = $parent->mother_occupation;
                $parentPhone = $parent->mother_phone;
                $parentAddress = $parent->mother_address;
            } elseif ($parent->guardian_name) {
                $parentName = $parent->guardian_name;
                $parentNik = $parent->guardian_nik;
                $parentOccupation = $parent->guardian_occupation;
                $parentPhone = $parent->guardian_phone;
                $parentAddress = $parent->guardian_address;
            }
        }
    @endphp

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
            <h2>SURAT PERNYATAAN ORANG TUA / WALI SISWA</h2>
        </div>

        <div class="content-text">
            <p>Yang bertanda tangan di bawah ini:</p>
        </div>

        <table class="data-table">
            <tr>
                <td class="label-col">Nama Orang Tua / Wali</td>
                <td class="semi-col">:</td>
                <td><strong>{{ $parentName ?? '-' }}</strong></td>
            </tr>
            <tr>
                <td class="label-col">NIK Orang Tua / Wali</td>
                <td class="semi-col">:</td>
                <td>{{ $parentNik ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label-col">Pekerjaan</td>
                <td class="semi-col">:</td>
                <td>{{ $parentOccupation ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label-col">No. Telp / WhatsApp</td>
                <td class="semi-col">:</td>
                <td>{{ $parentPhone ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label-col">Alamat Rumah</td>
                <td class="semi-col">:</td>
                <td>{{ $parentAddress ?? '-' }}</td>
            </tr>
        </table>

        <div class="content-text">
            <p>Adalah orang tua / wali dari siswa baru {{ $madrasah->madrasah_name ?? 'Madrasah Aliyah' }}:</p>
        </div>

        <table class="data-table">
            <tr>
                <td class="label-col">Nama Lengkap Siswa</td>
                <td class="semi-col">:</td>
                <td><strong>{{ $registration->studentBiodata->full_name ?? '-' }}</strong></td>
            </tr>
            <tr>
                <td class="label-col">NISN Siswa</td>
                <td class="semi-col">:</td>
                <td>{{ $registration->studentBiodata->nisn ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label-col">Jalur Pendaftaran</td>
                <td class="semi-col">:</td>
                <td>{{ $registration->admissionPath->name ?? '-' }}</td>
            </tr>
        </table>

        <div class="content-text">
            <p>Dengan sungguh-sungguh menyatakan bahwa saya selaku orang tua / wali dari siswa tersebut di atas, bersedia:</p>
        </div>

        <ol class="points-list">
            @foreach($points as $point)
                <li>{{ $point }}</li>
            @endforeach
        </ol>

        <div class="content-text">
            <p>Demikian surat pernyataan ini saya buat dengan sebenarnya, penuh rasa tanggung jawab, dan tanpa ada paksaan dari pihak mana pun.</p>
        </div>

        <table class="signature-table">
            <tr>
                <td>
                    <div class="signature-box-left">
                        <div class="date-text" style="visibility: hidden;">Spacer</div>
                        <div class="title-text">
                            Mengetahui,<br>Kepala {{ $madrasah->madrasah_name ?? 'Madrasah Aliyah' }}
                        </div>

                        <div class="stamp-overlay">
                            @if($signature_base64)
                                <img src="{{ $signature_base64 }}" class="signature-img" alt="Tanda Tangan">
                            @endif
                            @if($stamp_base64)
                                <img src="{{ $stamp_base64 }}" class="stamp-img" alt="Stempel">
                            @endif
                        </div>

                        <div class="name-text">{{ $madrasah->headmaster_name ?? '....................................' }}</div>
                        <div class="info-text">NIP. {{ $madrasah->headmaster_nip ?? '....................................' }}</div>
                    </div>
                </td>
                <td>
                    <div class="signature-box-right">
                        <div class="date-text">
                            {{ $madrasah->kota }}, {{ \Carbon\Carbon::now()->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') }}
                        </div>
                        <div class="title-text">
                            Yang membuat pernyataan,<br>Orang Tua / Wali Siswa
                        </div>
                        <div style="height: 68px;"></div>
                        <div class="name-text">{{ $parentName !== '-' ? $parentName : '....................................' }}</div>
                        <div class="info-text">&nbsp;</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
