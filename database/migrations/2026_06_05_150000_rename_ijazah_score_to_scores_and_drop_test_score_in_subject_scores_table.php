<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subject_scores', function (Blueprint $table) {
            $table->renameColumn('ijazah_score', 'scores');
            $table->dropColumn('test_score');
        });
    }

    public function down(): void
    {
        Schema::table('subject_scores', function (Blueprint $table) {
            $table->renameColumn('scores', 'ijazah_score');
            $table->decimal('test_score', 10, 2)->nullable()->after('scores');
        });
    }
};
