import SellerLayout from '../../SellerLayout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../ProductForm';
import { ensureSellerOrAdmin } from '@/lib/requireSellerPage';

export default async function NewProductPage() {
  const user = await ensureSellerOrAdmin();
  return (
    <SellerLayout user={user}>
      <Link href="/seller/products" className="text-sm text-amazon-link hover:underline flex items-center gap-1 mb-3">
        <ArrowLeft className="w-3 h-3" /> Back to products
      </Link>
      <h1 className="text-3xl font-bold mb-4">Add a new product</h1>
      <ProductForm user={user} mode="create" />
    </SellerLayout>
  );
}
