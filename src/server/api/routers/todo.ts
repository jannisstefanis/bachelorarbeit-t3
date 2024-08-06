import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const TodoSchema = z.object({
  id: z.number(),
  description: z.string(),
  dueAt: z.date().nullable(),
  isDone: z.boolean(),
});

export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.todo.findMany();
  }),
  create: publicProcedure
    .input(
      z.object({
        description: z.string(),
        dueAt: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: input,
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        description: z.string(),
        dueAt: z.date().nullable(),
        isDone: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.update({
        where: { id: input.id },
        data: input,
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: { id: input.id },
      });
    }),
});
