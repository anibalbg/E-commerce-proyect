<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Si no hay usuario autenticado
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Si el usuario no es admin
        if (!$user->is_admin) {
            return response()->json([
                'message' => 'Forbidden (admin only)'
            ], 403);
        }

        return $next($request);
    }
}
