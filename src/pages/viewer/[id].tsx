// pages/viewer/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Download, X, FileText, Loader2 } from "lucide-react";

type BerkasDetail = {
  id: string;
  title: string;
  filepath: string;
  uploadat: string;
};

export default function FileViewer() {
  const router = useRouter();
  const { id } = router.query;
  const [berkas, setBerkas] = useState<BerkasDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchBerkasDetail();
    }
  }, [id]);

  const fetchBerkasDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/detail/berkasById`,{params:{id}});
      setBerkas(response.data);
    } catch (err) {
      setError("Gagal memuat file");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!berkas) return;
    
    // Ekstrak nama file dari filepath
    const filename = berkas.filepath.split("/").pop() || berkas.title;
    
    const link = document.createElement("a");
    link.href = berkas.filepath;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fungsi untuk mendapatkan ekstensi file
  const getFileExtension = (filepath: string): string => {
    return filepath.split(".").pop()?.toLowerCase() || "";
  };

  // Fungsi untuk menentukan MIME type dari ekstensi
  const getMimeTypeFromExtension = (ext: string): string => {
    const mimeTypes: { [key: string]: string } = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      txt: "text/plain",
    };
    return mimeTypes[ext] || "application/octet-stream";
  };

  const renderPreview = () => {
    if (!berkas) return null;

    const fileExt = getFileExtension(berkas.filepath);
    const mimeType = getMimeTypeFromExtension(fileExt);

    // PDF Preview
    if (fileExt === "pdf" || mimeType === "application/pdf") {
      return (
        <iframe
          src={berkas.filepath}
          className="w-full h-[calc(100vh-250px)] border-2 border-gray-300 rounded-lg"
          title={berkas.title}
        />
      );
    }

    // Image Preview
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt)) {
      return (
        <div className="flex justify-center items-center p-4">
          <img
            src={berkas.filepath}
            alt={berkas.title}
            className="max-w-full max-h-[calc(100vh-250px)] object-contain rounded-lg shadow-lg"
          />
        </div>
      );
    }

    // Office Documents (Word, Excel, PowerPoint)
    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExt)) {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            window.location.origin + berkas.filepath
          )}`}
          className="w-full h-[calc(100vh-250px)] border-2 border-gray-300 rounded-lg"
          title={berkas.title}
        />
      );
    }

    // Text files
    if (fileExt === "txt") {
      return (
        <iframe
          src={berkas.filepath}
          className="w-full h-[calc(100vh-250px)] border-2 border-gray-300 rounded-lg"
          title={berkas.title}
        />
      );
    }

    // Default: No preview available
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <FileText className="w-20 h-20 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg mb-2">Preview tidak tersedia</p>
        <p className="text-gray-500 text-sm mb-4">
          Silakan unduh file untuk melihat isinya
        </p>
        <p className="text-xs text-gray-400">
          Tipe file: .{fileExt.toUpperCase()}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat file...</p>
        </div>
      </div>
    );
  }

  if (error || !berkas) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || "File tidak ditemukan"}
          </h2>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {berkas.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {berkas.filepath.split("/").pop()}
              </p>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">Unduh File</span>
              </button>

              <button
                onClick={() => router.back()}
                className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                title="Tutup"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* File Preview */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {renderPreview()}
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-4 pb-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Diunggah pada:</span>{" "}
            {new Date(berkas.uploadat).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Tipe:</span>{" "}
            .{getFileExtension(berkas.filepath).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}