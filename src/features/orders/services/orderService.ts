import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';

import {
  createOrderSchema,
  orderSchema,
  type CreateOrderInput,
  type Order,
} from '@/features/orders/types/order';
import { db } from '@/services/firebase';

const ORDERS_COLLECTION = 'orders';

function normalizeCreatedAt(value: unknown): string | undefined {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  return typeof value === 'string' ? value : undefined;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => {
    const data = item.data();
    return orderSchema.parse({
      id: item.id,
      ...data,
      createdAt: normalizeCreatedAt(data.createdAt),
    });
  });
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const snapshot = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
  if (!snapshot.exists()) {
    return undefined;
  }

  const data = snapshot.data();
  return orderSchema.parse({
    id: snapshot.id,
    ...data,
    createdAt: normalizeCreatedAt(data.createdAt),
  });
}

export async function createOrder(userId: string, input: CreateOrderInput): Promise<string> {
  const payload = createOrderSchema.parse(input);
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...payload,
    userId,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
