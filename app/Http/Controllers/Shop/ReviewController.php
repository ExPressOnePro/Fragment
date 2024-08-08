<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $review = new Review();
            $review->product_id = $request->input('product_id');
            $review->user_id = Auth::id(); // Пользователь, который оставляет отзыв
            $review->rating = $request->input('rating');
            $review->content = $request->input('content') ?? '';
            $review->save();

            return response()->json(['review' => $review], 201);
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Review save error: ' . $e->getMessage());

            return response()->json(['error' => 'An error occurred while saving the review.'], 500);
        }
    }
    // Метод для получения всех отзывов для продукта
    public function index($productId)
    {
        $reviews = Review::where('product_id', $productId)->with('user')->get();
        return response()->json(['reviews' => $reviews]);
    }

    public function show($id)
    {
        $product = Product::with('reviews')->findOrFail($id);
        return response()->json(['product' => $product]);
    }

    // Метод для обновления отзыва
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $review = Review::findOrFail($id);

        if ($review->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $review->rating = $request->input('rating');
        $review->comment = $request->input('comment');
        $review->save();

        return response()->json(['review' => $review]);
    }

    // Метод для удаления отзыва
    public function destroy($id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $review->delete();
        return response()->json(['message' => 'Review deleted successfully']);
    }
}
