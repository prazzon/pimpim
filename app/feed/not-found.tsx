import NotFound from "../_components/UI/NotFound/NotFound";

function NotFoundPage() {
   return (
      <>
         <NotFound
            message="Post not found"
            backLink={{ href: "/", label: "home page" }}
         />
      </>
   );
}

export default NotFoundPage;
