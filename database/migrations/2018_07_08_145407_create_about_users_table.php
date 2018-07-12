<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAboutUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('about_users', function (Blueprint $table) {
            $table->increments('id');
            $table->text('name')->nullable();
            $table->text('surname')->nullable();
            $table->integer('user_id')->unsigned();
            $table->integer('phone')->nullable();
        });

        /*Schema::table('about_users', function($table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');;
        });*/

        Schema::table('about_users', function (Blueprint $table) {

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('about_users');
    }
}
