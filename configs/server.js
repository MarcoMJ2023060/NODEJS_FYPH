"use strict";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";   
import { dbConnection } from "./mongo.js";
import { swaggerDocs, swaggerUi } from "./swagger.js";
import  apiLimiter from "../src/middlewares/rate-limit-validator.js";
import reservationRoutes from "../src/reservation/reservation.routes.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import hotelRoutes from "../src/hotel/hotel.routes.js";
import roomRoutes from "../src/room/room.routes.js";

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(apiLimiter);
}

const routes = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use("/FYPH/v1/reservations", reservationRoutes);
    app.use("/FYPH/v1/auth", authRoutes);
    app.use("/FYPH/v1/users", userRoutes);
    app.use("/FYPH/v1/hotels", hotelRoutes);
    app.use("/FYPH/v1/rooms", roomRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
    } catch (err) {
        console.log(`Database connection failed: ${err}`);
        process.exit(1);
    }
};

export const initServer = () => {
    const app = express();
    try {
        middlewares(app);
        conectarDB();
        routes(app);
        const port = process.env.PORT; 
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
};