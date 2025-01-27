import NotFound from "../_components/NotFound/NotFound";

function NotFoundPage() {
   return (
      <>
         <NotFound
            message="Show not found"
            backLink={{ href: "/shows", label: "shows page" }}
         />
      </>
   );
}

export default NotFoundPage;
