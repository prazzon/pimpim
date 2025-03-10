import NotFound from "../_components/UI/NotFound/NotFound";

function NotFoundPage() {
   return (
      <>
         <NotFound
            message="Movie not found"
            backLink={{ href: "/movies", label: "movies page" }}
         />
      </>
   );
}

export default NotFoundPage;
