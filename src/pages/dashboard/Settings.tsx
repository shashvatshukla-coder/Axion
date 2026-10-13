import { useState } from 'react';
import type { FormEvent } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useToast } from '@/hooks/useToast';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/common/Button';
import { FormInput } from '@/components/common/FormInput';

const themes: Array<{ id: Theme; label: string; icon: LucideIcon }> = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

interface Toggle {
  id: string;
  label: string;
  hint: string;
}

const toggles: Toggle[] = [
  { id: 'ideas', label: 'New idea submissions', hint: 'When someone submits an idea to the incubator.' },
  { id: 'leads', label: 'New client requests', hint: 'When a client fills in the project request form.' },
  { id: 'deliveries', label: 'Delivery reminders', hint: 'A nudge two days before a milestone is due.' },
  { id: 'digest', label: 'Weekly digest', hint: 'A Monday summary of the club.' },
];

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        checked ? 'border-accent bg-accent' : 'bg-surface-2',
      )}
    >
      <span
        className={cn(
          'absolute left-0.5 top-0.5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
        style={{ width: 18, height: 18 }}
      />
    </button>
  );
}

export default function Settings() {
  usePageTitle('Settings');
  const toast = useToast();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({ name: 'Club Admin', email: 'admin@foundry.club', role: 'Core team' });
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ ideas: true, leads: true, deliveries: true, digest: false });
  const [saving, setSaving] = useState(false);

  const save = (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved on this device.');
    }, 500);
  };

  return (
    <>
      <PageHeader title="Settings" description="Your profile, how the dashboard looks and what you get notified about." />
      <form onSubmit={save} className="max-w-3xl space-y-6">
        <section className="card space-y-4 p-5">
          <h2 className="font-semibold tracking-tight">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <FormInput label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            <FormInput label="Role" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
          </div>
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="font-semibold tracking-tight">Appearance</h2>
          <div className="inline-flex rounded-xl border bg-surface-2 p-1" role="radiogroup" aria-label="Theme">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={theme === t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm transition-colors',
                  theme === t.id ? 'bg-surface font-medium shadow-sm' : 'text-muted hover:text-fg',
                )}
              >
                <t.icon className="h-4 w-4" aria-hidden /> {t.label}
              </button>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold tracking-tight">Notifications</h2>
          <ul className="mt-2 divide-y">
            {toggles.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-3.5">
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted">{t.hint}</p>
                </div>
                <Switch label={t.label} checked={prefs[t.id] ?? false} onChange={(v) => setPrefs({ ...prefs, [t.id]: v })} />
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold tracking-tight">Backend</h2>
          <p className="mt-2 text-sm text-muted">
            The dashboard currently runs on mock data. Set <code className="font-mono text-fg">VITE_API_URL</code> in a{' '}
            <code className="font-mono text-fg">.env</code> file and replace the mock calls in <code className="font-mono text-fg">src/services</code>{' '}
            with <code className="font-mono text-fg">http()</code> from <code className="font-mono text-fg">src/lib/api.ts</code>.
          </p>
        </section>

        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            Save changes
          </Button>
        </div>
      </form>
    </>
  );
}
