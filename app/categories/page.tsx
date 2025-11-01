import { Metadata } from "next";
import CategoriesPaginatedList from "../_components/Pages/Categories/CategoriesPaginatedList/CategoriesPaginatedList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
   title: "Content Categories",
   description:
      "Browse content by categories on PimPim. Find movies, shows, and articles organized by genres, themes, and topics for easy discovery.",
   keywords: [
      "categories",
      "genres",
      "topics",
      "content categories",
      "browse by category",
      "entertainment categories",
   ],
   alternates: {
      canonical: "/categories",
   },
   openGraph: {
      title: "Content Categories | PimPim",
      description:
         "Browse content by categories on PimPim. Find movies, shows, and articles organized by genres, themes, and topics for easy discovery.",
      url: "/categories",
      type: "website",
   },
};

async function CategoriesPage() {
   return <CategoriesPaginatedList />;
}

export default CategoriesPage;
