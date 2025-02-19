import styles from "./ErrorComp.module.scss";

type Props = {
   error: Error;
   reset: () => void;
};

function ErrorComp({ error, reset }: Props) {
   return (
      <main className={styles.error}>
         <h1>Something went wrong!</h1>
         <p>{error.message}</p>

         <button onClick={reset}>Try again</button>
      </main>
   );
}

export default ErrorComp;
