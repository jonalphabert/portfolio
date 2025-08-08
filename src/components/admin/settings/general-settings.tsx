import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GeneralSettingsProps {
  settings: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
  };
  onSave: (settings: GeneralSettingsProps['settings']) => void;
}

export function GeneralSettings({ settings, onSave }: GeneralSettingsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newSettings = {
      siteName: formData.get('siteName') as string,
      siteDescription: formData.get('siteDescription') as string,
      siteUrl: formData.get('siteUrl') as string,
      adminEmail: formData.get('adminEmail') as string,
    };
    onSave(newSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='siteName'>Site Name</Label>
            <Input
              id='siteName'
              name='siteName'
              defaultValue={settings.siteName}
              placeholder='Your site name'
            />
          </div>
          <div>
            <Label htmlFor='siteDescription'>Site Description</Label>
            <Textarea
              id='siteDescription'
              name='siteDescription'
              defaultValue={settings.siteDescription}
              placeholder='Brief description of your site'
            />
          </div>
          <div>
            <Label htmlFor='siteUrl'>Site URL</Label>
            <Input
              id='siteUrl'
              name='siteUrl'
              type='url'
              defaultValue={settings.siteUrl}
              placeholder='https://yoursite.com'
            />
          </div>
          <div>
            <Label htmlFor='adminEmail'>Admin Email</Label>
            <Input
              id='adminEmail'
              name='adminEmail'
              type='email'
              defaultValue={settings.adminEmail}
              placeholder='admin@yoursite.com'
            />
          </div>
          <Button type='submit' className='cursor-pointer'>
            <Save className='mr-2 h-4 w-4' />
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
