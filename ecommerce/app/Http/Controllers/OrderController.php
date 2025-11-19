<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    //  LISTAR PEDIDOS DEL USUARIO
    public function index()
    {
        $orders = Order::with('items.product')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    // CREAR PEDIDO
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',      
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        return DB::transaction(function () use ($user, $request) {

            $total = 0;
            $items = [];

            // 1️⃣ Verificar stock y calcular total REAL
            foreach ($request->items as $item) {

                $product = Product::lockForUpdate()->find($item['id']);

                if (!$product) {
                    return response()->json(['message' => 'Producto no encontrado'], 404);
                }

                if ($product->stock < $item['quantity']) {
                    return response()->json([
                        'message' => "Stock insuficiente para: {$product->name}"
                    ], 400);
                }

                $total += $product->price * $item['quantity'];

                $items[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                ];
            }

            // 2️⃣ Crear pedido
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'pending',
            ]);

            // 3️⃣ Crear items y descontar stock
            foreach ($items as $item) {

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['product']->price, 
                ]);

                $item['product']->stock -= $item['quantity'];
                $item['product']->save();
            }

            return response()->json([
                'message' => 'Pedido creado correctamente',
                'order' => $order,
            ], 201);

        });
    }

    //  VER PEDIDO INDIVIDUAL
    public function show($id)
    {
        $order = Order::with('items.product')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }

        if ($order->user_id !== Auth::id() && !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order);
    }

    //  ACTUALIZAR ESTADO (ADMIN)
    public function update(Request $request, $id)
    {
        if (!Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,confirmed,payment_pending,payment_received,delivered,canceled',
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }

        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Estado actualizado',
            'order' => $order
        ]);
    }

    // CANCELAR PEDIDO (CLIENTE)
    
    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }

        if ($order->user_id !== Auth::id() && !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // No se puede cancelar pedidos ya entregados
        if ($order->status === 'delivered') {
            return response()->json(['message' => 'El pedido ya fue entregado'], 400);
        }

        $order->update(['status' => 'canceled']);

        return response()->json(['message' => 'Pedido cancelado']);
    }

    //  LISTAR PEDIDOS (ADMIN)
    public function adminIndex()
    {
        $orders = Order::with('items.product', 'user')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($orders);
    }
    //  VER PEDIDO ESPECÍFICO (ADMIN)
  
    public function adminShow($id)
    {
        $order = Order::with('items.product', 'user')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }

        return response()->json($order);
    }
}
