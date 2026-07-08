import type { MetadataRoute } from 'next';
import { products } from '@/lib/products';
import { env } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.appBaseUrl.replace(/\/$/, '');
  const routes = ['/'];
  const productRoutes = products.map((product) => `/products/${product.slug}`);

  return [...routes, ...productRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
