import { Hero } from '@/components/sections/Hero';
import { CurrentlyCard } from '@/components/sections/CurrentlyCard';
import { Manifesto } from '@/components/sections/Manifesto';
import { Services } from '@/components/sections/Services';
import { Toolbox } from '@/components/sections/Toolbox';
import { TrustedBy } from '@/components/sections/TrustedBy';
import { Work } from '@/components/sections/Work';
import { Statement } from '@/components/sections/Statement';
import { MarqueeSection } from '@/components/sections/Marquee';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { BehindTheScenes } from '@/components/sections/BehindTheScenes';
import { Education } from '@/components/sections/Education';
import { Testimonials } from '@/components/sections/Testimonials';
import { Press } from '@/components/sections/Press';
import { Process } from '@/components/sections/Process';
import { Studio } from '@/components/sections/Studio';
import { Archives } from '@/components/sections/Archives';
import { Contact } from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CurrentlyCard />
      <Manifesto />
      <Services />
      <Toolbox />
      <TrustedBy />
      <Work />
      {/* Sticky stacking trio — card-over-card */}
      <div className="relative">
        <Statement />
        <MarqueeSection />
        <About />
      </div>
      <Experience />
      <BehindTheScenes />
      <Education />
      <Testimonials />
      <Press />
      <Process />
      <Studio />
      <Archives />
      <Contact />
    </>
  );
}
