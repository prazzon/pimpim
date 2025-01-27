// import Carousel from "../_components/Carousel/Carousel";
// import Hero from "../_components/Hero";
import ListCard from "../_components/UI/Card/ListCard/ListCard";
import List from "../_components/UI/List/List";
import { trending } from "../_data/data-trending";


function TrendingPage() {
   return (
      <>
         {/* <Hero>
            <Carousel sliderData={trending} />
         </Hero> */}
         <List title="Trending">
            {trending.map((item, index) => (
               <ListCard key={item.id} item={item} position={index + 1} />
            ))}
         </List>
      </>
   );
}

export default TrendingPage
