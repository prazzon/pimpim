import { Metadata } from "next";
import ComingSoon from "../_components/UI/ComingSoon/ComingSoon";

export const metadata: Metadata = {
   title: "Events - Coming Soon",
   description: "Stay tuned for exciting events coming soon to PimPim. We're working on bringing you concerts, festivals, and more entertainment options.",
   keywords: ["events", "concerts", "festivals", "entertainment events", "upcoming events", "live events"],
   alternates: {
      canonical: "/events",
   },
   openGraph: {
      title: "Events - Coming Soon | PimPim",
      description: "Stay tuned for exciting events coming soon to PimPim. We're working on bringing you concerts, festivals, and more entertainment options.",
      url: "/events",
      type: "website",
   },
};

function EventsPage() {
   return (
      <>
         <ComingSoon
            title="Events Coming Soon"
            message="We're working hard to bring you exciting events. Check back soon for updates on upcoming concerts, festivals, and more entertainment options!"
            icon="tools"
         />
      </>
   );
}

export default EventsPage;

/* Original implementation (commented out)
import EventCard from "../_components/UI/Card/EventCard/EventCard";
import Grid from "../_components/UI/Grid/Grid";
import { events } from "../_data/data-events";

export const dynamic = "force-dynamic";

function EventsPage() {
   return (
      <>
         <Grid title="Events">
            {events.map((event) => (
               <EventCard key={event.id} event={event} />
            ))}
         </Grid>
      </>
   );
}
*/
