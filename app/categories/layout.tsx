import CategoriesList from "../_components/Pages/Categories/CategoriesList/CategoriesList";
import Main from "../_components/UI/Main/Main";
import { getCategories } from "../_lib/firebase/categories/service";

async function Layout({ children }: { children: React.ReactNode }) {
   const categories = await getCategories();

   return (
      <Main>
         <CategoriesList categories={categories} />
         {children}
      </Main>
   );
}

export default Layout;
