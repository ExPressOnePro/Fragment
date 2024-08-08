<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogController extends Controller
{
    /**
     * Store a new log entry.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Валидировать запрос
        $request->validate([
            'error' => 'required|string',
        ]);

        // Записать ошибку в лог
        Log::error($request->input('error'));

        // Вернуть успешный ответ
        return response()->json(['message' => 'Error logged successfully'], 200);
    }
}
