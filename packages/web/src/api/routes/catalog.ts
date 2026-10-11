import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { base } from "../__core/app";
import { CONTACT, EBOOKS, findEbook } from "../catalog";

/**
 * Le catalogue ne dépend d'aucune base : les formations sont décrites une seule
 * fois dans src/api/catalog.ts, lu par la boutique et par l'API.
 */
export const catalog = {
  list: base.handler(() => ({ ebooks: EBOOKS, contact: CONTACT })),

  get: base
    .input(z.object({ ref: z.string().min(1) }))
    .handler(({ input }) => {
      const ebook = findEbook(input.ref);
      if (!ebook) {
        throw new ORPCError("NOT_FOUND", {
          message: `Aucune formation ne correspond à « ${input.ref} ».`,
        });
      }
      return { ebook, contact: CONTACT };
    }),
};
