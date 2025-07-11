import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import errorHandler from "./middlewares/errorHandler.js"
import { logger } from "./utils/logger.js"
import morgan from "morgan"

const app = express()

app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js"
import inventoryItemRouter from "./routes/inventoryItem.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import healthCheckRouter from "./routes/healthcheck.route.js"

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/inventory", inventoryItemRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/healthCheck", healthCheckRouter)

// error Handler
app.use(errorHandler)

export { app }