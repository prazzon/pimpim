/**
 * Converts a display name to a username slug.
 */
export function slugify(name: string): string {
   return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumerics with dashes
      .replace(/^-+|-+$/g, ""); // remove leading/trailing dashes
}
