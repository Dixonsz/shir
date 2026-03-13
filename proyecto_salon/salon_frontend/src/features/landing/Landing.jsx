import './Landing.css';
import Header from "./components/header/Header";
import Hero from "./components/hero/Hero";
import Gallery from "./components/gallery/Gallery";
import ServicesSection from "./components/services/ServicesSection";
import TeamSection from "./components/team/TeamSection";
import Location from "../../components/common/Location";
import Schedule from "../../components/common/Schedule";
import Footer from "../../components/layout/Footer";

export default function Landing() {
    return (
        <div className="landing-page">
            <Header />
            <main className="main-content">
                <Hero />
                <Gallery />
                <ServicesSection />
                <TeamSection />
                <div className="location-schedule-wrapper">
                    <Location />
                    <Schedule />
                </div>
            </main>
            <Footer />
        </div>
    );
}