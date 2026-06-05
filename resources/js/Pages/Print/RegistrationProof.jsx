import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { formatDate } from '@/lib/utils';

export default function RegistrationProof({ registration, madrasah }) {
    const bio = registration.student_biodata;
    const statusLabels = {
        draft: 'Draft',
        pending: 'Menunggu Verifikasi',
        accepted: 'Diterima',
        reserve: 'Cadangan',
        rejected: 'Ditolak',
    };

    useEffect(() => {
        setTimeout(() => window.print(), 500);
    }, []);

    return (
        <>
            <Head title="Bukti Pendaftaran" />

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
                    .info-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
                    .info-table td { padding: 6px 8px; font-size: 11pt; vertical-align: top; }
                    .info-table td:first-child { width: 180px; font-weight: bold; }
                    .info-table td.label { font-weight: bold; width: 180px; }
                    .footer { margin-top: 48px; text-align: right; }
                    .footer .signature-area { display: inline-block; text-align: center; margin-top: 16px; }
                    .footer .signature-area img { max-height: 80px; margin-bottom: 4px; }
                    .footer .signature-area .stamp { position: relative; }
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

                    <h2 className="title">BUKTI PENDAFTARAN PPDB</h2>
                    <p style={{ textAlign: 'center', fontSize: '11pt', marginTop: -16 }}>
                        Tahun Ajaran {registration.academic_year?.name}
                    </p>

                    <table className="info-table">
                        <tbody>
                            <tr><td className="label">Nomor Pendaftaran</td><td>: {registration.id.toString().padStart(5, '0')}</td></tr>
                            <tr><td className="label">Nama Lengkap</td><td>: {bio?.full_name || '-'}</td></tr>
                            <tr><td className="label">NISN</td><td>: {bio?.nisn || '-'}</td></tr>
                            <tr><td className="label">Tempat, Tanggal Lahir</td><td>: {bio?.birth_place || '-'}, {formatDate(bio?.birth_date)}</td></tr>
                            <tr><td className="label">Jenis Kelamin</td><td>: {bio?.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</td></tr>
                            <tr><td className="label">Alamat</td><td>: {bio?.address || '-'}</td></tr>
                            <tr><td className="label">Asal Sekolah</td><td>: {bio?.previous_school || '-'}</td></tr>
                            <tr><td className="label">Jalur Pendaftaran</td><td>: {registration.admission_path?.name || '-'}</td></tr>
                            <tr><td className="label">Status</td><td>: {statusLabels[registration.status] || registration.status}</td></tr>
                        </tbody>
                    </table>

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
