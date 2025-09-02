import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper untuk memastikan folder uploads ada
const createUploadDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const handlePostMethode = async (req: NextApiRequest, res: NextApiResponse) => {

    const uploadPath = "/home/ft/uploads/berita";
  createUploadDir(uploadPath);

  const form = formidable({
    uploadDir: uploadPath,
    filename: (_, __, part) => {
      return `${part.originalFilename}`;
    },
  });

  try {
    const { fields, files } = await new Promise<{
      fields: Fields;
      files: Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });

    if (!files.file)
      return res.status(400).json({ error: "File tidak ditemukan" });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = `/uploads/berita/${file?.originalFilename}`;
    const titletmp = fields.title?.toString();
    const title = titletmp || "utitled";
    const desc = fields.description?.toString() || "description";
    const date = fields.tanggal?.toString() || "date";
  
    const saved = await prisma.berita.create({
      data: {
        title: title,
        filepath: filePath,
        description: desc,
        uploudat: date,
      },
    });
    res.status(202).json(saved);
  } catch (error) {
    console.error("Error saving file:", error);
    return res.status(500).json({ error: "Error saving file" });
  }
};

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.berita.findMany({
      orderBy: {
        uploudat: "desc",
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Error fetching content" });
  }
};



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        return handlePostMethode(req, res);
    }
    if (req.method === "GET") {
        return handleGetMethode(req, res);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
