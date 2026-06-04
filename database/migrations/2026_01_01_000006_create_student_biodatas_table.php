<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_biodatas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained()->onDelete('cascade');
            $table->string('nisn')->unique();
            $table->string('full_name');
            $table->enum('gender', ['male', 'female']);
            $table->string('birth_place');
            $table->date('birth_date');
            $table->text('address');
            $table->string('previous_school');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_biodatas');
    }
};
