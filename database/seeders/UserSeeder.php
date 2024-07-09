<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(['id' => 1],[
            'firstname' => 'Seun',
            'lastname' => 'Ogunsanya',
            'primary_email' => 'seun.ogunsanya@gmail.com',
            'middlename' => 'Emmanuel',
            'office_mobile_number' => '09087786776',
            'office_email' => 'izzyhrms@limited.com',
            'primary_line_manager' => 1,
            'isAdmin' => true,
            'password' => Hash::make('admin'),
            'employment_date' => '2022-06-19',
            'employment_type' => 'Full-time',
            'employee_category' => 'Super Admin',
            'isExpatriate' => false,
            'employee_status' => 'Active',
            'department' => 1,
            'designation' => 1,
        ]);

        User::updateOrCreate(['id' => 2],[
            'firstname' => 'Abisola',
            'lastname' => 'Majeed',
            'primary_email' => 'abisola.majeed@gmail.com',
            'middlename' => 'Adejoke',
            'office_mobile_number' => '09087786776',
            'office_email' => 'izzyhrms@limited.com',
            'primary_line_manager' => 1,
            'isAdmin' => false,
            'password' => Hash::make('user'),
            'employment_date' => '2023-09-12',
            'employment_type' => 'Full-time',
            'employee_category' => 'Employee',
            'isExpatriate' => true,
            'employee_status' => 'Active',
            'department' => 1,
            'designation' => 1,
        ]);
    }
}
