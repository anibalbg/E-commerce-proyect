<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        return response()->json(
            User::select('id', 'name', 'email', 'is_admin', 'created_at')
                ->orderBy('created_at', 'asc')
                ->get()
        );
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'is_admin' => 'required|boolean',
        ]);

        // Evitar que un admin se quite su propio rol
        if ($user->id === auth()->id() && $request->boolean('is_admin') === false) {
            return response()->json([
                'message' => 'Cannot remove your own admin role'
            ], 400);
        }

        // (Opcional) proteger el usuario ID=1
        if ($user->id === 1 && $request->boolean('is_admin') === false) {
            return response()->json([
                'message' => 'Primary admin cannot be demoted'
            ], 400);
        }

        $user->is_admin = $request->boolean('is_admin');
        $user->save();

        return response()->json([
            'message' => 'User role updated successfully',
            'user'    => $user->fresh(),
        ]);
    }
}
