import ComingSoon from "../_components/UI/ComingSoon/ComingSoon";

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
