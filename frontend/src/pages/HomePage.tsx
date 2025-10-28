import { AppLayout } from '../components/layout/AppLayout';
import { EntryManager } from '../components/EntryManager';

export function HomePage() {
  return (
    <AppLayout>
      <EntryManager />
    </AppLayout>
  );
}