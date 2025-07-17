import Hero from '../components/LandingPage/Hero';
import UpcomingMatches from '../components/LandingPage/UpcomingMatches';
import OurPartners from '../components/LandingPage/OurPartners';
import AchievementsShowcase from '../components/LandingPage/AchievementsShowcase';
import Programs from '../components/LandingPage/Programs';
import Coaches from '../components/LandingPage/Coaches';
import Testimonials from '../components/LandingPage/Testimonials';
import Locations from '../components/LandingPage/Locations';



const LandingPage = () => {
  return (
    <div>
      <Hero />
      <UpcomingMatches />
      <Coaches />
      <Programs />
      <AchievementsShowcase />
      <Testimonials />
      <OurPartners />
      <Locations />
    </div>
  );
};

export default LandingPage;
