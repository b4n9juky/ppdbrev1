<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('madrasah_settings', function (Blueprint $table) {
            $table->id();
            $table->string('madrasah_name');
            $table->text('address')->nullable();
            $table->string('contact')->nullable();
            $table->string('headmaster_name')->nullable();
            $table->string('headmaster_nip')->nullable();
            $table->string('kop_surat_path')->nullable();
            $table->string('signature_path')->nullable();
            $table->string('stamp_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('madrasah_settings');
    }
};
