import { useState } from 'react';
// Assuming you have shadcn/ui components installed
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CartItem { id: string; name: string; price: number; qty: number; }

export const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (item: Omit<CartItem, 'qty'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top: Search & Scan */}
      <div className="p-4 border-b bg-white shadow-sm">
        <div className="flex gap-2">
          <Input 
            placeholder="Search items or scan barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 text-lg" // Large touch target
          />
          <Button size="icon" className="h-12 w-12">
            {/* <ScanIcon /> */} 📷
          </Button>
        </div>
      </div>

      {/* Middle: Cart Items (scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 && (
          <p className="text-center text-gray-400 mt-10">Cart is empty. Scan or search for items.</p>
        )}
        {cart.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-10 w-10">-</Button>
              <span className="w-8 text-center font-bold">{item.qty}</span>
              <Button variant="outline" size="icon" className="h-10 w-10">+</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: Checkout Button (sticky) */}
      <div className="p-4 border-t bg-white shadow-lg">
        <div className="flex justify-between mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>
        <Button 
          className="w-full h-14 text-xl font-bold" 
          onClick={() => console.log("Checkout")}
          disabled={cart.length === 0}
        >
          Charge Card
        </Button>
      </div>
    </div>
  );
};