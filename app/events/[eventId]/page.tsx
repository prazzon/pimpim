import Event from "@/app/_components/Pages/Event/Event";
import JsonLd from "@/app/_components/SEO/JsonLd";
import { events } from "@/app/_data/data-events";
import { generateEventSchema } from "@/app/_lib/seo/schema";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
   params: Promise<{ eventId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { eventId } = await params;
   const event = events.find((event) => event.id.toString() === eventId);

   if (!event) {
      return {
         title: "Event Not Found",
         description: "The requested event could not be found.",
      };
   }

   // Format date for display
   const eventDate = new Date(event.date);
   const formattedDate = eventDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
   });

   return {
      title: event.title,
      description:
         event.longDescription ||
         event.shortDescription ||
         `${event.title} - Event at ${event.location} on ${formattedDate}`,
      keywords: [
         ...(event.tags || []),
         "event",
         "entertainment event",
         "tickets",
         event.title,
         event.location,
      ],
      alternates: {
         canonical: `/events/${eventId}`,
      },
      openGraph: {
         title: `${event.title} | PimPim Events`,
         description:
            event.longDescription ||
            event.shortDescription ||
            `${event.title} - Event at ${event.location} on ${formattedDate}`,
         url: `/events/${eventId}`,
         type: "website",
         images: [
            {
               url: event.poster,
               width: 800,
               height: 600,
               alt: event.title,
            },
         ],
      },
   };
}

async function EventPage({ params }: Props) {
   const { eventId } = await params;

   const event = events.find((event) => event.id.toString() === eventId);

   if (!event) notFound();

   const eventSchema = generateEventSchema(event);

   return (
      <>
         <JsonLd data={eventSchema} />
         <Event event={event} />
      </>
   );
}

export default EventPage;
