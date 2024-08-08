<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;


class AuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_authenticate_a_user()
    {

        $user = User::factory()->create([
            'password' => bcrypt($password = 'password'),
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'redirect'
            ]);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => 'App\Models\User',
        ]);
    }

    /** @test */
    public function it_fails_with_invalid_credentials()
    {

        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Выполняем запрос на аутентификацию с неправильными данными
        $response = $this->postJson('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'Unauthorized',
            ]);
    }
}
