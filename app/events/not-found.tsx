import NotFound from "../_components/NotFound/NotFound";

function NotFoundPage() {
   return (
      <>
         <NotFound
            message="Event not found"
            backLink={{ href: "/events", label: "events page" }}
         />
      </>
   );
}

export default NotFoundPage;
