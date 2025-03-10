"use client";

import ListCard from "@/app/_components/UI/Card/ListCard/ListCard";
// import { Data } from "@/app/_data/types";
import { Data } from "@/app/_lib/firebase/types";
import clsx from "clsx";
import { useState } from "react";
import styles from "./FilteredList.module.scss";

type Props = {
   data: Data[];
};

const filters = [
   "All",
   "Action",
   "Adventure",
   "Comedy",
   "Drama",
   "Fantasy",
   "Horror",
   "Romance",
   "Sci-Fi",
   "Thriller",
];

function FilteredList({ data }: Props) {
   const [filter, setFilter] = useState("All");

   if (filter !== "All") {
      data = data.filter((dataItem) =>
         dataItem.genres.includes(filter.toLowerCase())
      );
   }

   return (
      <>
         <div className={styles.filters}>
            {filters.map((filterItem) => (
               <button
                  key={filterItem}
                  className={clsx(styles.filter, {
                     [styles.active]: filterItem === filter,
                  })}
                  onClick={() => setFilter(filterItem)}
               >
                  {filterItem}
               </button>
            ))}
         </div>
         {data.map((item) => (
            <ListCard key={item.id} item={item} />
         ))}
      </>
   );
}

export default FilteredList;
