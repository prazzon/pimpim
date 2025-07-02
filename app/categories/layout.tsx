import CategoriesList from "../_components/Pages/Categories/CategoriesList/CategoriesList";
import List from "../_components/UI/List/List";
import Main from "../_components/UI/Main/Main";
import { getCategoriesWithPostCount } from "../_lib/firebase/categories/service";

async function Layout({ children }: { children: React.ReactNode }) {
   const categories = await getCategoriesWithPostCount();

   return (
      <Main>
         <List style={{ gap: 0, marginTop: 0 }}>
            <CategoriesList categories={categories} />
            {children}
         </List>
      </Main>
   );
}

export default Layout;
