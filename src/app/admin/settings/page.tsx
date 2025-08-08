'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from '@/components/admin/settings/general-settings';
import { SecuritySettings } from '@/components/admin/settings/security-settings';

const mockGeneralSettings = {
  siteName: 'Developer Portfolio',
  siteDescription: 'A modern portfolio showcasing development skills and projects',
  siteUrl: 'https://yourportfolio.com',
  adminEmail: 'admin@yourportfolio.com',
};

const mockSecuritySettings = {
  twoFactorEnabled: true,
  sessionTimeout: 60,
  passwordMinLength: 8,
  requireSpecialChars: true,
};

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState(mockGeneralSettings);
  const [securitySettings, setSecuritySettings] = useState(mockSecuritySettings);

  const handleSaveGeneral = (settings: typeof mockGeneralSettings) => {
    setGeneralSettings(settings);
    console.log('General settings saved:', settings);
  };

  const handleSaveSecurity = (settings: typeof mockSecuritySettings) => {
    setSecuritySettings(settings);
    console.log('Security settings saved:', settings);
  };

  return (
    <section className='p-6'>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>Settings</h1>
          <p className='text-muted-foreground'>Configure your application settings</p>
        </div>

        <Tabs defaultValue='general' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='general'>General</TabsTrigger>
            <TabsTrigger value='security'>Security</TabsTrigger>
          </TabsList>

          <TabsContent value='general'>
            <GeneralSettings settings={generalSettings} onSave={handleSaveGeneral} />
          </TabsContent>

          <TabsContent value='security'>
            <SecuritySettings settings={securitySettings} onSave={handleSaveSecurity} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
