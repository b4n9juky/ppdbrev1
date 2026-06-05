import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { formatDate } from '@/lib/utils';

export default function DecisionLetter({ registration, madrasah }) {
    const bio = registration.student_biodata;
    const isAccepted = registration.status === 'accepted';
    const isReserve = registration.status === 'reserve';
    const decisionText = isAccepted ? 'DITERIMA' : isReserve ? 'DITETAPKAN SEBAGAI CADANGAN' : 'DITOLAK';

    useEffect(() => {
        setTimeout(() => window.print(), 500);
    }, []);

    return (
        <>
            <Head title="Surat Keputusan Kelulusan" />

            <div className="print-container">
                <style>{`
                    @media print {
                        body { margin: 0; padding: 0; font-size: 12pt; }
                        .no-print { display: none !important; }
                        .print-container { padding: 0; }
                        .print-page { page-break-after: always; padding: 2cm; }
                    }
                    .no-print {
                        position: fixed; top: 0; left: 0; right: 0;
                        background: #4f46e5; color: white;
                        text-align: center; padding: 12px;
                        font-size: 14px; z-index: 999;
                    }
                    .print-page { padding: 2cm; font-family: 'Times New Roman', serif; }
                    .kop-surat { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 3px double #000; }
                    .kop-surat img { max-height: 100px; margin-bottom: 8px; }
                    .kop-surat h1 { font-size: 18pt; font-weight: bold; margin: 0; text-transform: uppercase; }
                    .kop-surat p { font-size: 11pt; margin: 2px 0; }
                    .title { text-align: center; font-size: 14pt; font-weight: bold; margin: 24px 0; text-decoration: underline; }
                    .subtitle { text-align: center; font-size: 12pt; margin-top: -16px; margin-bottom: 24px; }
                    .content { font-size: 12pt; line-height: 1.8; text-align: justify; }
                    .content p { margin: 8px 0; text-indent: 2em; }
                    .decision-box { text-align: center; margin: 32px 0; padding: 16px; border: 2px solid #000; }
                    .decision-box h3 { font-size: 16pt; font-weight: bold; margin: 0; }
                    .score-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
                    .score-table th, .score-table td { border: 1px solid #000; padding: 6px 12px; text-align: center; font-size: 11pt; }
                    .score-table th { background-color: #f0f0f0; }
                    .footer { margin-top: 48px; text-align: right; }
                    .footer .signature-area { display: inline-block; text-align: center; margin-top: 16px; }
                    .stamp-overlay { display: inline-block; position: relative; }
                    .stamp-overlay img.signature-img { max-height: 60px; position: relative; z-index: 2; }
                    .stamp-overlay img.stamp-img { max-height: 80px; position: absolute; top: -30px; right: -30px; z-index: 1; opacity: 0.8; }
                `}</style>

                <div className="no-print">
                    Klik Ctrl+P atau Cmd+P untuk mencetak. Tutup tab setelah selesai.
                </div>

                <div className="print-page">
                    {madrasah?.kop_surat_path && (
                        <div className="kop-surat">
                            <img src={`/storage/${madrasah.kop_surat_path}`} alt="Kop Surat" />
                        </div>
                    )}

                    {!madrasah?.kop_surat_path && (
                        <div className="kop-surat">
                            <h1>{madrasah?.madrasah_name || 'MADRASAH ALIYAH'}</h1>
                            <p>{madrasah?.address || ''}</p>
                            <p>Telp: {madrasah?.contact || ''}</p>
                        </div>
                    )}

                    <h2 className="title">SURAT KEPUTUSAN KELULUSAN</h2>
                    <p className="subtitle">
                        Nomor: 421.3/{registration.id.toString().padStart(4, '0')}/PPDB/{registration.academic_year?.name?.replace('/', '/') || new Date().getFullYear()}
                    </p>

                    <div className="content">
                        <p>
                            Yang bertanda tangan di bawah ini, Panitia PPDB {registration.academic_year?.name}
                            {madrasah?.madrasah_name || 'Madrasah Aliyah'},
                            menerangkan bahwa:
                        </p>

                        <table className="info-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: '12pt' }}>
                            <tbody>
                                <tr><td style={{ width: 160, fontWeight: 'bold', padding: '4px 8px' }}>Nama</td><td style={{ padding: '4px 8px' }}>: {bio?.full_name || '-'}</td></tr>
                                <tr><td style={{ width: 160, fontWeight: 'bold', padding: '4px 8px' }}>NISN</td><td style={{ padding: '4px 8px' }}>: {bio?.nisn || '-'}</td></tr>
                                <tr><td style={{ width: 160, fontWeight: 'bold', padding: '4px 8px' }}>Tempat, Tgl Lahir</td><td style={{ padding: '4px 8px' }}>: {bio?.birth_place || '-'}, {formatDate(bio?.birth_date)}</td></tr>
                                <tr><td style={{ width: 160, fontWeight: 'bold', padding: '4px 8px' }}>Asal Sekolah</td><td style={{ padding: '4px 8px' }}>: {bio?.previous_school || '-'}</td></tr>
                                <tr><td style={{ width: 160, fontWeight: 'bold', padding: '4px 8px' }}>Jalur Pendaftaran</td><td style={{ padding: '4px 8px' }}>: {registration.admission_path?.name || '-'}</td></tr>
                            </tbody>
                        </table>

                        {registration.subject_scores?.length > 0 && (
                            <>
                                <p style={{ marginTop: 16 }}>Berdasarkan hasil seleksi, dengan nilai sebagai berikut:</p>
                                <table className="score-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Mata Pelajaran</th>
                                            <th>Nilai Ijazah</th>
                                            <th>Nilai Tes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registration.subject_scores.map((score, i) => (
                                            <tr key={score.id}>
                                                <td>{i + 1}</td>
                                                <td style={{ textAlign: 'left' }}>{score.subject?.name || '-'}</td>
                                                <td>{score.ijazah_score ?? '-'}</td>
                                                <td>{score.test_score ?? '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        <p style={{ marginTop: 16 }}>
            {registration.total_score !== null && (
                                <>Total Nilai: <strong>{registration.total_score}</strong>. </>
                            )}
                            Dengan ini dinyatakan:
                        </p>
                    </div>

                    <div className="decision-box">
                        <h3>{decisionText}</h3>
                        {isReserve && (
                            <p style={{ fontSize: '11pt', marginTop: 8 }}>
                                Sebagai calon peserta didik cadangan. Apabila terdapat kuota yang tersedia,
                                status dapat dinaikkan menjadi diterima.
                            </p>
                        )}
                    </div>

                    <div className="footer">
                        <p style={{ fontSize: '11pt' }}>
                            {formatDate(new Date())}
                        </p>
                        <p style={{ fontSize: '11pt', marginTop: 4 }}>
                            Panitia PPDB {registration.academic_year?.name}<br />
                            {madrasah?.madrasah_name || 'Madrasah'},
                        </p>

                        <div className="signature-area" style={{ marginTop: 24 }}>
                            {(madrasah?.signature_path || madrasah?.stamp_path) ? (
                                <div className="stamp-overlay">
                                    {madrasah.signature_path && (
                                        <img
                                            className="signature-img"
                                            src={`/storage/${madrasah.signature_path}`}
                                            alt="Tanda Tangan"
                                        />
                                    )}
                                    {madrasah.stamp_path && (
                                        <img
                                            className="stamp-img"
                                            src={`/storage/${madrasah.stamp_path}`}
                                            alt="Stempel"
                                        />
                                    )}
                                </div>
                            ) : (
                                <div style={{ height: 60 }} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
