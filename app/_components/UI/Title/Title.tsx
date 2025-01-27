import styles from "./Title.module.scss"

type Props = {
   children: React.ReactNode;
}

function Title({children}: Props) {
   return (
      <h2 className={styles.title}>
         {children}
      </h2>
   )
}

export default Title
