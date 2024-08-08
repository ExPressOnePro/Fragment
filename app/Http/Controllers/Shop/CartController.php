<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = CartItem::where('user_id', auth()->id())->with('product')->get();
        return response()->json(['cartItems' => $cartItems]);
    }

    public function add(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $product = Product::find($request->product_id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $quantity = $request->quantity;

        CartItem::updateOrCreate(
            ['user_id' => auth()->id(), 'product_id' => $product->id],
            ['quantity' => $quantity]
        );

        return response()->json(['message' => 'Product added to cart']);
    }
}


