<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class AuthenticateApi extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function authenticate($request, array $guards)
    {
        $token = $request->query('api_token');
        if(empty($token)){
            $token = $request->bearerToken();
        }

        return $request->expectsJson() ? null : route('login');
    }
}
