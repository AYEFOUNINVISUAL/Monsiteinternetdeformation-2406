import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

/** Catalogue des 4 formations (source : src/api/catalog.ts). */
export function useCatalog() {
  return useQuery(orpc.catalog.list.queryOptions({ staleTime: 10 * 60_000 }));
}

/** Une formation, par référence (« E-01 ») ou par slug (« e-commerce »). */
export function useEbook(ref: string) {
  return useQuery(
    orpc.catalog.get.queryOptions({ input: { ref }, enabled: ref.length > 0, staleTime: 10 * 60_000 }),
  );
}

/** Vérifie le paiement côté serveur et délivre le lien de téléchargement privé. */
export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.orders.verify.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.orders.key() }),
    }),
  );
}

/** Détail d'une commande à partir du jeton de téléchargement (page de confirmation). */
export function useOrderByToken(token: string) {
  return useQuery(
    orpc.orders.byToken.queryOptions({
      input: { token },
      enabled: token.length > 8,
      retry: false,
      staleTime: 30_000,
    }),
  );
}
