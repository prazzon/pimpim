import styles from "./Categories.module.scss";
import FilmCard from "../Card/FilmCard/FilmCard";
import CarouselGroup from "../CarouselGroup/CarouselGroup";
import { movies } from "../../../_data/data-movies";

function Categories() {
   return (
      <section className={styles.categories}>

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
