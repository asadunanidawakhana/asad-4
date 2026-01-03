import Hero from '../../components/home/Hero';
import DiseaseCategories from '../../components/home/DiseaseCategories';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import DoctorMessage from '../../components/home/DoctorMessage';
import Testimonials from '../../components/home/Testimonials';

export default function Home() {
    return (
        <div className="space-y-0">
            <Hero />
            <DiseaseCategories />
            <FeaturedProducts />
            <DoctorMessage />
            <Testimonials />
        </div>
    );
}
