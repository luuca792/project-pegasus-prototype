import { Header } from '../../components/Header/Header';
import { Hero } from '../../components/Hero/Hero';
import { Gallery } from '../../components/Gallery/Gallery';
import { Services } from '../../components/Services/Services';
import { Pricing } from '../../components/Pricing/Pricing';
import { Footer } from '../../components/Footer/Footer';

export function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Gallery />
        <Services />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
