import Link from 'next/link';
import { notFound } from 'next/navigation';
import IntakeForm from '@/components/IntakeForm';
import { getProductByKey } from '@/lib/products';
import { getOrderByIntakeToken } from '@/lib/store';

export default async function IntakePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await getOrderByIntakeToken(token);
  if (!order) notFound();
  const product = getProductByKey(order.productKey);
  if (!product) notFound();

  return (
    <main className="site-shell compact">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">NL</span><span>Nieves Labs</span></Link>
      </header>
      <section className="product-hero">
        <p className="eyebrow">Secure intake</p>
        <h1>{product.title}</h1>
        <p>Order {order.id.slice(0, 8)} for {order.customerEmail}</p>
      </section>
      <section className="section two-column">
        <article className="panel">
          <h2>What to upload</h2>
          <ul>{product.requiredFiles.map((file) => <li key={file}>{file}</li>)}</ul>
          <p>Accepted files: PDF, Word, images, text, CSV, and spreadsheets.</p>
        </article>
        <article className="panel">
          <h2>Submit intake</h2>
          <IntakeForm order={order} product={product} />
        </article>
      </section>
    </main>
  );
}
