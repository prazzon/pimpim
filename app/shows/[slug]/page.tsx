import Series from "@/app/_components/Pages/Series/Series";
import { shows } from "@/app/_data/data-shows";
import { notFound } from "next/navigation";

type Props = {
   params: {
      slug: string;
   };
};

async function ShowPage({ params }: Props) {
   const { slug } = await params;

   const show = shows.find((show) => show.slug === slug);

   if (!show) notFound();

   return (
      <>
         <Series series={show} />
      </>
   );
}

export default ShowPage;
