import Series from "@/app/_components/Pages/Series/Series";
import { shows } from "@/app/_data/data-shows";
import { notFound } from "next/navigation";

type Props = {
   params: {
      showId: string;
   };
};

async function ShowPage({ params }: Props) {
   const { showId } = await params;

   const show = shows.find((show) => show.id.toString() === showId);

   if (!show) notFound();

   return (
      <>
         <Series series={show} />
      </>
   );
}

export default ShowPage;
