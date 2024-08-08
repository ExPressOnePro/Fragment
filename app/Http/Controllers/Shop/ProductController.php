<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    // Получение списка продуктов
    public function index(Request $request)
    {
        $sortOrder = $request->query('sortOrder', 'desc'); // По умолчанию 'desc'

        $products = Product::with('reviews.user')
            ->select('products.*')
            ->selectRaw('COALESCE(AVG(reviews.rating), 0) as average_rating')
            ->leftJoin('reviews', 'products.id', '=', 'reviews.product_id')
            ->groupBy('products.id')
            ->orderBy('average_rating', $sortOrder)  // Сортировка по рейтингу
            ->get();

        return response()->json([
            'products' => $products,
        ]);
    }


    // Создание нового продукта
    public function store(Request $request)
    {
        // Валидация входящих данных
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Условие для изображения
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Создание нового продукта
        $product = new Product();
        $product->name = $request->input('name');
        $product->description = $request->input('description');
        $product->price = $request->input('price');
        $product->category_id = $request->input('category_id');

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $product->image = $imagePath;
        }

        $product->save();

        return response()->json(['product' => $product], 201);
    }


    public function update(Request $request, $id)
    {
        // Валидация входящих данных
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Обновление существующего продукта
        $product = Product::findOrFail($id);

        // Логируем начальное состояние продукта
        \Log::info('Product before update:', $product->toArray());

        // Обновляем только измененные поля
        $changed = false;

        if ($request->has('name') && $request->input('name') !== $product->name) {
            $product->name = $request->input('name');
            $changed = true;
        }
        if ($request->has('description') && $request->input('description') !== $product->description) {
            $product->description = $request->input('description');
            $changed = true;
        }
        if ($request->has('price') && $request->input('price') !== $product->price) {
            $product->price = $request->input('price');
            $changed = true;
        }
        if ($request->has('category_id') && $request->input('category_id') !== $product->category_id) {
            $product->category_id = $request->input('category_id');
            $changed = true;
        }

        if ($request->hasFile('image')) {
            // Удаление старого изображения
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $imagePath = $request->file('image')->store('products', 'public');
            $product->image = $imagePath;
            $changed = true;
        }

        if ($changed) {
            $product->save();
            \Log::info('Product after update:', $product->toArray());
        } else {
            \Log::info('No changes detected for product:', $product->toArray());
        }

        return response()->json(['product' => $product], 200);
    }

    public function show($id)
    {
        $product = Product::with('reviews.user')->findOrFail($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        return response()->json(['product' => $product]);
    }


    // Удаление продукта
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(null, 204);
    }

    public function topRated()
    {
        $products = Product::with('reviews')
            ->withCount('reviews')
            ->get()
            ->sortByDesc(function ($product) {
                return $product->reviews->avg('rating');
            })
            ->take(3)
            ->values();  // Ensure the result is a collection

        return response()->json([
            'top_rated_products' => $products,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        $products = Product::where('name', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->with('reviews.user')
            ->get();

        return response()->json([
            'products' => $products,
        ]);
    }


}


