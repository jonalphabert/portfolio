import { MinimalCenteredHero } from '@/components/heros/minimal-centered-hero';
import { HorizontalCarouselGallery } from '@/components/gallery/horizontal-carousel-gallery';
import SkillsCertificatesGrid from '@/components/portfolio/skills-certificates-grid';
import { ThreeColumnImageCards } from '@/components/feature/three-column-image-cards';
import { CardContactForm } from '@/components/contact/card-contact-form';

export default function Page() {
  return (
    <main>
      <MinimalCenteredHero />
      <HorizontalCarouselGallery />
      <SkillsCertificatesGrid />
      <ThreeColumnImageCards />
      <CardContactForm />
    </main>
  );
}
