<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;


class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Удаление старых токенов
            $user = $request->user();
            $user->tokens()->delete();
            $user->tokens()->create([
                'name' => 'Personal Access Token',
                'token' => $token,
                'expires_at' => Carbon::now()->addWeek(),
            ]);
            $request->authenticate();

            return response()->json([
                'token' => $token,
                'redirect' => RouteServiceProvider::HOME
            ]);


        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }
    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::logout();

    }
}
