'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful checkout
      clearCart();
      toast.success('¡Pedido realizado con éxito!');
      
      // Redirect to success page
      window.location.href = '/checkout-success';
    } catch (error) {
      toast.error('Error al procesar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#0A1B3D] mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8">
              Explora nuestros servicios fiscales y añade los que necesites
            </p>
            <div className="space-y-4">
              <Link href="/marketplace">
                <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                  Explorar Servicios
                </Button>
              </Link>
              <div>
                <Link href="/dashboard" className="text-[#2FD7B5] hover:underline">
                  Volver al Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
              Carrito de Compras
            </h1>
            <p className="text-gray-600">
              Revisa tus servicios antes de proceder al pago
            </p>
          </div>
          <Link href="/marketplace" className="flex items-center text-[#2FD7B5] hover:text-[#2FD7B5]/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Seguir comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Categoría:</span>
                        <span className="text-sm font-medium text-[#0A1B3D]">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#0A1B3D]">
                          €{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          €{item.price} × {item.quantity}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-0 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="text-[#0A1B3D]">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-[#0A1B3D]">
                    <span>Total</span>
                    <span>€{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                  >
                    {isLoading ? 'Procesando...' : 'Proceder al Pago'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full"
                  >
                    Vaciar Carrito
                  </Button>
                </div>

                <div className="text-xs text-gray-500 pt-4">
                  <p>• Pago seguro con cifrado SSL</p>
                  <p>• Garantía de satisfacción 100%</p>
                  <p>• Soporte técnico incluido</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}