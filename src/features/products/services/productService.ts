import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';

import { config } from '@/constants';
import { fetchProductById, fetchProducts } from '@/features/products/services/productApi';
import { productSchema, type Product } from '@/features/products/types/product';
import { db } from '@/services/firebase';

const PRODUCTS_COLLECTION = 'products';

export async function getProducts(): Promise<Product[]> {
  if (config.productsSource === 'api') {
    return fetchProducts();
  }

  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('name'));
  const snapshot = await getDocs(q);

  return snapshot.docs.flatMap((item) => {
    const parsed = productSchema.safeParse({ id: item.id, ...item.data() });
    return parsed.success ? [parsed.data] : [];
  });
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (config.productsSource === 'api') {
    return fetchProductById(id);
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
