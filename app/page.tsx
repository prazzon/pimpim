// import Carousel from "./_components/Carousel/Carousel";
import Categories from "./_components/Categories";
// import Hero from "./_components/Hero";
// import { trending } from "./_data/data-trending";

export default function HomePage() {
   return (
      <section>
         {/* <Hero>
            <Carousel sliderData={trending} />
         </Hero> */}
         <Categories />
      </section>
   );
}
