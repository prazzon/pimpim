import Carousel from "../_components/Carousel/Carousel";
import Hero from "../_components/Hero";
import FilteredList from "../_components/UI/List/FilteredList/FilteredList";
import List from "../_components/UI/List/List";
import { shows } from "../_data/data-shows";

function ShowsPage() {
   return (
      <>
         <Hero>
            <Carousel sliderData={shows} />
         </Hero>
         
         <List title="Shows">
            <FilteredList data={shows} />
         </List>
      </>
   );
}

export default ShowsPage;
