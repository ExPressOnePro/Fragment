<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return response()->json(['products' => $products]);
    }

    public function store(Request $request)
    {
        $product = Product::create($request->all());
        return response()->json(['product' => $product]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return response()->json(['product' => $product]);
    }

    public function destroy($id)
    {
        Product::destroy($id);
        return response()->json(['message' => 'Product deleted']);
    }

}


