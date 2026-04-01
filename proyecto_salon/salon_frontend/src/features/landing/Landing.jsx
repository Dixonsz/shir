import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Landing.css';
import Header from "./components/header/Header";
import Hero from "./components/hero/Hero";
import Gallery from "./components/gallery/Gallery";
import MarketingSection from "./components/marketing/MarketingSection";
import ServicesSection from "./components/services/ServicesSection";
import TeamSection from "./components/team/TeamSection";
import Location from "../../components/common/Location";
import Schedule from "../../components/common/Schedule";
import Footer from "../../components/layout/Footer";

export default function Landing() {
    const { hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            return;
        }

        const sectionId = hash.replace('#', '');
        const target = document.getElementById(sectionId);

        if (target) {
            window.setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 0);
        }
    }, [hash]);

    return (
        <div className="landing-page">
            <Header />
            <main className="main-content">
                <Hero />
                <Gallery />
                <MarketingSection />
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




