import Carousel from "../_components/UI/Carousel/Carousel";
import Hero from "../_components/UI/Hero/Hero";
import FilteredList from "../_components/UI/List/FilteredList/FilteredList";
import List from "../_components/UI/List/List";
import { getMovies } from "../_lib/firebase/movies/service";

async function MoviesPage() {
   const moviesData = await getMovies();

   return (
      <>
         <Hero>
            <Carousel sliderData={moviesData} />
         </Hero>

         <List title="Movies">
            <FilteredList data={moviesData} />
         </List>
      </>
   );
}

export default MoviesPage;
