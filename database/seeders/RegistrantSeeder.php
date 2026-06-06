<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use App\Models\StudentBiodata;
use App\Models\StudentDocument;
use App\Models\Subject;
use App\Models\SubjectScore;
use App\Models\User;
use Illuminate\Database\Seeder;

class RegistrantSeeder extends Seeder
{
    public function run(): void
    {
        $academicYear = AcademicYear::where('is_active', true)->first();
        $subjects = Subject::where('academic_year_id', $academicYear->id)->pluck('id');
        $paths = AdmissionPath::where('is_active', true)->pluck('id');
        $operator = User::where('role', 'operator')->first();

        $students = [
            ['Ahmad Fauzi', 'male'], ['Siti Nurhaliza', 'female'], ['Budi Santoso', 'male'], ['Dewi Sartika', 'female'], ['Rudi Hartono', 'male'],
            ['Fitri Handayani', 'female'], ['Agus Wijaya', 'male'], ['Rina Marlina', 'female'], ['Hendra Gunawan', 'male'], ['Maya Sari', 'female'],
            ['Doni Prasetyo', 'male'], ['Nia Kurniawati', 'female'], ['Eko Purwanto', 'male'], ['Lina Febrianti', 'female'], ['Rizky Ramadhan', 'male'],
            ['Dian Permata', 'female'], ['Adi Saputra', 'male'], ['Wulan Suci', 'female'], ['Bayu Pratama', 'male'], ['Indah Pertiwi', 'female'],
            ['Febrianto', 'male'], ['Ratna Dewi', 'female'], ['Gilang Permadi', 'male'], ['Desi Ratnasari', 'female'], ['Andre Hermawan', 'male'],
            ['Vivi Anggraini', 'female'], ['Cahyo Nugroho', 'male'], ['Mega Lestari', 'female'], ['Irfan Hakim', 'male'], ['Puji Lestari', 'female'],
            ['Dimas Ardiansyah', 'male'], ['Nurul Hidayah', 'female'], ['Fajar Nugroho', 'male'], ['Rini Susanti', 'female'], ['Tomi Suhendra', 'male'],
            ['Sari Puspita', 'female'], ['Hadi Prayitno', 'male'], ['Yuli Astuti', 'female'], ['Arif Setiawan', 'male'], ['Dina Amalia', 'female'],
            ['Reza Maulana', 'male'], ['Intan Permata', 'female'], ['Teguh Prasetyo', 'male'], ['Rosa Anggraini', 'female'], ['Yoga Pratama', 'male'],
            ['Putri Ayu', 'female'], ['Wahyu Hidayat', 'male'], ['Melati Kusuma', 'female'], ['Rangga Firmansyah', 'male'], ['Novi Andriani', 'female'],
            ['Herman Susanto', 'male'], ['Tari Purwanti', 'female'], ['Guntur Wibisono', 'male'], ['Rahma Dani', 'female'], ['Slamet Riyadi', 'male'],
            ['Kartika Dewi', 'female'], ['Dany Hermawan', 'male'], ['Vera Susanti', 'female'], ['Edi Supriyanto', 'male'], ['Ayu Wulandari', 'female'],
            ['Robi Gunawan', 'male'], ['Tina Marlina', 'female'], ['Sigit Purnomo', 'male'], ['Bella Safitri', 'female'], ['Joko Susilo', 'male'],
            ['Silvi Andini', 'female'], ['Asep Kurniawan', 'male'], ['Cici Paramida', 'female'], ['Nana Supriatna', 'male'], ['Tari Maysaroh', 'female'],
            ['Cecep Supriadi', 'male'], ['Riri Resmiati', 'female'], ['Dede Suryana', 'male'], ['Sari Dewi', 'female'], ['Ujang Kosasih', 'male'],
            ['Ai Maryati', 'female'], ['Yayan Supriatna', 'male'], ['Euis Nurjanah', 'female'], ['Agus Salim', 'male'], ['Yuniarti', 'female'],
            ['Deden Taufik', 'male'], ['Rina Herlina', 'female'], ['Ade Suherman', 'male'], ['Iis Lisnawati', 'female'], ['Aan Kurniawan', 'male'],
            ['Ela Nurlaela', 'female'], ['Asep Saepuloh', 'male'], ['Rina Kartika', 'female'], ['Iyan Sofyan', 'male'], ['Tintin Suhartini', 'female'],
            ['Wawan Setiawan', 'male'], ['Henny Herawati', 'female'], ['Maman Suryaman', 'male'], ['Lilis Lismayanti', 'female'], ['Otto Tresna', 'male'],
            ['Ai Sumiati', 'female'], ['Apip Sunardi', 'male'], ['Neng Elis', 'female'], ['Cucu Suminar', 'female'], ['Endang Sunarya', 'male'],
        ];

        $villages = ['Cibaduyut', 'Cileunyi', 'Cipedes', 'Cisitu', 'Ciumbuleuit', 'Dago', 'Gegerkalong', 'Margahayu', 'Padasuka', 'Sarijadi', 'Antapani', 'Arcamanik', 'Babakan', 'Cicaheum', 'Cikutra'];

        $schools = [
            'SMP Negeri 1', 'SMP Negeri 2', 'SMP Negeri 3', 'SMP Negeri 4', 'SMP Negeri 5',
            'SMP Negeri 6', 'SMP Negeri 7', 'SMP Negeri 8', 'SMP Negeri 9', 'SMP Negeri 10',
            'SMP Islam Terpadu', 'SMP Muhammadiyah', 'SMP Al-Muttaqin', 'SMP Bina Persada', 'SMP PGRI',
            'MTs Negeri 1', 'MTs Negeri 2', 'MTs Swasta Al-Falah', 'MTs Swasta Al-Hidayah', 'SMP Kartika',
        ];

        $birthPlaceOptions = ['Bandung', 'Jakarta', 'Garut', 'Tasikmalaya', 'Cimahi', 'Sumedang', 'Purwakarta', 'Bogor'];

        foreach ($students as $index => $data) {
            $name = $data[0];
            $gender = $data[1];

            $nisn = (string) (1000000000 + $index);

            $village = $villages[array_rand($villages)];
            $school = $schools[array_rand($schools)];

            $birthYear = 2008 + rand(0, 3);
            $birthMonth = str_pad((string) rand(1, 12), 2, '0', STR_PAD_LEFT);
            $birthDay = str_pad((string) rand(1, 28), 2, '0', STR_PAD_LEFT);

            $user = User::create([
                'name' => $name,
                'email' => 'siswa' . str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT) . '@ppdb.ma',
                'password' => bcrypt('password'),
                'role' => 'student',
                'email_verified_at' => now(),
            ]);

            $pathIndex = $index < 60 ? 0 : 1;
            $pathId = $paths[$pathIndex];

            if ($index < 40) {
                $processingStatus = 'baru';
                $regStatus = 'pending';
                $assignedOperatorId = null;
                $assignedAt = null;
            } elseif ($index < 70) {
                $processingStatus = 'diproses';
                $regStatus = 'pending';
                $assignedOperatorId = $operator?->id;
                $assignedAt = now()->subHours(rand(1, 48));
            } else {
                $processingStatus = 'selesai';
                $assignedOperatorId = $operator?->id;
                $assignedAt = now()->subHours(rand(1, 72));
                $statusRoll = rand(0, 100);
                if ($statusRoll < 40) {
                    $regStatus = 'accepted';
                } elseif ($statusRoll < 60) {
                    $regStatus = 'reserve';
                } elseif ($statusRoll < 80) {
                    $regStatus = 'rejected';
                } else {
                    $regStatus = 'pending';
                }
            }

            $totalScore = round(rand(0, 10000) / 100, 2);

            $registration = Registration::create([
                'user_id' => $user->id,
                'academic_year_id' => $academicYear->id,
                'admission_path_id' => $pathId,
                'status' => $regStatus,
                'total_score' => $totalScore,
                'assigned_operator_id' => $assignedOperatorId,
                'assigned_at' => $assignedAt,
                'processing_status' => $processingStatus,
                'verification_notes' => $processingStatus === 'diproses' ? 'Sedang diperiksa berkasnya.' : null,
            ]);

            StudentBiodata::create([
                'registration_id' => $registration->id,
                'nisn' => $nisn,
                'full_name' => $name,
                'gender' => $gender,
                'birth_place' => $birthPlaceOptions[array_rand($birthPlaceOptions)],
                'birth_date' => "{$birthYear}-{$birthMonth}-{$birthDay}",
                'address' => "Jl. {$village} No. " . rand(1, 200) . ", RT " . rand(1, 10) . "/RW " . rand(1, 10),
                'phone_number' => '08' . rand(100000000, 999999999),
                'previous_school' => $school,
            ]);

            $docTypes = ['kk', 'foto', 'ijazah'];
            $numDocs = rand(2, 3);
            $usedKeys = array_rand(array_flip($docTypes), min($numDocs, count($docTypes)));
            $usedKeys = is_array($usedKeys) ? $usedKeys : [$usedKeys];

            foreach ($usedKeys as $type) {
                StudentDocument::create([
                    'registration_id' => $registration->id,
                    'document_type' => $type,
                    'file_path' => "dummy/{$type}/siswa_{$registration->id}.jpg",
                ]);
            }

            foreach ($subjects as $subjectId) {
                SubjectScore::create([
                    'registration_id' => $registration->id,
                    'subject_id' => $subjectId,
                    'scores' => round(rand(0, 10000) / 100, 2),
                ]);
            }
        }
    }
}
