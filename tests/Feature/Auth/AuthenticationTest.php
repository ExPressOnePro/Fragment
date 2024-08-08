<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt($password = 'password'),
        ]);

        // Выполняем запрос на аутентификацию
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        // Проверяем, что токен получен и статус ответа правильный
        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'redirect']);

        // Извлекаем токен из ответа
        $token = $response->json('token');

        // Проверяем аутентификацию с использованием JWT
        $this->withHeader('Authorization', "Bearer {$token}");
        $this->get('/api/products')
        ->assertStatus(200);

        $this->assertAuthenticatedAs($user);
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout_using_jwt(): void
    {
        // Создание пользователя
        $user = User::factory()->create([
            'password' => bcrypt($password = 'password'),
        ]);

        // Вход пользователя и получение JWT токена
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        // Извлечение токена из ответа
        $token = $response->json('token');

        // Выполнение запроса для выхода
        $logoutResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->post('/api/logout');

        // Проверка, что выход успешен
        $logoutResponse->assertStatus(200)
            ->assertJson(['message' => 'Logged out successfully']);

        // Попробуйте выполнить защищённый запрос и проверьте, что он возвращает 401
        $protectedResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->get('/api/products');

        // Проверка, что запрос возвращает статус 401, так как токен больше не действителен
        $protectedResponse->assertStatus(401);
    }
}
