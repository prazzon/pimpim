// import { type Series } from "@/app/_data/types";
import { type Series } from "@/app/_lib/firebase/types";
import Image from "next/image";
import Link from "next/link";
import { FaCirclePlay } from "react-icons/fa6";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdDateRange, MdOutlineFormatListBulleted } from "react-icons/md";
import Button from "../../UI/Button/Button";
import IFrame from "../../UI/IFrame/IFrame";
import ImageLoader from "../../UI/ImageLoader/ImageLoader";
import Modal, { Content, OpenBtn } from "../../UI/Modal/Modal";
import Title from "../../UI/Title/Title";
import styles from "./Series.module.scss";

type Props = {
   series: Series;
};

function getVideoId(url: string): string | null {
   const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)(\w+).*$/;
   const match = url.match(regExp);
   return match && match[1];
}

function Series({ series }: Props) {
   return (
      <main className={styles.series}>
         <Image
            src={series.poster}
            alt={series.title}
            fill
            className={styles.background_image}
         />
         <title>{series.title}</title>
         <div className={styles.series_info}>
            <div className={styles.series_info_poster}>
               <ImageLoader src={series.poster} alt={series.title} />
            </div>
            <div className={styles.series_info_content}>
               <Link href="/shows" className={styles.back}>
                  <span>
                     <IoArrowBackOutline />
                  </span>
                  Back to all shows
               </Link>
               <h1 className={styles.title}>{series.title}</h1>
               {/* <p className={styles.text}>
                  {series.year} &bull; {series.episodes.length} episodes
               </p> */}
               <p className={styles.text}>
                  <MdDateRange />
                  {series.year}
               </p>
               <p className={styles.text}>
                  <MdOutlineFormatListBulleted />
                  {series.episodes.length} episodes
               </p>
               <div className={styles.genres}>
                  {series.genres.map((genre, index) => (
                     <span key={index} className={styles.genre}>
                        {genre}
                     </span>
                  ))}
               </div>
               <p className={styles.description}>{series.description}</p>
               <div className={styles.btns}>
                  <Modal>
                     <OpenBtn>
                        <Button type="play" btnStyle="primary">
                           <FaCirclePlay />
                           Watch First Episode
                        </Button>
                     </OpenBtn>
                     <Content>
                        <IFrame link={series.episodes[0].episodeLink} />
                     </Content>
                  </Modal>

                  <Modal>
                     <OpenBtn>
                        <Button type="play" btnStyle="secondary">
                           <FaCirclePlay />
                           Watch trailer
                        </Button>
                     </OpenBtn>
                     <Content>
                        <IFrame link={series.trailerLink} />
                     </Content>
                  </Modal>
               </div>
            </div>
         </div>

         <div className={styles.series_episodes}>
            <Title>Episodes</Title>

            {series.episodes.map((episode, index) => (
               <div className={styles.episode} key={episode.title}>
                  <div className={styles.episode_poster}>
                     <ImageLoader
                        src={`https://img.youtube.com/vi/${getVideoId(
                           episode.episodeLink
                        )}/hqdefault.jpg`}
                        alt={episode.title}
                     />

                     <Modal>
                        <OpenBtn>
                           <div className={styles.play}>
                              <FaCirclePlay />
                           </div>
                        </OpenBtn>
                        <Content>
                           <IFrame link={episode.episodeLink} />
                        </Content>
                     </Modal>
                  </div>
                  <div className={styles.episode_info}>
                     <h3 className={styles.episode_info_title}>
                        Episode {index + 1}: {episode.title}
                     </h3>
                     <p className={styles.episode_info_text}>
                        {episode.description}
                     </p>
                     {/* <Modal>
                        <OpenBtn>
                           <Button type="play" size="medium">
                              <FaCirclePlay />
                              Watch
                           </Button>
                        </OpenBtn>
                        <Content>
                           <IFrame link={episode.episodeLink} />
                        </Content>
                     </Modal> */}
                  </div>
               </div>
            ))}
         </div>
      </main>
   );
}

export default Series;
