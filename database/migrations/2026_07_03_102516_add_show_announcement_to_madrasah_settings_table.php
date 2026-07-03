<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('madrasah_settings', function (Blueprint $table) {
            $table->boolean('show_announcement')->default(true)->after('participation_statement_points');
        });
    }

    public function down(): void
    {
        Schema::table('madrasah_settings', function (Blueprint $table) {
            $table->dropColumn('show_announcement');
        });
    }
};
