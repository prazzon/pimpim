import CategoriesPaginatedList from "@/app/_components/Pages/Categories/CategoriesPaginatedList/CategoriesPaginatedList";
import { getCategoryBySlug } from "@/app/_lib/firebase/categories/service";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
   params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { slug } = await params;

   try {
      const category = await getCategoryBySlug(slug);

      if (!category) {
         return {
            title: "Category Not Found",
            description: "The requested category could not be found.",
         };
      }

      const categoryName = category.name;

      return {
         title: `${categoryName} Content`,
         description: `Browse all ${categoryName.toLowerCase()} content on PimPim. Find the latest movies, shows, and articles in the ${categoryName.toLowerCase()} category.`,
         keywords: [
            categoryName.toLowerCase(),
            "category",
            "content category",
            "entertainment category",
            `${categoryName.toLowerCase()} content`,
         ],
         alternates: {
            canonical: `/categories/${slug}`,
         },
         openGraph: {
            title: `${categoryName} Content | PimPim`,
            description: `Browse all ${categoryName.toLowerCase()} content on PimPim. Find the latest movies, shows, and articles in the ${categoryName.toLowerCase()} category.`,
            url: `/categories/${slug}`,
            type: "website",
         },
      };
   } catch {
      return {
         title: "Category Not Found",
         description: "The requested category could not be found.",
      };
   }
}

async function CategoryPage({ params }: Props) {
   const { slug } = await params;

   try {
      await getCategoryBySlug(slug);
   } catch {
      notFound();
   }

   return <CategoriesPaginatedList categorySlug={slug} />;
}

export default CategoryPage;
