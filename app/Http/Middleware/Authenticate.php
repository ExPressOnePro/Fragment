<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if (!$request->expectsJson()) {
            if (!$this->isAuthenticated($request)) {
                return route('login');
            }
        }

        return null;
    }

    /**
     * Check if the request has a valid JWT token and if the user is authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    private function isAuthenticated(Request $request): bool
    {
        try {
            $token = $request->bearerToken();
            if ($token) {
                JWTAuth::setToken($token)->authenticate();
                return true;
            }
        } catch (JWTException $e) {
            // Токен невалиден или произошла ошибка
            return false;
        }

        return false;
    }
}
