import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import ProductPage from "./components/ProductPage";
import CartPage from "./components/CartPage";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

function App() {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const user = localStorage.getItem("user");
    return user ? <>{children}</> : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductPage addToCart={addToCart} />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage cart={cart} removeFromCart={removeFromCart} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;