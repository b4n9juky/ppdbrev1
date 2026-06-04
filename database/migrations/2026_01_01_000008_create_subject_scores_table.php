<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subject_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('restrict');
            $table->decimal('ijazah_score', 10, 2)->nullable();
            $table->decimal('test_score', 10, 2)->nullable();
            $table->timestamps();

            $table->unique(['registration_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subject_scores');
    }
};
