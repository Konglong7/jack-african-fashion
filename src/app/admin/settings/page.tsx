import { getSiteContent } from '@/lib/siteContent';
import { SettingsForm } from './SettingsForm';

export default async function AdminSettingsPage() {
  const settings = await getSiteContent();
  return <SettingsForm initialSettings={settings} />;
}
