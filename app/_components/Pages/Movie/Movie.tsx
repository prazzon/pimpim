import { type Movie } from "@/app/_lib/firebase/types";
import { generateMovieAltText } from "@/app/_lib/seo/imageAlt";
import Image from "next/image";
import Link from "next/link";
// import { BiLike } from "react-icons/bi";
// import { BsReply } from "react-icons/bs";
import { BiTimeFive } from "react-icons/bi";
import { FaCirclePlay, FaPlay } from "react-icons/fa6";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import Button from "../../UI/Button/Button";
import IFrame from "../../UI/IFrame/IFrame";
import Modal, { Content, OpenBtn } from "../../UI/Modal/Modal";
import styles from "./Movie.module.scss";

type Props = {
   movie: Movie;
};

function Movie({ movie }: Props) {
   const altText = generateMovieAltText(movie.title, movie.year, movie.genres);

   return (
      <main className={styles.movie}>
         <Image
            src={movie.poster}
            alt={altText}
            fill
            className={styles.background_image}
         />
         <div className={styles.movie_info}>
            <div className={styles.movie_info_poster}>
               <Modal>
                  <OpenBtn>
                     <div className={styles.pulse_wrapper}>
                        <div className={styles.pulse}>
                           <FaPlay />
                           <p>Watch now</p>
                        </div>
                     </div>
                  </OpenBtn>
                  <Content>
                     <IFrame link={movie.movieLink} />
                  </Content>
               </Modal>

               <Image src={movie.poster} alt={altText} fill />
            </div>
            <div className={styles.movie_info_content}>
               <Link href="/movies" className={styles.back}>
                  <span>
                     <IoArrowBackOutline />
                  </span>
                  Back to all movies
               </Link>
               <h1 className={styles.title}>{movie.title}</h1>
               {/* <p className={styles.text}>
                  {movie.year} &bull; {movie.duration} mins
               </p> */}
               <p className={styles.text}>
                  <MdDateRange />
                  {movie.year}
               </p>
               <p className={styles.text}>
                  <BiTimeFive />
                  {movie.duration} mins
               </p>

               <div className={styles.genres}>
                  {movie.genres.map((genre, index) => (
                     <span key={index} className={styles.genre}>
                        {genre}
                     </span>
                  ))}
               </div>
               <p className={styles.description}>{movie.description}</p>
               <div className={styles.btns}>
                  {/* <Modal>
                     <OpenBtn>
                        <Button type="play" btnStyle="primary">
                           <FaCirclePlay />
                           Watch now
                        </Button>
                     </OpenBtn>
                     <Content>
                        <IFrame link={movie.movieLink} />
                     </Content>
                  </Modal> */}

                  {movie.trailerLink && (
                     <Modal>
                        <OpenBtn>
                           <Button type="play" btnStyle="secondary">
                              <FaCirclePlay />
                              Watch trailer
                           </Button>
                        </OpenBtn>
                        <Content>
                           <IFrame link={movie.trailerLink} />
                        </Content>
                     </Modal>
                  )}
               </div>
            </div>
         </div>
         {/* <div className={styles.movie_comments}>
            <h1 className={styles.title}>Comments</h1>
            <div className={styles.comments}>
               <div className={styles.comment}>
                  <div className={styles.comment_img}></div>
                  <div className={styles.comment_info}>
                     <h3 className={styles.comment_info_title}>John Doe</h3>
                     <p className={styles.comment_info_time}>
                        Commented 8h ago
                     </p>
                     <p className={styles.comment_info_text}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nunc nec nisl sed augue tempor luctus. Nullam sit amet
                        justo nec libero ultrices fermentum. Nulla facilisi.
                     </p>
                     <div className={styles.comment_info_btns}>
                        <div className={styles.comment_info_btn}>
                           <BiLike />
                        </div>
                        <div className={styles.comment_info_btn}>
                           <BsReply />
                           Reply
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div> */}
      </main>
   );
}

export default Movie;
