<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('madrasah_settings', function (Blueprint $table) {
            $table->text('student_statement_points')->nullable()->after('stamp_path');
            $table->text('parent_statement_points')->nullable()->after('student_statement_points');
            $table->text('participation_statement_points')->nullable()->after('parent_statement_points');
        });

        // Set default values for the existing row in madrasah_settings
        $studentDefaults = implode("\n", [
            "Menjunjung tinggi nama baik Almamater Madrasah Aliyah.",
            "Taat dan patuh pada seluruh tata tertib dan peraturan yang berlaku di Madrasah Aliyah.",
            "Menghormati Kepala Madrasah, guru, staf, serta sesama teman di Madrasah Aliyah.",
            "Hadir di Madrasah tepat waktu sesuai dengan ketentuan jam belajar.",
            "Menjauhi segala bentuk tindakan kriminal, penggunaan narkotika, minuman keras, perjudian, tawuran, serta merokok."
        ]);

        $parentDefaults = implode("\n", [
            "Menyerahkan sepenuhnya pembinaan dan pendidikan putra/putri saya selama berada di Madrasah Aliyah.",
            "Bersedia membimbing, mengawasi, dan mendidik putra/putri saya di rumah agar menaati tata tertib Madrasah Aliyah.",
            "Bersedia memenuhi segala kewajiban administrasi sekolah tepat pada waktunya.",
            "Menerima dengan ikhlas keputusan Madrasah Aliyah apabila putra/putri saya diberikan sanksi atas pelanggaran tata tertib.",
            "Bersedia hadir ke Madrasah Aliyah apabila dipanggil untuk kepentingan pembinaan putra/putri saya."
        ]);

        $participationDefaults = implode("\n", [
            "Bersedia ikut serta secara aktif dalam mendukung program-program peningkatan mutu Madrasah Aliyah.",
            "Bersedia menjadi anggota Komite Madrasah Aliyah dan menghadiri rapat/pertemuan yang diselenggarakan oleh Madrasah.",
            "Bersedia memberikan sumbangan dana partisipasi pembangunan Madrasah Aliyah sesuai kesepakatan bersama.",
            "Bersedia bergotong royong mendukung kegiatan ekstrakurikuler dan keagamaan di Madrasah Aliyah.",
            "Bersedia bekerja sama dengan pihak Madrasah Aliyah dalam menjaga keamanan, ketertiban, dan kebersihan lingkungan belajar."
        ]);

        DB::table('madrasah_settings')->update([
            'student_statement_points' => $studentDefaults,
            'parent_statement_points' => $parentDefaults,
            'participation_statement_points' => $participationDefaults,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('madrasah_settings', function (Blueprint $table) {
            $table->dropColumn([
                'student_statement_points',
                'parent_statement_points',
                'participation_statement_points'
            ]);
        });
    }
};
