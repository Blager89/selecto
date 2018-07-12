<?php

use App\AboutUser;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0'); // disable foreign key constraints

        \App\User::truncate();
        $faker = \Faker\Factory::create();

        $password = Hash::make('admin');
        $usersPassword = Hash::make(123456);

        User::create([
            'username' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => $password,
            'role' => 1,
        ]);

        for ($i = 0; $i < 9; $i++) {
            User::create([
                'username' => $faker->name,
                'email' => $faker->email,
                'password' => $usersPassword,
            ]);




        }
        for ($i = 0; $i <10; $i++) {


            AboutUser::create([
                'name' => $faker->name,
                'surname' => $faker->lastName,
                'user_id' => $i+1,
                'phone' => rand(),
            ]);


        }
    }
}