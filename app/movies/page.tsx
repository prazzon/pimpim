import { Metadata } from "next";
import Carousel from "../_components/UI/Carousel/Carousel";
import Hero from "../_components/UI/Hero/Hero";
import FilteredList from "../_components/UI/List/FilteredList/FilteredList";
import List from "../_components/UI/List/List";
import { getMovies } from "../_lib/firebase/movies/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
   title: "Movies Collection",
   description: "Browse our extensive collection of movies. Find the latest releases, popular titles, and hidden gems across various genres.",
   keywords: ["movies", "films", "cinema", "watch movies", "movie collection", "latest movies", "popular movies"],
   alternates: {
      canonical: "/movies",
   },
   openGraph: {
      title: "Movies Collection | PimPim",
      description: "Browse our extensive collection of movies. Find the latest releases, popular titles, and hidden gems across various genres.",
      url: "/movies",
      type: "website",
   },
};

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
