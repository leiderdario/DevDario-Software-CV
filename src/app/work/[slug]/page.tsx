import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/lib/data/projects';
import { ProjectDetail } from '@/components/sections/ProjectDetail';

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
  return {
    title: project.title,
    description: desc,
    openGraph: {
      title: `${project.title} · Leider Dario`,
      description: desc,
      images: project.image ? [project.image] : undefined,
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
  return <ProjectDetail project={project} />;
}
