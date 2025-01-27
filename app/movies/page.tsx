import Carousel from "../_components/Carousel/Carousel";
import Hero from "../_components/Hero";
import FilteredList from "../_components/UI/List/FilteredList/FilteredList";
import List from "../_components/UI/List/List";
import { movies } from "../_data/data-movies";

function MoviesPage() {
   return (
      <>
         <Hero>
            <Carousel sliderData={movies} />
         </Hero>
         <List title="Movies">
            <FilteredList data={movies} />
         </List>
      </>
   );
}

export default MoviesPage
