<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_types', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->boolean('is_required')->default(false);
            $table->timestamps();
        });

        DB::table('document_types')->insert([
            ['code' => 'foto', 'name' => 'Pas Foto', 'is_required' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'ijazah', 'name' => 'Ijazah', 'is_required' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'ktp_ortu', 'name' => 'KTP Orang Tua', 'is_required' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'kk', 'name' => 'Kartu Keluarga', 'is_required' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'prestasi', 'name' => 'Sertifikat Prestasi', 'is_required' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'other', 'name' => 'Lainnya', 'is_required' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_types');
    }
};
