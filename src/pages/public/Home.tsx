import { usePageTitle } from '@/hooks/usePageTitle';
import { Hero } from '@/components/home/Hero';
import { WhatWeDo } from '@/components/home/WhatWeDo';
import { StartupJourney } from '@/components/home/StartupJourney';
import { IncubatorSection } from '@/components/incubator/IncubatorSection';
import { AgencySection } from '@/components/agency/AgencySection';
import { EcosystemSection } from '@/components/home/EcosystemSection';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ImpactNumbers } from '@/components/home/ImpactNumbers';
import { JoinCta } from '@/components/home/JoinCta';

export default function Home() {
  usePageTitle();
  return (
    <>
      <Hero />
      <WhatWeDo />
      <StartupJourney />
      <IncubatorSection />
      <AgencySection />
      <EcosystemSection />
      <FeaturedProjects />
      <ImpactNumbers />
      <JoinCta />
    </>
  );
}
