import NotFound from "@/app/_components/UI/NotFound/NotFound";

function NotFoundPage() {
   return (
      <>
         <NotFound
            message="User not found"
            backLink={{ href: "/", label: "home page" }}
         />
      </>
   );
}

export default NotFoundPage;
