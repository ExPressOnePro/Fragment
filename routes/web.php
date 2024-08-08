<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Shop\CategoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/shop', function () {
        return Inertia::render('Products/Index');
    })->name('shop');

    Route::get('/products/{id}', function ($id) {
        return Inertia::render('Products/Show', ['id' => $id]);
    });

    Route::get('/cart', function () {
        return Inertia::render('Cart/Index');
    });

    Route::get('/checkout', function () {
        return Inertia::render('Orders/Checkout');
    });



    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    });

    Route::get('/admin/products', function () {
        return Inertia::render('Admin/ProductList');
    })->name('admin.products');

    Route::get('/admin/products/create', function () {
        return Inertia::render('Admin/ProductForm');
    })->name('admin.products.create');

    Route::get('/admin/products/edit/{id}', function ($id) {
        return Inertia::render('Admin/ProductEdit', ['id' => $id]);
    });

    Route::get('/admin/categories', function () {
        return Inertia::render('Categories/Index');
    })->name('admin.categories.index');

    Route::get('/admin/categories/create', function () {
        return Inertia::render('Categories/Create');
    })->name('admin.categories.create');


});

require __DIR__.'/auth.php';
