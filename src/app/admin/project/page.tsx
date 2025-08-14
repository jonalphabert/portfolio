import { ProjectList } from '@/components/admin/project/project-list';

export default function AdminProjectPage() {
  return (
    <section className="p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your projects</p>
        </div>
        
        <ProjectList />
      </div>
    </section>
  );
}