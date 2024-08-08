<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', auth()->id())->get();
        return response()->json(['orders' => $orders]);
    }

    public function checkout(Request $request)
    {
        $cartItems = CartItem::where('user_id', auth()->id())->get();

        $order = Order::create([
            'user_id' => auth()->id(),
            'total' => $cartItems->sum(function ($item) {
                return $item->product->price * $item->quantity;
            }),
        ]);

        $cartItems->each(function ($item) use ($order) {
            $order->items()->create([
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
            ]);
            $item->delete();
        });

        return response()->json(['message' => 'Order placed successfully']);
    }

}


