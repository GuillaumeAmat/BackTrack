import { useFetch } from '#app';
import { computed } from '#imports';

type Cuid2APIResponse = {
  id: string;
};

/**
 * Fetches a CUID2 ID from the server.
 * It allows the client to get a CUID2 ID without having to download extra dependencies from the client.
 * It takes advantage of Nuxt's behavior, which directly calls the API handler function during SSR,
 * avoiding any HTTP call latency addition.
 *
 * @returns A computed property, and request status.
 */
export function useCuid2API() {
  const { data, status, error } = useFetch<Cuid2APIResponse>('/api/cuid2');

  const id = computed(() => data.value?.id ?? '');

  return {
    id,
    status,
    error,
  };
}

export default useCuid2API;
