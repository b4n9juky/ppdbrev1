<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('madrasah_settings', function (Blueprint $table) {
            $table->string('kota', 100)->nullable()->after('address');
            $table->string('propinsi', 100)->nullable()->after('kota');
        });
    }

    public function down(): void
    {
        Schema::table('madrasah_settings', function (Blueprint $table) {
            $table->dropColumn(['kota', 'propinsi']);
        });
    }
};