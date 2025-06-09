import { AppDataSource } from "../config/dataSource";
import { InventoryHistoryEntity } from "../entities/InventoryHistoryEntity";
import { InventoryItemsEntity } from "../entities/InventoryItemsEntity";

// Obtener historial por rango de fechas
export const getHistoryByDateRangeService = async (
    userId: number,
    startDate: Date,
    endDate: Date
) => {
    return await AppDataSource.getRepository(InventoryHistoryEntity)
        .createQueryBuilder("history")
        .innerJoin("history.item", "item")
        .innerJoin("item.inventory", "inventory")
        .innerJoin("inventory.user", "user")
        .where("user.id = :userId", { userId })
        .andWhere("history.record_date BETWEEN :start AND :end", { 
            start: startDate, 
            end: endDate 
        })
        .orderBy("history.record_date", "ASC")
        .getMany();
};

// Obtener historial completo del inventario del usuario por rango de fechas
export const getFullUserHistoryService = async (
  userId: number,
  targetDate: Date
) => {
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Fecha de hoy para determinar si estamos consultando el futuro
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isQueryingFuture = startOfDay > today;
  
  console.log("🔍 DEBUG - Rango de fechas:", { startOfDay, endOfDay, isQueryingFuture });

  // Obtener TODOS los items del usuario (sin filtrar por historial)
  const allItems = await AppDataSource.getRepository(InventoryItemsEntity)
    .createQueryBuilder("item")
    .innerJoin("item.inventory", "inventory")
    .innerJoin("inventory.user", "user")
    .innerJoin("item.product", "product")
    .select([
      "item.item_id",
      "product.product_id",
      "product.name",
      "product.unit",
      "product.icon",
      "product.category"
    ])
    .where("user.id = :userId", { userId })
    .orderBy("product.product_id", "ASC")
    .getMany();

  console.log("🔍 DEBUG - Items encontrados:", allItems.map(i => `Item ${i.item_id} - Product ${i.product.product_id}`));

  // Buscar historial para la fecha específica
  const itemIds = allItems.map(item => item.item_id);
  // console.log("🔍 DEBUG - Buscando historial para items:", itemIds);

  const historyRecords = await AppDataSource.getRepository(InventoryHistoryEntity)
    .createQueryBuilder("history")
    .innerJoin("history.item", "item")
    .innerJoin("item.product", "product")
    .select([
      "history.history_id",
      "history.record_date",
      "history.instock",
      "history.incoming",
      "history.consumed",
      "history.total",
      "item.item_id",
      "product.product_id"
    ])
    .where("item.item_id IN (:...itemIds)", { itemIds })
    .andWhere("history.record_date BETWEEN :startOfDay AND :endOfDay", {
      startOfDay,
      endOfDay
    })
    .getMany();

  // console.log("🔍 DEBUG - Historial encontrado:", historyRecords.map(h => `Item ${h.item.item_id} - Product ${h.item.product.product_id}: ${h.history_id}`));

  // Array para almacenar registros creados automáticamente
  const newRecordsToCreate = [];

  // Procesar items que NO tienen historial para la fecha consultada
  const itemsWithoutHistory = allItems.filter(item => 
    !historyRecords.some(h => h.item.item_id === item.item_id)
  );

  // Solo para consultas futuras, buscar último registro histórico disponible
  if (isQueryingFuture && itemsWithoutHistory.length > 0) {
    // console.log("🔍 DEBUG - Items sin historial en fecha futura:", itemsWithoutHistory.map(i => i.item_id));
    
    for (const item of itemsWithoutHistory) {
      // Buscar el último registro histórico anterior a la fecha consultada
      const lastHistoryRecord = await AppDataSource.getRepository(InventoryHistoryEntity)
        .createQueryBuilder("history")
        .innerJoin("history.item", "historyItem")
        .select([
          "history.instock",
          "history.incoming", 
          "history.consumed",
          "history.total"
        ])
        .where("historyItem.item_id = :itemId", { itemId: item.item_id })
        .andWhere("history.record_date < :targetDate", { targetDate: startOfDay })
        .orderBy("history.record_date", "DESC")
        .limit(1)
        .getOne();

      if (lastHistoryRecord) {
        // console.log(`🔍 DEBUG - Creando registro heredado para item ${item.item_id}`);
        
        // Crear nuevo registro con valores heredados
        const newHistoryRecord = new InventoryHistoryEntity();
        newHistoryRecord.item = { item_id: item.item_id } as any;
        // Asegurar que la fecha se mantenga exacta sin problemas de timezone
        const recordDate = new Date(targetDate);
        recordDate.setHours(12, 0, 0, 0); // Fijar a mediodía para evitar problemas UTC
        newHistoryRecord.record_date = recordDate;
        newHistoryRecord.instock = lastHistoryRecord.total; // El total del día anterior se convierte en instock
        newHistoryRecord.incoming = 0; // Resetear incoming para nueva fecha
        newHistoryRecord.consumed = 0; // Resetear consumed para nueva fecha  
        newHistoryRecord.total = lastHistoryRecord.total; // Total = instock (ya que incoming y consumed son 0)

        // Guardar en BD
        const savedRecord = await AppDataSource.getRepository(InventoryHistoryEntity).save(newHistoryRecord);
        
        // Agregar al array de historial para el resultado final
        historyRecords.push({
          history_id: savedRecord.history_id,
          record_date: savedRecord.record_date,
          instock: savedRecord.instock,
          incoming: savedRecord.incoming,
          consumed: savedRecord.consumed,
          total: savedRecord.total,
          item: { 
            item_id: item.item_id,
            product: {
              product_id: item.product.product_id
            }
          }
        } as any);

        // console.log(`✅ DEBUG - Registro creado: ${savedRecord.history_id} para item ${item.item_id}`);
      }
    }
  }

  // Combinar TODOS los items agrupando por product_id
  const result = allItems.map(item => {
    // Buscar historial por item_id
    const historyForItem = historyRecords.find(h => h.item.item_id === item.item_id);
    
    return {
      item_id: item.item_id,
      product_id: item.product.product_id,
      name: item.product.name,
      unit: item.product.unit,
      icon: item.product.icon,
      category: item.product.category,
      history_id: historyForItem?.history_id || null,
      record_date: historyForItem?.record_date || null,
      instock: historyForItem?.instock || 0,
      incoming: historyForItem?.incoming || 0,
      consumed: historyForItem?.consumed || 0,
      total: historyForItem?.total || 0
    };
  });

  // console.log("🔍 DEBUG - Resultado final:", result.map(r => `Product ${r.product_id}: ${r.name} (Item ${r.item_id})`));

  // Ordenar el resultado final por product_id
  return result.sort((a, b) => a.product_id - b.product_id);
};

// Obtener historial de un ítem específico
export const getItemHistoryService = async (
    userId: number,
    itemId: number
) => {
    return await AppDataSource.getRepository(InventoryHistoryEntity)
        .createQueryBuilder("history")
        .innerJoin("history.item", "item")
        .innerJoin("item.inventory", "inventory")
        .where("inventory.userId = :userId", { userId })
        .andWhere("item.item_id = :itemId", { itemId })
        .orderBy("history.record_date", "DESC")
        .getMany();
};

// Crear snapshot manual
export const createSnapshotService = async (userId: number) => {
    const items = await AppDataSource.getRepository(InventoryItemsEntity)
        .find({ 
            where: { inventory: { user: { id: userId } } },
            relations: ["inventory"] 
        });

    const historyRecords = items.map(item => ({
        item,
        record_date: new Date(),
        instock: item.instock,
        incoming: item.incoming,
        consumed: item.consumed,
        total: item.total
    }));

    await AppDataSource.getRepository(InventoryHistoryEntity)
        .save(historyRecords);
};