import ProductDetailPage from '@/components/ProductDetailPage';

export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = params.id;
  return <ProductDetailPage id={productId} />;
}
