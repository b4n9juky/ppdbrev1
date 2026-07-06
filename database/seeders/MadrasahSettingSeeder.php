<?php

namespace Database\Seeders;

use App\Models\MadrasahSetting;
use Illuminate\Database\Seeder;

class MadrasahSettingSeeder extends Seeder
{
    public function run(): void
    {
        MadrasahSetting::firstOrCreate(
            ['id' => 1],
            [
                'madrasah_name' => 'Madrasah Aliyah',
                'address' => null,
                'kota' => null,
                'propinsi' => null,
                'contact' => null,
                'headmaster_name' => null,
                'headmaster_nip' => null,
                'student_statement_points' => "Mematuhi semua tata tertib madrasah.\nMenjaga nama baik madrasah di dalam maupun di luar lingkungan sekolah.\nMengikuti seluruh kegiatan pembelajaran dan ekstrakurikuler yang ditentukan.",
                'parent_statement_points' => "Mendampingi dan mendukung proses belajar anak di madrasah.\nMenghadiri pertemuan wali murid yang diselenggarakan madrasah.\nMenjalin komunikasi yang baik dengan pihak madrasah.",
                'participation_statement_points' => "Berpartisipasi aktif dalam kegiatan komite madrasah.\nMendukung program pengembangan sarana dan prasarana madrasah.\nBersedia membantu kegiatan madrasah sesuai kemampuan.",
                'show_announcement' => true,
            ]
        );
    }
}
