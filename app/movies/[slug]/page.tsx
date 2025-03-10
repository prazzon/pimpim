import Movie from "@/app/_components/Pages/Movie/Movie";
import { getMovieBySlug } from "@/app/_lib/firebase/movies/service";
import { notFound } from "next/navigation";

type Props = {
   params: {
      slug: string;
   };
};

async function MoviePage({ params }: Props) {
   const { slug } = await params;

   const movieData = await getMovieBySlug(slug);

   if (!movieData) notFound();

   return (
      <>
         <Movie movie={movieData} />
      </>
   );
}

export default MoviePage;
