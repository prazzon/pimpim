import EventCard from "../_components/UI/Card/EventCard/EventCard";
import Grid from "../_components/UI/Grid/Grid";
import { events } from "../_data/data-events";

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

export default EventsPage;
