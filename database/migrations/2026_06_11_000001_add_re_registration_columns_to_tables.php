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
        Schema::table('student_biodatas', function (Blueprint $table) {
            $table->string('nik', 16)->nullable()->after('nisn');
            $table->integer('child_order')->nullable()->after('gender');
            $table->integer('siblings_count')->nullable()->after('child_order');
            $table->string('student_status')->nullable()->after('siblings_count'); // Anak Kandung, dll.

            // Tempat Tinggal
            $table->string('district')->nullable()->after('address'); // Kecamatan
            $table->string('subdistrict')->nullable()->after('district'); // Kelurahan
            $table->string('living_status')->nullable()->after('subdistrict'); // Tinggal dengan
            $table->string('distance_to_school')->nullable()->after('living_status');

            // Kesehatan
            $table->string('blood_type')->nullable()->after('distance_to_school');
            $table->string('disability')->nullable()->after('blood_type');

            // Pendidikan Sebelumnya
            $table->string('previous_school_status')->nullable()->after('previous_school');
            $table->string('previous_school_npsn')->nullable()->after('previous_school_status');
            $table->text('previous_school_address')->nullable()->after('previous_school_npsn');
            $table->string('previous_school_city')->nullable()->after('previous_school_address');
            $table->string('previous_school_district')->nullable()->after('previous_school_city');
            $table->string('previous_school_subdistrict')->nullable()->after('previous_school_district');

            // Penerimaan
            $table->string('accepted_class')->default('X (Sepuluh)')->nullable()->after('previous_school_subdistrict');
            $table->string('accepted_program')->nullable()->after('accepted_class');
            $table->date('accepted_date')->nullable()->after('accepted_program');
        });

        Schema::table('registrations', function (Blueprint $table) {
            $table->string('re_registration_status')->nullable()->after('processing_status'); // null, pending, submitted, verified
            $table->text('re_registration_notes')->nullable()->after('re_registration_status');
            $table->timestamp('re_registered_at')->nullable()->after('re_registration_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_biodatas', function (Blueprint $table) {
            $table->dropColumn([
                'nik',
                'child_order',
                'siblings_count',
                'student_status',
                'district',
                'subdistrict',
                'living_status',
                'distance_to_school',
                'blood_type',
                'disability',
                'previous_school_status',
                'previous_school_npsn',
                'previous_school_address',
                'previous_school_city',
                'previous_school_district',
                'previous_school_subdistrict',
                'accepted_class',
                'accepted_program',
                'accepted_date',
            ]);
        });

        Schema::table('registrations', function (Blueprint $table) {
            $table->dropColumn([
                're_registration_status',
                're_registration_notes',
                're_registered_at',
            ]);
        });
    }
};
