import { ProjectEditor } from '@/components/admin/project/project-editor';

export default function ProjectEditorSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProjectEditor params={params} />;
}