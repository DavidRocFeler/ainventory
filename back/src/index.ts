import dotenv from "dotenv";
dotenv.config(); // ✅ Cargar variables de entorno desde .env

import app from "./server";
import "reflect-metadata";
import { AppDataSource } from "./config/dataSource";
import { preLoadUsers } from "./helpers/preLoadUsers";
import { preLoadProducts } from "./helpers/preLoadProducts";
import { preLoadInventories } from "./helpers/preLoadInventory";

const initialize = async () => {
    try {
        console.log("🚀 Initializing server...");

        // Conectar a la base de datos
        await AppDataSource.initialize();
        console.log("✅ Database initialized");

        await preLoadProducts();
        console.log("✅ Products preloaded");

        await preLoadUsers();
        console.log("✅ Users preloaded");

        await preLoadInventories();

        // ✅ Usar process.env.PORT directamente
        const SERVER_PORT = process.env.PORT || 3000;

        app.listen(SERVER_PORT, () => {
            console.log(`🚀 Server running on port ${SERVER_PORT}`);
        });

    } catch (error) {
        console.error("❌ Error initializing the server:", error);
        process.exit(1); // Detener el proceso si hay un error crítico
    }
};

// Iniciar el servidor
initialize();


// import { PORT } from "./config/envs";
// import app from "./server";
// import "reflect-metadata"
// import { AppDataSource } from "./config/dataSource";
// import { preLoadCategories } from "./helpers/preLoadCategories";
// import { preLoadProducts } from "./helpers/preLoadProducts";

// const initialize = async () => {
//     console.log("Initializing server");
//     await AppDataSource.initialize();
//     console.log("Database initialized");
//     await preLoadCategories();
//     await preLoadProducts();
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// }

// initialize();

