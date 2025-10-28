import Series from "@/app/_components/Pages/Series/Series";
import JsonLd from "@/app/_components/SEO/JsonLd";
import { getSeriesBySlug } from "@/app/_lib/firebase/series/service";
import { generateTVSeriesSchema } from "@/app/_lib/seo/schema";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
   params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { slug } = await params;

   const show = await getSeriesBySlug(slug);

   if (!show) {
      return {
         title: "Show Not Found",
         description: "The requested TV show could not be found.",
      };
   }

   return {
      title: `${show.title} (${show.year})`,
      description:
         show.description ||
         `Watch ${show.title}, a ${show.year} TV series on PimPim.`,
      keywords: [
         ...(show.genres || []),
         "TV show",
         "series",
         "watch online",
         show.title,
         show.year,
      ],
      alternates: {
         canonical: `/shows/${slug}`,
      },
      openGraph: {
         title: `${show.title} (${show.year}) | PimPim`,
         description:
            show.description ||
            `Watch ${show.title}, a ${show.year} TV series on PimPim.`,
         url: `/shows/${slug}`,
         type: "video.tv_show",
         images: [
            {
               url: show.poster,
               width: 800,
               height: 600,
               alt: show.title,
            },
         ],
      },
   };
}

async function ShowPage({ params }: Props) {
   const { slug } = await params;

   const show = await getSeriesBySlug(slug);

   if (!show) notFound();

   const baseUrl = process.env.SITE_URL || "https://www.pimpim.ng";
   const tvSeriesSchema = generateTVSeriesSchema(show, baseUrl);

   return (
      <>
         <JsonLd data={tvSeriesSchema} />
         <Series series={show} />
      </>
   );
}

export default ShowPage;
