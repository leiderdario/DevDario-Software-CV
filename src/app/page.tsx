import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { TrustedBy } from '@/components/sections/TrustedBy';
import { Work } from '@/components/sections/Work';
import { Statement } from '@/components/sections/Statement';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Achievements } from '@/components/sections/Achievements';
import { Education } from '@/components/sections/Education';
import { Certifications } from '@/components/sections/Certifications';
import { Toolbox } from '@/components/sections/Toolbox';
import { Testimonials } from '@/components/sections/Testimonials';
import { Studio } from '@/components/sections/Studio';
import { ContactForm } from '@/components/sections/ContactForm';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <TrustedBy />
      <Work />
      <div className="relative">
        <Statement />
        <About />
      </div>
      <Experience />
      <Achievements />
      <Education />
      <Certifications />
      <Toolbox />
      <Testimonials />
      <Studio />
      <ContactForm />
    </>
  );
}
