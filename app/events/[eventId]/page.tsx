import Event from "@/app/_components/Pages/Event/Event";
import { events } from "@/app/_data/data-events";
import { notFound } from "next/navigation";

type Props = {
   params: Promise<{ eventId: string }>;
};

async function EventPage({ params }: Props) {
   const { eventId } = await params;

   const event = events.find((event) => event.id.toString() === eventId);

   if (!event) notFound();

   return (
      <>
         <Event event={event} />
      </>
   );
}

export default EventPage;
