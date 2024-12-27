import Arrivals from "./Components/Arrivals/Arrivals";
import Categories from "./Components/Categories/Categories";
import FeaturedSection from "./Components/FeaturedSection/FeaturedSection";
import Footer from "./Components/Footer";
import IconSection from "./Components/IconSection/page";
import Header from "./Components/Navbar";
import Newsletter from "./Components/Newsletter/Newsletter";
import ProductShowcase from "./Components/ProductShowcase/ProductShowcase";

export default function Home() {
  return (
    <>
      <Header />
      <ProductShowcase />
      <IconSection />
      <Categories />
      <FeaturedSection />
      <Newsletter />
      <Footer />
    </>
  );
}
