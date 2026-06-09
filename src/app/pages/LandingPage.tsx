import Nav from "../components/figma/Nav";
import Hero from "../components/figma/Hero";
import Ticker from "../components/figma/Ticker";
import Courses from "../components/figma/Courses";
import Events from "../components/figma/Events";
import Methodology from "../components/figma/Methodology";
import Faculty from "../components/figma/Faculty";
import Testimonials from "../components/figma/Testimonials";
import CtaSection from "../components/figma/CtaSection";
import Footer from "../components/figma/Footer";

export default function LandingPage() {
  return (
    <div
      className="bg-background text-foreground min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`
        html { scrollbar-width: none; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <Nav />
      <Hero />
      <Ticker />
      <Courses />
      <Events />
      <Methodology />
      <Faculty />
      <Testimonials />
      <CtaSection />
      <Footer />
    </div>
  );
}
