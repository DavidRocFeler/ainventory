import { z } from "zod";

// Validación para rangos de fecha (ej: /history?start=2024-01-01&end=2024-01-31) 
export const DateSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha inválida"
  })
});

// Validación para IDs de ítem (ej: /history/item/123)
export const ItemHistorySchema = z.object({
  itemId: z.string().regex(/^\d+$/, "ID debe ser numérico")
});