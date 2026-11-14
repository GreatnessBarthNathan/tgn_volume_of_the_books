import express from "express"
import * as dotenv from "dotenv"
dotenv.config()
import "express-async-errors"
import mongoose from "mongoose"
import path from "path"
import morgan from "morgan"
import helmet from "helmet"
import ExpressMongoSanitize from "express-mongo-sanitize"

const app = express()
const frontendPath = path.resolve(__dirname, "../front-end/dist")

// middlewares
import errorHandler from "./middleware/errorHandler"

// routers
import bookRouter from "./routes/bookRoute"
import chapterRouter from "./routes/chapterRoute"
import verseRouter from "./routes/verseRoute"
import authRouter from "./routes/authRoute"
import searchRouter from "./routes/searchRoute"
import AdminAccount from "./models/adminAccount"
import {
  hashPassword,
  normalizeUsername,
  validateAuthConfig,
} from "./utils/adminAuth"

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(helmet())
app.use(express.json())
app.use(ExpressMongoSanitize())
app.use(express.static(frontendPath))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/search", searchRouter)
app.use("/api/v1/book", bookRouter)
app.use("/api/v1/chapter", chapterRouter)
app.use("/api/v1/verse", verseRouter)

app.use("/api", (_req, res) => {
  res.status(404).json({ msg: "not found" })
})

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"))
})

app.use(errorHandler)

const port = process.env.PORT || 5000
const start = async () => {
  try {
    validateAuthConfig()
    const mongoUrl = process.env.MONGO_URL
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!mongoUrl) throw new Error("MONGO_URL must be configured")
    if (!adminUsername || !adminPassword) {
      throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured")
    }

    await mongoose.connect(mongoUrl)
    if ((await AdminAccount.countDocuments()) === 0) {
      await AdminAccount.create({
        username: normalizeUsername(adminUsername),
        passwordHash: hashPassword(adminPassword),
      })
    }
    await AdminAccount.updateMany(
      { authVersion: { $exists: false } },
      { $set: { authVersion: 0 } }
    )
    app.listen(port, async () => {
      console.log("connected to DB")
      console.log("server listening on port " + port)
    })
  } catch (error) {
    console.log(error)
    process.exitCode = 1
  }
}

start()
