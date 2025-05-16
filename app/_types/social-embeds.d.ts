// Type definitions for social media embed scripts

interface InstagramEmbed {
   Embeds: {
      process: () => void;
   };
}

interface TwitterWidgets {
   widgets: {
      load: (element?: HTMLElement | null) => void;
   };
}

declare global {
   interface Window {
      instgrm?: InstagramEmbed;
      twttr?: TwitterWidgets;
   }
}

export {};
