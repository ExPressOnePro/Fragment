<?php

namespace Database\Factories\Shop;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->text(200),
            'price' => $this->faker->randomFloat(2, 1, 100),
            'category_id' => Category::factory(),
            'image' => $this->faker->imageUrl(640, 480, 'technics', true),
        ];
    }
}
