<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Subject;
use App\Models\User;
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
    }
}
