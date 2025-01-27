import Movie from "@/app/_components/Pages/Movie/Movie";
import { movies } from "@/app/_data/data-movies";
import { notFound } from "next/navigation";

type Props = {
   params: {
      movieId: string;
   };
};

async function MoviePage({ params }: Props) {
   const { movieId } = await params;

   const movie = movies.find((movie) => movie.id.toString() === movieId);

   if (!movie) notFound();

   return (
      <>
         <Movie movie={movie} />
      </>
   );
}

export default MoviePage;
