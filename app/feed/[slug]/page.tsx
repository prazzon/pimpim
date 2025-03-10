import Post from "@/app/_components/Pages/Feed/Post";
import { getPostBySlug } from "@/app/_lib/firebase/posts/service";
import { notFound } from "next/navigation";

type Props = {
   params: {
      slug: string;
   };
};

async function PostPage({ params }: Props) {
   const { slug } = await params;

   const post = await getPostBySlug(slug);

   if (!post) notFound();

   return (
      <>
         <Post post={post} />
      </>
   );
}

export default PostPage;
