<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActionLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Email ou mot de passe incorrect'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'first_name' => $user->first_name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:4',
            'role' => 'sometimes|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role ?? 'agent',
            'phone' => $request->phone ?? '',
        ]);

        ActionLog::create(['user_id' => $user->id, 'action' => 'user_registered', 'target_type' => 'user', 'target_id' => $user->id, 'details' => "{$user->name} ({$user->email})"]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'first_name' => $user->first_name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function list()
    {
        return response()->json(User::all(['id', 'name', 'first_name', 'email', 'role', 'phone']));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $data = $request->only(['name', 'email', 'role', 'phone']);
        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }
        $old = $user->name;
        $user->update($data);
        ActionLog::create(['user_id' => $request->user()->id, 'action' => 'user_updated', 'target_type' => 'user', 'target_id' => $user->id, 'details' => $old]);
        return response()->json($user);
    }

    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);
        ActionLog::create(['user_id' => $request->user()->id, 'action' => 'user_deleted', 'target_type' => 'user', 'target_id' => $user->id, 'details' => "{$user->name} ({$user->email})"]);
        $user->delete();
        return response()->json(['success' => true]);
    }
}
