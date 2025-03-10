import clsx from "clsx";
import Link from "next/link";
import ShinyText from "../ShinyText/ShinyText";
import styles from "./CategoryBtn.module.scss";

type Props = {
   href: string;
   text: string;
   className?: string;
};

function CategoryBtn({ href, text, className = "" }: Props) {
   return (
      <Link href={href} className={clsx(styles.category, className)}>
         <ShinyText text={text} disabled={false} speed={3} />
      </Link>
   );
}

export default CategoryBtn;
