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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('primary_email')->unique();
            $table->string('username')->nullable();
            $table->string('middlename');
            $table->string('office_mobile_number');
            $table->string('office_email');
            $table->integer('primary_line_manager');
            $table->timestamp('email_verified_at')->nullable();
            $table->boolean('isAdmin')->default(false)->nullable();
            $table->string('password');
            $table->string('lastlogin')->nullable();
            $table->integer('secondary_line_manager')->nullable();
            $table->integer('team_lead')->nullable();
            $table->date('employment_date');
            $table->string('employment_type');
            $table->string('employee_category');
            $table->boolean('isExpatriate')->default(false);
            $table->string('employee_status');
            $table->integer('department');
            $table->integer('designation');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->foreignId('user_id')->index();
            $table->string('token');
            $table->timestamp('created_at');
            $table->timestamp('expired_at');
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
