import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { CLUB } from '@/data/site';
import { PageHero } from '@/components/layout/PageHero';
import { ContactForm } from '@/components/forms/ContactForm';

const DETAILS = [
  { icon: Mail, label: 'Email', value: CLUB.email },
  { icon: Phone, label: 'Phone', value: CLUB.phone },
  { icon: MapPin, label: 'Find us', value: CLUB.address },
  { icon: Clock, label: 'Open studio', value: 'Saturdays, 11 am to 4 pm' },
];

export default function Contact() {
  usePageTitle('Contact');
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say hello."
        description="Questions about joining, a project you want built or a partnership idea. We read everything."
      />
      <section className="container-x grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <ul className="space-y-5">
          {DETAILS.map((d) => {
            const Icon = d.icon;
            return (
              <li key={d.label} className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface2 text-muted">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="eyebrow mb-0.5">{d.label}</p>
                  <p className="font-medium">{d.value}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="card p-6 sm:p-8">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
