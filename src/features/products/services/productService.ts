import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';

import { config } from '@/constants';
import { productSchema, type Product } from '@/features/products/types/product';
import { fetchProductById, fetchProducts } from '@/features/products/services/productApi';
import { mockProducts } from '@/mocks/products';
import { db } from '@/services/firebase';

const PRODUCTS_COLLECTION = 'products';

export async function getProducts(): Promise<Product[]> {
  if (config.productsSource === 'api') {
    return fetchProducts();
  }

  if (config.productsSource === 'mock') {
    return mockProducts;
  }

  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('name'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) =>
    productSchema.parse({
      id: item.id,
      ...item.data(),
    }),
  );
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (config.productsSource === 'api') {
    return fetchProductById(id);
  }

  if (config.productsSource === 'mock') {
    return mockProducts.find((product) => product.id === id);
  }

  const snapshot = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
  if (!snapshot.exists()) {
    return undefined;
  }

  return productSchema.parse({
    id: snapshot.id,
    ...snapshot.data(),
  });
}
