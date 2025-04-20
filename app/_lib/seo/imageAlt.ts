/**
 * Generates descriptive alt text for images based on content type and metadata
 */

/**
 * Generate alt text for a movie poster
 */
export function generateMovieAltText(title: string, year?: string, genres?: string[]): string {
  let altText = `Movie poster for ${title}`;
  
  if (year) {
    altText += ` (${year})`;
  }
  
  if (genres && genres.length > 0) {
    altText += `, a ${genres.slice(0, 2).join(' and ')} film`;
  }
  
  return altText;
}

/**
 * Generate alt text for a TV show poster
 */
export function generateShowAltText(title: string, year?: string, genres?: string[]): string {
  let altText = `TV series poster for ${title}`;
  
  if (year) {
    altText += ` (${year})`;
  }
  
  if (genres && genres.length > 0) {
    altText += `, a ${genres.slice(0, 2).join(' and ')} show`;
  }
  
  return altText;
}

/**
 * Generate alt text for an event poster
 */
export function generateEventAltText(title: string, location?: string, date?: string): string {
  let altText = `Event poster for ${title}`;
  
  if (location) {
    altText += ` at ${location}`;
  }
  
  if (date) {
    const eventDate = new Date(date);
    altText += ` on ${eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`;
  }
  
  return altText;
}

/**
 * Generate alt text for an article/post image
 */
export function generateArticleAltText(title: string, category?: string): string {
  let altText = `Featured image for article: ${title}`;
  
  if (category) {
    altText += ` in the ${category} category`;
  }
  
  return altText;
}

/**
 * Generate alt text for a profile image
 */
export function generateProfileAltText(name: string): string {
  return `Profile picture of ${name}`;
}

/**
 * Generate alt text for a profile cover image
 */
export function generateCoverAltText(name: string): string {
  return `Profile cover image for ${name}`;
}

/**
 * Generate alt text for a media item in a profile
 */
export function generateMediaItemAltText(title: string, type?: string): string {
  return `${type || 'Media'} item: ${title}`;
}
