<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('registrations', function (Blueprint $table) {
            $table->index('status');
            $table->index('processing_status');
            $table->index('total_score');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('role');
        });

        Schema::table('student_biodatas', function (Blueprint $table) {
            $table->index('full_name');
        });
    }

    public function down(): void
    {
        Schema::table('registrations', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['processing_status']);
            $table->dropIndex(['total_score']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
        });

        Schema::table('student_biodatas', function (Blueprint $table) {
            $table->dropIndex(['full_name']);
        });
    }
};
