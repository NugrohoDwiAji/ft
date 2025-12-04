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
  const uploadPath = path.join(process.cwd(), "public", "dosen");
  
  try {
    // Pastikan folder upload ada
    createUploadDir(uploadPath);

    const form = formidable({
      uploadDir: uploadPath,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB untuk foto
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
    const filePath = `/dosen/${savedFileName}`; // Path relatif untuk akses public

    const namatmp = fields.nama?.toString();
    const nama = namatmp || "untitled";
    const nik = fields.nik?.toString() || "";
    const jenis_dosen = fields.jenis_dosen?.toString() || "Dosen Ilkom";

    // Simpan info dosen ke database
    const saved = await prisma.dosen.create({
      data: {
        nama: nama,
        nik: nik,
        jenis_dosen: jenis_dosen,
        foto: filePath,
      },
    });

    console.log("Dosen berhasil disimpan:", {
      filename: savedFileName,
      path: file.filepath,
      size: file.size,
      nama: nama,
    });

    return res.status(201).json({
      success: true,
      data: saved,
      message: "Data dosen berhasil disimpan",
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

const handleDeleteMethod = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  
  try {
    // Validasi ID
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ 
        error: "ID tidak valid",
        message: "ID dosen harus disertakan" 
      });
    }

    // Ambil data dosen untuk mendapatkan foto path
    const existing = await prisma.dosen.findUnique({
      where: { id: id },
    });

    if (!existing) {
      return res.status(404).json({ 
        error: "Dosen tidak ditemukan",
        message: "Data dosen tidak ada di database" 
      });
    }

    // Hapus file foto jika ada
    if (existing.foto) {
      const oldPath = path.join(process.cwd(), "public", existing.foto);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
          console.log("Foto berhasil dihapus:", oldPath);
        } catch (fileError) {
          console.error("Error deleting file:", fileError);
          // Lanjutkan menghapus dari database meskipun file gagal dihapus
        }
      }
    }

    // Hapus dari database
    const result = await prisma.dosen.delete({
      where: { id: id },
    });

    return res.status(200).json({
      success: true,
      data: result,
      message: "Data dosen berhasil dihapus",
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
      message: "Terjadi kesalahan saat menghapus dosen" 
    });
  }
};

const handleGetMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.dosen.findMany({
      orderBy: {
        nama: "asc", // Urutkan berdasarkan nama
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Error fetching content" });
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
    return handleGetMethod(req, res);
  }
  
  if (req.method === "DELETE") {
    return handleDeleteMethod(req, res);
  }
  
  return res.status(405).json({ 
    error: "Method not allowed",
    message: `Method ${req.method} tidak diizinkan` 
  });
}