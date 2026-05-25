import { MetadataRoute } from 'next';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://energy.texno.plus'; // Ensure this URL is correct in your .env or fallback

  // Fetch dynamic content
  const [services, portfolio, blog] = await Promise.all([
    prisma.servicePage.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.portfolioProject.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/pricing',
    '/services',
    '/portfolio',
    '/blog',
    '/standards',
    '/gallery'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes
  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const portfolioRoutes = portfolio.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const blogRoutes = blog.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes, ...blogRoutes];
}
