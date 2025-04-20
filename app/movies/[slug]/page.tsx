import Movie from "@/app/_components/Pages/Movie/Movie";
import JsonLd from "@/app/_components/SEO/JsonLd";
import { getMovieBySlug } from "@/app/_lib/firebase/movies/service";
import { generateMovieSchema } from "@/app/_lib/seo/schema";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
   params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { slug } = await params;
   const movieData = await getMovieBySlug(slug);

   if (!movieData) {
      return {
         title: "Movie Not Found",
         description: "The requested movie could not be found.",
      };
   }

   return {
      title: `${movieData.title} (${movieData.year})`,
      description:
         movieData.description ||
         `Watch ${movieData.title}, a ${movieData.year} movie on PimPim.`,
      keywords: [
         ...(movieData.genres || []),
         "movie",
         "film",
         "watch online",
         movieData.title,
         movieData.year,
      ],
      alternates: {
         canonical: `/movies/${slug}`,
      },
      openGraph: {
         title: `${movieData.title} (${movieData.year}) | PimPim`,
         description:
            movieData.description ||
            `Watch ${movieData.title}, a ${movieData.year} movie on PimPim.`,
         url: `/movies/${slug}`,
         type: "video.movie",
         images: [
            {
               url: movieData.poster,
               width: 800,
               height: 600,
               alt: movieData.title,
            },
         ],
      },
   };
}

async function MoviePage({ params }: Props) {
   const { slug } = await params;

   const movieData = await getMovieBySlug(slug);

   if (!movieData) notFound();

   const baseUrl = process.env.SITE_URL || "https://pimpim.ng";
   const movieSchema = generateMovieSchema(movieData, baseUrl);

   return (
      <>
         <JsonLd data={movieSchema} />
         <Movie movie={movieData} />
      </>
   );
}

export default MoviePage;
