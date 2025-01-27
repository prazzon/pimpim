import styles from "./Categories.module.scss";
import FilmCard from "./UI/Card/FilmCard/FilmCard";
import CarouselGroup from "./UI/CarouselGroup/CarouselGroup";
import { movies } from "../_data/data-movies";
import { trending } from "../_data/data-trending";

function Categories() {
   return (
      <section className={styles.categories}>
         <CarouselGroup title="Trending" link="/trending" size="large">
            {trending.map((item) => (
               <FilmCard key={item.id} item={item} size="large" />
            ))}
         </CarouselGroup>

         <CarouselGroup title="Movies" link="/movies">
            {movies.map((item) => (
               <FilmCard key={item.id} item={item} />
            ))}
         </CarouselGroup>

         <CarouselGroup title="Series" link="/series">
            {movies.map((item) => (
               <FilmCard key={item.id} item={item} />
            ))}
         </CarouselGroup>

         <CarouselGroup title="Shows" link="/shows">
            {movies.map((item) => (
               <FilmCard key={item.id} item={item} />
            ))}
         </CarouselGroup>

         {/* <CarouselGroup title="Events" link="/events">
            {movies.map((item) => (
               <FilmCard key={item.id} item={item} />
            ))}
         </CarouselGroup> */}
      </section>
   );
}

export default Categories;
