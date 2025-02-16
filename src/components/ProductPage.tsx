import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface ProductPageProps {
  addToCart: (product: Product) => void;
}

function ProductPage({ addToCart }: ProductPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://backend-7uny.onrender.com/products", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        // Ensure all products have the required fields with default values
        const processedProducts = (Array.isArray(data) ? data : data.products || []).map((product: any, index: number) => ({
          _id: product._id || `generated-${Date.now()}-${index}`,
          name: product.name || 'Unnamed Product',
          price: typeof product.price === 'number' ? product.price : 0,
          description: product.description || 'No description available',
          image: product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
        }));

        setProducts(processedProducts);
      } catch (error) {
        setError("Error fetching products. Please try again later.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Add some sample products if the API fails
  useEffect(() => {
    if (error && products.length === 0) {
      setProducts([
        {
          _id: "sample-1",
          name: "Smartphone",
          price: 699.99,
          description: "Latest model smartphone with advanced features",
          image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        },
        {
          _id: "sample-2",
          name: "Laptop",
          price: 1299.99,
          description: "High-performance laptop for work and gaming",
          image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        },
        {
          _id: "sample-3",
          name: "Headphones",
          price: 199.99,
          description: "Wireless noise-canceling headphones",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        }
      ]);
      setError(null);
    }
  }, [error, products.length]);

  const formatPrice = (price: number) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">ShopHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/cart")}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ShoppingCart className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="mt-1 text-gray-600 text-sm">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      ${formatPrice(product.price)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductPage;