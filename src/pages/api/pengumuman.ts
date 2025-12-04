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
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directory created: ${dir}`);
    }
  } catch (error) {
    console.error("Error creating directory:", error);
    throw new Error("Gagal membuat direktori upload");
  }
};

const handlePostMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const uploadPath = path.join(process.cwd(), "public", "pengumuman");
  
  try {
    // Pastikan folder upload ada
    createUploadDir(uploadPath);

    const form = formidable({
      uploadDir: uploadPath,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filename: (name, ext, part) => {
        // Buat nama file unik dengan timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return `${uniqueSuffix}-${part.originalFilename}`;
      },
    });

    const { fields, files } = await new Promise<{
      fields: Fields;
      files: Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Formidable parse error:", err);
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });

    // Validasi file
    if (!files.file) {
      return res.status(400).json({ 
        error: "File tidak ditemukan",
        message: "Tidak ada file yang diupload" 
      });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    // Validasi apakah file berhasil diupload
    if (!file || !file.filepath) {
      return res.status(500).json({ 
        error: "File gagal tersimpan",
        message: "File tidak dapat disimpan ke server" 
      });
    }

    // Verifikasi file benar-benar ada di filesystem
    if (!fs.existsSync(file.filepath)) {
      return res.status(500).json({ 
        error: "File tidak ditemukan setelah upload",
        message: "File gagal tersimpan di server" 
      });
    }

    // Ambil nama file yang tersimpan
    const savedFileName = path.basename(file.filepath);
    const filePath = `/pengumuman/${savedFileName}`; // Path relatif untuk akses public

    const titletmp = fields.title?.toString();
    const title = titletmp || "untitled";
    const date = fields.uploadat?.toString() || new Date().toISOString();

    // Simpan info file ke database
    const saved = await prisma.pengumuman.create({
      data: {
        title: title,
        file_path: filePath,
        uploadat: date,
      },
    });

    console.log("File berhasil disimpan:", {
      filename: savedFileName,
      path: file.filepath,
      size: file.size,
    });

    return res.status(201).json({
      success: true,
      data: saved,
      message: "File berhasil diupload",
    });

  } catch (error) {
    console.error("Error saving file:", error);
    
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: "Error saving file",
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
    
    return res.status(500).json({ 
      error: "Error saving file",
      message: "Terjadi kesalahan saat menyimpan file" 
    });
  }
};

const handleGetMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.pengumuman.findMany({
      orderBy: {
        uploadat: "desc",
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Error fetching content" });
  }
};

const handleDeleteMethode = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  
  try {
    // Validasi ID
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ 
        error: "ID tidak valid",
        message: "ID pengumuman harus disertakan" 
      });
    }

    // Ambil data pengumuman untuk mendapatkan file path
    const pengumuman = await prisma.pengumuman.findUnique({
      where: { id: id },
    });

    if (!pengumuman) {
      return res.status(404).json({ 
        error: "Pengumuman tidak ditemukan",
        message: "Data pengumuman tidak ada di database" 
      });
    }

    // Hapus file fisik jika ada
    if (pengumuman.file_path) {
      const filePath = path.join(process.cwd(), "public", pengumuman.file_path);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log("File berhasil dihapus:", filePath);
        } catch (fileError) {
          console.error("Error deleting file:", fileError);
          // Lanjutkan menghapus dari database meskipun file gagal dihapus
        }
      }
    }

    // Hapus dari database
    const result = await prisma.pengumuman.delete({
      where: { id: id },
    });

    return res.status(200).json({
      success: true,
      data: result,
      message: "Pengumuman berhasil dihapus",
    });

  } catch (error) {
    console.error("Error deleting content:", error);
    
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: "Error deleting content",
        message: error.message 
      });
    }
    
    return res.status(500).json({ 
      error: "Error deleting content",
      message: "Terjadi kesalahan saat menghapus pengumuman" 
    });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return handlePostMethod(req, res);
  } 
  
  if (req.method === "GET") {
    return handleGetMethode(req, res);
  }
  
  if (req.method === "DELETE") {
    return handleDeleteMethode(req, res);
  }
  
  return res.status(405).json({ 
    error: "Method not allowed",
    message: `Method ${req.method} tidak diizinkan` 
  });
}