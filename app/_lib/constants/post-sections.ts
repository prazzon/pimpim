// Define available post sections
export type PostSection = {
   id: string;
   name: string;
   description: string;
};

// Array of available post sections
export const POST_SECTIONS: PostSection[] = [
   {
      id: "main",
      name: "Main",
      description:
         "Posts that appear in the main content area (carousel) of the site",
   },
   {
      id: "featured",
      name: "Featured",
      description: "Posts that appear in the featured section of the site",
   },
   {
      id: "spotlight",
      name: "Spotlight",
      description: "Posts that are highlighted in the spotlight section",
   },
   {
      id: "creative-spotlight",
      name: "Creative Spotlight",
      description:
         "Posts that are highlighted in the creative spotlight section",
   },
];

// Helper function to get section by ID
export function getSectionById(id: string): PostSection | undefined {
   return POST_SECTIONS.find((section) => section.id === id);
}

// Helper function to get multiple sections by IDs
export function getSectionsByIds(ids: string[]): PostSection[] {
   return POST_SECTIONS.filter((section) => ids.includes(section.id));
}
