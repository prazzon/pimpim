import { Metadata } from "next";
import Carousel from "../_components/UI/Carousel/Carousel";
import Hero from "../_components/UI/Hero/Hero";
import FilteredList from "../_components/UI/List/FilteredList/FilteredList";
import List from "../_components/UI/List/List";
import { getSeries } from "../_lib/firebase/series/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
   title: "TV Shows Collection",
   description:
      "Explore our collection of TV shows and series. Find popular series, new releases, and binge-worthy content across different genres.",
   keywords: [
      "TV shows",
      "series",
      "television",
      "watch shows",
      "TV series",
      "popular shows",
      "streaming",
   ],
   alternates: {
      canonical: "/shows",
   },
   openGraph: {
      title: "TV Shows Collection | PimPim",
      description:
         "Explore our collection of TV shows and series. Find popular series, new releases, and binge-worthy content across different genres.",
      url: "/shows",
      type: "website",
   },
};

async function ShowsPage() {
   const showsData = await getSeries();

   return (
      <>
         <Hero>
            <Carousel sliderData={showsData} />
         </Hero>

         <List title="Shows">
            <FilteredList data={showsData} />
         </List>
      </>
   );
}

export default ShowsPage;
