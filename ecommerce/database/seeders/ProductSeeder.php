<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $ropa     = Category::where('name', 'Ropa de Golf')->first();
        $palos    = Category::where('name', 'Palos de Golf')->first();
        $acces    = Category::where('name', 'Accesorios')->first();
        $pelotas  = Category::where('name', 'Pelotas')->first();

        Product::create([
            'name'        => 'Polo Nike Dri-FIT Verde',
            'description' => 'Polo transpirable para golf',
            'price'       => 39.99,
            'stock'       => 25,
            'category_id' => $ropa->id,
        ]);

        Product::create([
            'name'        => 'Pantalón Oakley Stretch',
            'description' => 'Elástico y cómodo',
            'price'       => 59.99,
            'stock'       => 15,
            'category_id' => $ropa->id,
        ]);

        Product::create([
            'name'        => 'Driver TaylorMade Stealth 2',
            'description' => 'Driver de última generación',
            'price'       => 429.99,
            'stock'       => 5,
            'category_id' => $palos->id,
        ]);

        Product::create([
            'name'        => 'Hierros Mizuno JPX900',
            'description' => 'Set completo de hierros forjados',
            'price'       => 899.99,
            'stock'       => 3,
            'category_id' => $palos->id,
        ]);

        Product::create([
            'name'        => 'Pelotas Titleist Pro V1 (pack 12)',
            'description' => 'Las bolas más usadas en el tour',
            'price'       => 54.99,
            'stock'       => 60,
            'category_id' => $pelotas->id,
        ]);

        Product::create([
            'name'        => 'Gorra Titleist Tour',
            'description' => 'Gorra oficial Titleist',
            'price'       => 24.99,
            'stock'       => 40,
            'category_id' => $acces->id,
        ]);
    }
}
