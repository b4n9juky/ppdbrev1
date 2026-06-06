<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\DocumentType;
use App\Models\Subject;
use App\Models\User;
use Database\Seeders\RegistrantSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin PPDB',
            'email' => 'admin@ppdb.ma',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $operator = User::create([
            'name' => 'Operator PPDB',
            'email' => 'operator@ppdb.ma',
            'password' => bcrypt('password'),
            'role' => 'operator',
        ]);
        $operator->email_verified_at = now();
        $operator->save();

        $academicYear = AcademicYear::create([
            'name' => '2026/2027',
            'is_active' => true,
            'passing_score' => 75.00,
        ]);

        $zonasi = AdmissionPath::create([
            'name' => 'Zonasi',
            'description' => 'Jalur pendaftaran berdasarkan zonasi tempat tinggal',
            'quota' => 100,
            'is_active' => true,
        ]);

        AdmissionPath::create([
            'name' => 'Prestasi',
            'description' => 'Jalur pendaftaran berdasarkan prestasi akademik dan non-akademik',
            'quota' => 50,
            'is_active' => true,
        ]);

        Subject::create([
            'academic_year_id' => $academicYear->id,
            'name' => 'Matematika',
            'is_active' => true,
        ]);

        Subject::create([
            'academic_year_id' => $academicYear->id,
            'name' => 'Bahasa Indonesia',
            'is_active' => true,
        ]);

        $documentTypes = [
            ['code' => 'foto', 'name' => 'Pas Foto', 'is_required' => true],
            ['code' => 'ijazah', 'name' => 'Ijazah', 'is_required' => true],
            ['code' => 'ktp_ortu', 'name' => 'KTP Orang Tua', 'is_required' => false],
            ['code' => 'kk', 'name' => 'Kartu Keluarga', 'is_required' => true],
            ['code' => 'prestasi', 'name' => 'Sertifikat Prestasi', 'is_required' => false],
            ['code' => 'other', 'name' => 'Lainnya', 'is_required' => false],
        ];

        foreach ($documentTypes as $type) {
            DocumentType::updateOrCreate(['code' => $type['code']], $type);
        }

        $this->call(RegistrantSeeder::class);
    }
}
