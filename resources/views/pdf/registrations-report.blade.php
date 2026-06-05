<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Pendaftaran PPDB</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 10px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
        }
        .header p {
            font-size: 10pt;
            margin: 4px 0 0 0;
        }
        .report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .report-table th, .report-table td {
            border: 1px solid #ddd;
            padding: 8px 10px;
            text-align: left;
        }
        .report-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            font-size: 9pt;
            text-transform: uppercase;
        }
        .report-table tr:nth-child(even) {
            background-color: #fafafa;
        }
        .text-center {
            text-align: center !important;
        }
        .text-right {
            text-align: right !important;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 8pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-draft { background-color: #e5e7eb; color: #374151; }
        .status-pending { background-color: #dbeafe; color: #1e40af; }
        .status-accepted { background-color: #d1fae5; color: #065f46; }
        .status-reserve { background-color: #fef3c7; color: #92400e; }
        .status-rejected { background-color: #fee2e2; color: #991b1b; }

        .footer-table {
            width: 100%;
            margin-top: 40px;
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
        <div class="header">
            <h1>LAPORAN PENDAFTARAN PPDB</h1>
            <p>{{ $madrasah->madrasah_name ?? 'MADRASAH ALIYAH' }}</p>
            <p>Tahun Ajaran: {{ $activeYear->name ?? '-' }}</p>
        </div>

        <table class="report-table">
            <thead>
                <tr>
                    <th class="text-center" style="width: 30px;">No</th>
                    <th class="text-center" style="width: 100px;">No. Daftar</th>
                    <th>Nama Lengkap</th>
                    <th class="text-center" style="width: 90px;">NISN</th>
                    <th>Jalur</th>
                    <th class="text-center" style="width: 70px;">Total Nilai</th>
                    <th class="text-center" style="width: 90px;">Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($registrations as $index => $reg)
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td class="text-center">{{ str_pad($reg->id, 5, '0', STR_PAD_LEFT) }}</td>
                        <td>{{ $reg->studentBiodata->full_name ?? $reg->user->name }}</td>
                        <td class="text-center">{{ $reg->studentBiodata->nisn ?? '-' }}</td>
                        <td>{{ $reg->admissionPath->name ?? '-' }}</td>
                        <td class="text-center">{{ $reg->total_score !== null ? number_format($reg->total_score, 2) : '-' }}</td>
                        <td class="text-center">
                            <span class="status-badge status-{{ $reg->status }}">
                                @if($reg->status === 'pending')
                                    Menunggu
                                @elseif($reg->status === 'accepted')
                                    Diterima
                                @elseif($reg->status === 'reserve')
                                    Cadangan
                                @elseif($reg->status === 'rejected')
                                    Ditolak
                                @else
                                    {{ $reg->status }}
                                @endif
                            </span>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center" style="padding: 20px 0;">Belum ada data pendaftar.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <!-- Signature Section -->
        <table class="footer-table">
            <tr>
                <td style="width: 60%;"></td>
                <td class="text-right">
                    <div class="signature-area">
                        <div class="signature-date">
                            {{ \Carbon\Carbon::now()->locale('id')->settings(['formatFunction' => 'translatedFormat'])->format('d F Y') }}
                        </div>
                        <div class="signature-title">
                            Kepala {{ $madrasah->madrasah_name ?? 'Madrasah' }},
                        </div>

                        <p class="headmaster-name" style="margin-top: 60px;">{{ $madrasah->headmaster_name ?? '___________________' }}</p>
                        @if($madrasah->headmaster_nip)
                            <p class="headmaster-nip">NIP. {{ $madrasah->headmaster_nip }}</p>
                        @endif
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
