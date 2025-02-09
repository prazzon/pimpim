import Movie from "@/app/_components/Pages/Movie/Movie";
// import { movies } from "@/app/_data/data-movies";
import { db } from "@/app/_lib/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { notFound } from "next/navigation";

type Props = {
   params: {
      slug: string;
   };
};

async function MoviePage({ params }: Props) {
   const { slug } = await params;

   const moviesRef = collection(db, "movies");

   const q = query(moviesRef, where("slug", "==", slug));

   const movieData = await getDocs(q).then((snaps) =>
      snaps.docs.map((d) => d.data() as Movie)
   );
   console.log(movieData);

   // console.log(slug);
   // const movie = movies.find((movie) => movie.slug === slug);

   // if (!movie) notFound();
   if (!movieData) notFound();

   return (
      <>
         {/* <Movie movie={movie} /> */}
         <Movie movie={movieData[0]} />
      </>
   );
}

export default MoviePage;
