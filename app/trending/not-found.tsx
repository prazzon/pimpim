import NotFound from "../_components/UI/NotFound/NotFound";

function NotFoundPage() {
   return (
      <>
         <NotFound
            message="Posts not found"
            backLink={{ href: "/", label: "home page" }}
         />
      </>
   );
}

export default NotFoundPage;
