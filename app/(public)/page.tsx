import Hero from "@/components/hero-section";
import ReviewSection from "@/components/review-section";
import ServicesBento from "@/components/services-section";
import WhyChoiceUs from "@/components/aboutus-section";
import ContactSection from "@/components/contact-section";
export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyChoiceUs />
      <ServicesBento />
      <ReviewSection />
      <ContactSection />
    </>
  );
}
