import TrendingCategoriesList from "../_components/Pages/Trending/TrendingCategoriesList/TrendingCategoriesList";
import List from "../_components/UI/List/List";
import Main from "../_components/UI/Main/Main";
import { getCategories } from "../_lib/firebase/categories/service";

async function Layout({ children }: { children: React.ReactNode }) {
   const categories = await getCategories();

   return (
      <Main>
         <List style={{ gap: 0, marginTop: 0 }}>
            <TrendingCategoriesList 
               categories={categories} 
               showTitle={true}
               showDescription={true}
            />
            {children}
         </List>
      </Main>
   );
}

export default Layout;
