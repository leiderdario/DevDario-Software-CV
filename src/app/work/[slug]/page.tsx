import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/lib/data/projects';
import { ProjectDetail } from '@/components/sections/ProjectDetail';
import { JsonLd } from '@/components/seo/JsonLd';
import { projectJsonLd, breadcrumbJsonLd } from '@/lib/data/seo';

type Params = { slug: string };

export function generateStaticParams() {
  return PROJECTS.filter((p) => p.detailHref).map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);
  if (!project) return { title: 'Project not found' };
  const desc = project.longDescription?.en ?? project.description.en;
  const canonical = project.detailHref ?? `/work/${slug}`;
  return {
    title: project.title,
    description: desc,
    keywords: project.tags,
    authors: [{ name: 'Leider Dario Bolaño Agámez' }],
    alternates: { canonical },
    openGraph: {
      title: `${project.title} · Leider Dario`,
      description: desc,
      type: 'article',
      url: canonical,
      images: project.image ? [project.image] : ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} · Leider Dario`,
      description: desc,
      images: project.image ? [project.image] : ['/opengraph-image'],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);
  if (!project || !project.detailHref) notFound();
  return (
    <>
      <JsonLd
        data={[
          projectJsonLd(project),
          breadcrumbJsonLd([
            { name: 'Inicio', path: '/' },
            { name: 'Proyectos', path: '/#work' },
            { name: project.title, path: project.detailHref },
          ]),
        ]}
      />
      <ProjectDetail project={project} />
    </>
  );
}
