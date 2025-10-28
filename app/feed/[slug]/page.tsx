import Post from "@/app/_components/Pages/Feed/Post/Post";
import JsonLd from "@/app/_components/SEO/JsonLd";
import { getPostBySlug, getPosts } from "@/app/_lib/firebase/posts/service";
import { generateArticleSchema } from "@/app/_lib/seo/schema";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
   params: Promise<{ slug: string }>;
};

export const revalidate = 3600; // 1 hour in seconds

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { slug } = await params;
   const post = await getPostBySlug(slug);

   if (!post) {
      return {
         title: "Post Not Found",
         description: "The requested article could not be found.",
      };
   }

   const titleTag = post.seo?.titleTag || post.title;
   const description =
      post.seo?.metaDescription ||
      post.summary ||
      post.content.replace(/<[^>]*>/g, "").substring(0, 160) + "...";

   const canonicalSlug = post.seo?.slug || post.slug;

   // Format date for structured data
   const publishDate = post.createdAt.toISOString();

   return {
      title: titleTag,
      description,
      keywords: [
         ...(post.category ? [post.category.name] : []),
         "article",
         "blog post",
         "entertainment news",
         ...titleTag.split(" ").filter((word) => word.length > 3),
      ],
      alternates: {
         canonical: `/feed/${canonicalSlug}`,
      },
      openGraph: {
         title: titleTag,
         description,
         url: `/feed/${canonicalSlug}`,
         type: "article",
         publishedTime: publishDate,
         authors: [post.author.name],
         images: [
            {
               url: post.poster,
               width: 1200,
               height: 630,
               alt: titleTag,
            },
         ],
      },
      twitter: {
         card: "summary_large_image",
         title: titleTag,
         description,
         images: [post.poster],
      },
   };
}

export async function generateStaticParams() {
   const posts = await getPosts(100);

   return posts.map((post) => ({
      params: { slug: post.seo?.slug ?? post.slug },
   }));
}

async function PostPage({ params }: Props) {
   const { slug } = await params;

   const post = await getPostBySlug(slug);

   if (!post) notFound();

   const baseUrl = process.env.SITE_URL || "https://pimpim.ng";
   const articleSchema = generateArticleSchema(post, baseUrl);

   return (
      <>
         <JsonLd data={articleSchema} />
         <Post post={post} />
      </>
   );
}

export default PostPage;
