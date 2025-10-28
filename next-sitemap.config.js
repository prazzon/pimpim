/** @type {import('next-sitemap').IConfig} */
module.exports = {
   siteUrl: process.env.SITE_URL || "https://www.pimpim.ng",
   generateRobotsTxt: true,
   robotsTxtOptions: {
      policies: [
         {
            userAgent: "*",
            allow: "/",
         },
      ],
      additionalSitemaps: [
         `${process.env.SITE_URL || "https://www.pimpim.ng"}/sitemap.xml`,
      ],
   },
   exclude: ["/api/*", "/auth/*"],
   generateIndexSitemap: false,
   outDir: "public",
};
