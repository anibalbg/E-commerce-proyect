<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index() {
        return response()->json(['cart' => []]);
    }

    public function add(Request $request) {
        return response()->json(['message' => 'added']);
    }

    public function remove($id) {
        return response()->json(['message' => "removed $id"]);
    }

    public function clear() {
        return response()->json(['message' => 'cleared']);
    }
}
