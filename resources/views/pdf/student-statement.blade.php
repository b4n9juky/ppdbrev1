<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Surat Pernyataan Siswa</title>
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
            font-size: 14pt;
            font-weight: 700;
            color: #00355f;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            text-decoration: underline;
        }

        .content-text {
            text-align: justify;
            margin-bottom: 18px;
            font-size: 10.5pt;
            line-height: 1.7;
        }
        .content-text p {
            margin: 8px 0;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0 20px 24px;
        }
        .data-table td {
            padding: 4px 6px;
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
        }
        .signature-box {
            text-align: center;
            float: right;
            width: 250px;
        }
        .signature-box .date-text {
            font-size: 10.5pt;
            margin-bottom: 6px;
        }
        .signature-box .title-text {
            font-size: 10.5pt;
            margin-bottom: 72px;
        }
        .signature-box .name-text {
            font-weight: 700;
            text-decoration: underline;
            font-size: 10.5pt;
            margin: 0;
            text-transform: uppercase;
        }
        .signature-box .info-text {
            font-size: 9pt;
            color: #42474f;
            margin-top: 2px;
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
            <h2>SURAT PERNYATAAN SISWA</h2>
        </div>

        <div class="content-text">
            <p>Yang bertanda tangan di bawah ini, saya calon siswa baru {{ $madrasah->madrasah_name ?? 'Madrasah Aliyah' }}:</p>
        </div>

        <table class="data-table">
            <tr>
                <td class="label-col">Nama Lengkap</td>
                <td class="semi-col">:</td>
                <td><strong>{{ $registration->studentBiodata->full_name ?? '-' }}</strong></td>
            </tr>
            <tr>
                <td class="label-col">NISN</td>
                <td class="semi-col">:</td>
                <td>{{ $registration->studentBiodata->nisn ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label-col">NIK Siswa</td>
                <td class="semi-col">:</td>
                <td>{{ $registration->studentBiodata->nik ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label-col">Tempat, Tanggal Lahir</td>
                <td class="semi-col">:</td>
                <td>
                    {{ $registration->studentBiodata->birth_place ?? '-' }}{{ $registration->studentBiodata->birth_place && $registration->studentBiodata->birth_date ? ', ' : '' }}
                    {{ $registration->studentBiodata->birth_date ? $registration->studentBiodata->birth_date->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') : '' }}
                </td>
            </tr>
            <tr>
                <td class="label-col">Alamat Rumah</td>
                <td class="semi-col">:</td>
                <td>{{ $registration->studentBiodata->address ?? '-' }}</td>
            </tr>
        </table>

        <div class="content-text">
            <p>Dengan sungguh-sungguh dan penuh kesadaran menyatakan bahwa selama menjadi siswa {{ $madrasah->madrasah_name ?? 'Madrasah Aliyah' }}, saya berjanji:</p>
        </div>

        <ol class="points-list">
            @foreach($points as $point)
                <li>{{ $point }}</li>
            @endforeach
        </ol>

        <div class="content-text">
            <p>Demikian surat pernyataan ini saya buat dengan sebenarnya dan penuh rasa tanggung jawab. Apabila saya melanggar pernyataan di atas, saya bersedia menerima sanksi yang ditetapkan oleh pihak Madrasah.</p>
        </div>

        <table class="signature-table">
            <tr>
                <td></td>
                <td style="width: 250px;">
                    <div class="signature-box">
                        <div class="date-text">
                            {{ $madrasah->kota}}, {{ \Carbon\Carbon::now()->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') }}
                        </div>
                        <div class="title-text">
                            Yang membuat pernyataan,<br>Siswa
                        </div>
                        <div class="name-text">{{ $registration->studentBiodata->full_name ?? '' }}</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
