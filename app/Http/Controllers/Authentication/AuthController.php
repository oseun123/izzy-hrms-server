<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = $request->has('username') ? User::where('username', $request->username)->first() : User::where('primary_email', $request->email)->first();
       
        if (Hash::check($request->password, $user->password)) {
            $token = $user->createToken("user")->plainTextToken;
            return successResponse("Logged in successfully", [
                "token" => $token,
                "user_id" => $user->id,
                // "abilities" => $token->accessToken->abilities
            ]);
        } else {
            return errorResponse("Credential Mismatch", );
        }
    }
}
