import { Save, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SecuritySettingsProps {
  settings: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
  };
  onSave: (settings: SecuritySettingsProps['settings']) => void;
}

export function SecuritySettings({ settings, onSave }: SecuritySettingsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newSettings = {
      twoFactorEnabled: formData.get('twoFactorEnabled') === 'on',
      sessionTimeout: Number(formData.get('sessionTimeout')),
      passwordMinLength: Number(formData.get('passwordMinLength')),
      requireSpecialChars: formData.get('requireSpecialChars') === 'on',
    };
    onSave(newSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Shield className='h-5 w-5' />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <Label htmlFor='twoFactor'>Two-Factor Authentication</Label>
              <p className='text-muted-foreground text-sm'>Require 2FA for all admin accounts</p>
            </div>
            <Switch
              id='twoFactor'
              name='twoFactorEnabled'
              defaultChecked={settings.twoFactorEnabled}
            />
          </div>

          <div>
            <Label htmlFor='sessionTimeout'>Session Timeout (minutes)</Label>
            <Input
              id='sessionTimeout'
              name='sessionTimeout'
              type='number'
              defaultValue={settings.sessionTimeout}
              min='5'
              max='1440'
            />
          </div>

          <div>
            <Label htmlFor='passwordMinLength'>Minimum Password Length</Label>
            <Input
              id='passwordMinLength'
              name='passwordMinLength'
              type='number'
              defaultValue={settings.passwordMinLength}
              min='6'
              max='50'
            />
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <Label htmlFor='requireSpecialChars'>Require Special Characters</Label>
              <p className='text-muted-foreground text-sm'>
                Passwords must contain special characters
              </p>
            </div>
            <Switch
              id='requireSpecialChars'
              name='requireSpecialChars'
              defaultChecked={settings.requireSpecialChars}
            />
          </div>

          <Button type='submit' className='cursor-pointer'>
            <Save className='mr-2 h-4 w-4' />
            Save Security Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
