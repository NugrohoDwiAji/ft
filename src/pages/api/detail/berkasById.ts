// pages/api/berkas/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ 
      error: "Invalid ID",
      message: "ID berkas tidak valid" 
    });
  }

  if (req.method === "GET") {
    try {
      const berkas = await prisma.berkas.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          filepath: true,
          uploadat: true,
        },
      });

      if (!berkas) {
        return res.status(404).json({ 
          error: "Not found",
          message: "Berkas tidak ditemukan" 
        });
      }

      return res.status(200).json(berkas);
    } catch (error) {
      console.error("Error fetching berkas detail:", error);
      return res.status(500).json({ 
        error: "Internal server error",
        message: "Gagal mengambil detail berkas" 
      });
    }
  }

  return res.status(405).json({ 
    error: "Method not allowed",
    message: `Method ${req.method} tidak diizinkan` 
  });
}