import Post from "@/app/_components/Pages/Feed/Post/Post";
import JsonLd from "@/app/_components/SEO/JsonLd";
import { getPostBySlug, getPosts } from "@/app/_lib/firebase/posts/service";
import { getViewCount } from "@/app/_lib/firebase/views/service";
import { generateArticleSchema } from "@/app/_lib/seo/schema";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
   params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { slug } = await params;
   const post = await getPostBySlug(slug);

   if (!post) {
      return {
         title: "Post Not Found",
         description: "The requested article could not be found.",
      };
   }

   // Extract a clean description from the content (without HTML tags)
   const cleanDescription =
      post.summary ||
      post.content.replace(/<[^>]*>/g, "").substring(0, 160) + "...";

   // Format date for structured data
   const publishDate = post.createdAt.toISOString();

   return {
      title: post.title,
      description: cleanDescription,
      keywords: [
         ...(post.category ? [post.category.name] : []),
         "article",
         "blog post",
         "entertainment news",
         ...post.title.split(" ").filter((word) => word.length > 3),
      ],
      alternates: {
         canonical: `/feed/${slug}`,
      },
      openGraph: {
         title: post.title,
         description: cleanDescription,
         url: `/feed/${slug}`,
         type: "article",
         publishedTime: publishDate,
         authors: [post.author.name],
         images: [
            {
               url: post.poster,
               width: 1200,
               height: 630,
               alt: post.title,
            },
         ],
      },
      twitter: {
         card: "summary_large_image",
         title: post.title,
         description: cleanDescription,
         images: [post.poster],
      },
   };
}

export async function generateStaticParams() {
   const posts = await getPosts(20);

   return posts.map((post) => ({
      params: { slug: post.slug },
   }));
}

async function PostPage({ params }: Props) {
   const { slug } = await params;

   const post = await getPostBySlug(slug);

   if (!post) notFound();

   const viewCount = await getViewCount(post.id);

   const baseUrl = process.env.SITE_URL || "https://pimpim.ng";
   const articleSchema = generateArticleSchema(post, baseUrl);

   return (
      <>
         <JsonLd data={articleSchema} />
         <Post post={post} viewCount={viewCount} />
      </>
   );
}

export default PostPage;
