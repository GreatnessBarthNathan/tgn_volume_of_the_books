import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { BadRequestError } from "../errors/customErrors"
import Chapter from "../models/chapter"
import Verse from "../models/verse"

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const searchArchive = async (req: Request, res: Response) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : ""
  if (!query || query.length > 100) {
    throw new BadRequestError("Search text must be between 1 and 100 characters")
  }

  const pattern = new RegExp(escapeRegex(query), "i")
  const [chapters, verses] = await Promise.all([
    Chapter.find({
      $or: [{ name: pattern }, { word: pattern }, { declaration: pattern }],
    })
      .select("name word declaration book date")
      .sort({ book: -1, date: -1 })
      .limit(30)
      .lean(),
    Verse.find({ prophecy: pattern })
      .select("prophecy book chapter date")
      .sort({ book: -1, date: -1 })
      .limit(30)
      .lean(),
  ])

  res.status(StatusCodes.OK).json({ chapters, verses })
}
