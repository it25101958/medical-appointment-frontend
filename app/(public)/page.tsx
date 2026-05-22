import {
  Hero,
  ReviewSection,
  ServicesBento,
  WhyChooseUs,
  ContactSection,
} from "@/features/public";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <ServicesBento />
      <ReviewSection />
      <ContactSection />
    </>
  );
}
