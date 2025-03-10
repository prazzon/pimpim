import { type Post } from "@/app/_lib/firebase/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import CategoryBtn from "../../UI/CategoryBtn/CategoryBtn";
import styles from "./Post.module.scss";

type Props = {
   post: Post;
};

async function Post({ post }: Props) {
   console.log(post);

   return (
      <div className={styles.post}>
         <div className={styles.header}>
            {post.category && (
               <CategoryBtn
                  href={`/categories/${post.category.slug}`}
                  text={post.category.name}
               />
            )}

            <p className={styles.date}>
               {formatDistanceToNow(post.createdAt, {
                  addSuffix: true,
               })}
            </p>
         </div>

         <h1 className={styles.title}>{post.title}</h1>
         <div className={styles.poster}>
            <Image src={post.poster} alt={post.title} fill />
         </div>
         <p className={styles.summary}>{post.summary}</p>

         <span className={styles.divider}></span>

         {/* <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
         /> */}

         <div className={styles.grid}>
            <div className={styles.content}>
               <p>
                  Sometimes the deals that don’t get done in the transfer window
                  are as, or even more interesting than the ones that do. These
                  are the most high profile transfers that Premier League clubs
                  couldn’t manage to pull off before the deadline.{" "}
               </p>
               The Premier League transfers that didn’t happen in January
               <h2>Trent Alexander-Arnold – Liverpool to Real Madrid</h2>
               <p>
                  The future of Trent Alexander-Arnold has been a source of much
                  discussion and speculation this season given his contract
                  situation. With his current deal set to run out in the summer,
                  the right-back has been linked with a free transfer to Real
                  Madrid at the end of the season.
               </p>
               <p>
                  Spying an opportunity to sign him now, Real submitted a £20m
                  offer in early January, which Liverpool rejected out of hand.
                  Alexander-Arnold seemingly responded to all the chatter by
                  dong a talking hand gesture after scoring against West Ham
                  United. But it feels increasingly likely he will land in the
                  Spanish capital when the transfer market re-opens.
               </p>
               <p>
                  Read – The most expensive Premier League deals in the January
                  transfer window
               </p>
               <h2>Ollie Watkins – Aston Villa to Arsenal</h2>
               <p>
                  Aston Villa had all but sold striker Jhon Duran to Al-Nassr
                  when Arsenal came out of nowhere to make a bid for Ollie
                  Watkins. In their quest to secure a No.9, the Gunners
                  reportedly offered £60m, although The Telegraph claim it was
                  actually closer to £45m.
               </p>
               <p>
                  Aside from the fact that Villa were never going to let their
                  star forward leave for that amount, the timing of the bid was
                  puzzling. Had they made an offer a week, or even a few days,
                  earlier, the Midlands outfit may have given it serious
                  consideration and held onto Duran instead.
               </p>
               <p>
                  Read – Arteta ‘disappointed’ by lack of new Arsenal signings
               </p>
               <h2>Matheus Cunha – Wolves to Nottingham Forest</h2>
               <p>
                  One of the hottest names heading in the transfer window,
                  Matheus Cunha‘s superb form for Wolves this season saw him
                  linked with Arsenal and Aston Villa. But it was Nottingham
                  Forest who were reportedly willing to make a club record bid
                  for the Wolves player, although Nuno Espirito Santo laughed
                  off the suggestion.
               </p>
               <div className={styles.image}>
                  <Image src={"/images/static.webp"} alt={"..."} fill />
               </div>
               <p>
                  The Brazil international not only remained at Molineux, but he
                  also signed a new contract, which reportedly includes a £60m
                  release clause. That could pave the way for a move in the
                  summer.
               </p>
               <p>Read – Every Premier League deal on transfer deadline day</p>
               <h2>Alejandro Garnacho – Man Utd to Chelsea or Napoli</h2>
               <p>
                  One thing Manchester United have made very clear in recent
                  weeks is that there is no one in Ruben Amorim’s squad that
                  they won’t consider selling, including their academy graduates
                  in the first team. That includes Alejandro Garnacho.
               </p>
               <p>
                  When it was reported that the Red Devils would be open to a
                  sale, it felt like they were engaging in a bit of kite flying
                  to see how the market valued the Argentine winger. At the same
                  time, the club needed to make sales before they could buy
                  anyone. Still, it seems odd to want to sell one of your most
                  promising attackers at this moment.
               </p>
               <p>
                  Chelsea were said to be preparing an offer that never, but a
                  transfer never made sense for them given all the wide
                  attackers they already have. Garnacho was also linked with
                  Napoli as a potential Kvicha Kvaratskhelia replacement, but
                  the Italian side signed Noah Okafor on loan from AC Milan
                  instead.
               </p>
               <p>
                  Read – Kane role in Tel transfer decision revealed as Arsenal
                  and Man Utd snubbed
               </p>
               <h2>Christopher Nkunku – Chelsea to Bayern Munich or Man Utd</h2>
               <p>
                  A few weeks ago it seemed entirely possible that Garnacho
                  could head to Stamford Bridge with Christopher Nkunku going
                  the other way.
               </p>
               <p>
                  Manchester United were linked with the France international
                  after reports suggested he was unhappy with his lack of
                  gametime at Chelsea, as were Bayern Munich. It appears that
                  the asking price of £65m may have proven too steep for
                  prospective buyers, but after signing no attackers in the
                  window United have missed an opportunity to improve their
                  ailing frontline.
               </p>
            </div>

            <div className={styles.sidebar}>Side Content</div>
         </div>
      </div>
   );
}

export default Post;
