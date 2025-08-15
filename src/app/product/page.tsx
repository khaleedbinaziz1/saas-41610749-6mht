'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductDetail1 from '../../components/ProductDetail/ProductDetail1';
import { CartProvider } from '../../components/Cart/CartProvider';
import { useApiConfig } from '../../context/ApiConfigContext';

export default function ProductPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { publicBaseUrl, storeId } = useApiConfig();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product from:', publicBaseUrl);
        console.log('Store ID:', storeId);
        
        // Use store-scoped API endpoint
        const apiUrl = publicBaseUrl ? `${publicBaseUrl}products/${productId}` : `/api/products/${productId}`;
        const response = await axios.get(apiUrl);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, publicBaseUrl, storeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600">The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <ProductDetail1 product={product} />
    </CartProvider>
  );
}