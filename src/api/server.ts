import app, { setSequelize } from "./express";
import { setupDatabase } from "./database";

const PORT = process.env.PORT ?? 3000;

setupDatabase()
    .then((sequelize) => {
        setSequelize(sequelize);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to initialize database:", err);
        process.exit(1);
    });
