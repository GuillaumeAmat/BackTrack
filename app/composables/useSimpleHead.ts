import { useHead } from '#app';

interface UseSimpleHeadOptions {
  /**
   * The language of the page, used for SEO and accessibility
   * @default 'en'
   */
  lang?: string;

  /**
   * The title of the page, used for SEO and social media sharing
   * @default 'BackTrack'
   */
  title?: string;

  /**
   * The description of the page, used for SEO and social media sharing
   */
  description?: string;

  /**
   * If true, the title will be suffixed with " - BackTrack"
   * @default true
   */
  suffixedTitle?: boolean;
}

export function useSimpleHead({
  lang = 'en',
  title = 'BackTrack',
  description,
  suffixedTitle = true,
}: UseSimpleHeadOptions) {
  return useHead({
    htmlAttrs: { lang },

    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],

    title: suffixedTitle ? `${title} - BackTrack` : title,

    meta: [
      { property: 'og:title', content: title },
      description ? { name: 'description', content: description } : null,
      description ? { property: 'og:description', content: description } : null,
    ].filter(Boolean),
  });
}

export default useSimpleHead;
