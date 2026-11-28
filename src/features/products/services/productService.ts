import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import { config } from '@/constants';
import { fetchProductById, fetchProducts } from '@/features/products/services/productApi';
import { productSchema, type Product } from '@/features/products/types/product';
import { db } from '@/services/firebase';

const PRODUCTS_COLLECTION = 'products';

export interface ProductPage {
  items: Product[];
  lastDoc?: QueryDocumentSnapshot;
  hasMore: boolean;
}

function parseSnapshotDocs(docs: QueryDocumentSnapshot[]): Product[] {
  return docs.flatMap((item) => {
    const parsed = productSchema.safeParse({ id: item.id, ...item.data() });
    return parsed.success ? [parsed.data] : [];
  });
}

export async function getProducts(): Promise<Product[]> {
  if (config.productsSource === 'api') {
    return fetchProducts();
  }

  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('name'));
  const snapshot = await getDocs(q);
  return parseSnapshotDocs(snapshot.docs);
}

// busca paginada no firestore com limit + startAfter para reduzir carga inicial
export async function getProductsPage(
  pageSize = 20,
  cursor?: QueryDocumentSnapshot,
): Promise<ProductPage> {
  if (config.productsSource === 'api') {
    const all = await fetchProducts();
    return { items: all, hasMore: false };
  }

  const q = cursor
    ? query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy('name'),
        startAfter(cursor),
        limit(pageSize),
      )
    : query(collection(db, PRODUCTS_COLLECTION), orderBy('name'), limit(pageSize));

  const snapshot = await getDocs(q);
  const items = parseSnapshotDocs(snapshot.docs);
  const lastDoc = snapshot.docs[snapshot.docs.length - 1];

  return {
    items,
    lastDoc,
    hasMore: snapshot.docs.length === pageSize,
  };
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
