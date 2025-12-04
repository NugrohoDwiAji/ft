import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Edit2,
  Trash2,
  Eye,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import axios from "axios";
import FormFaq from "@/components/admin/cards/FormFaq";

type QuestionAnswer = {
  id: string;
  question: string;
  answer: string;
  created_at: string;
};

export default function QuestionAnswerTable() {
  const [allData, setAllData] = useState<QuestionAnswer[]>([]);
  const [filteredData, setFilteredData] = useState<QuestionAnswer[]>([]);
  const [isDelete, setIsDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedItem, setSelectedItem] = useState<QuestionAnswer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk fetch data - gunakan useCallback untuk mencegah re-render berlebihan
  const handleGetItem = useCallback(async () => {
    if (loading) return; // Prevent multiple simultaneous requests
    
    try {
      setLoading(true);
      setError(null);
      const result = await axios.get("/api/faq");
      setAllData(result.data);
    } catch (error) {
      console.error("Error fetching FAQ data:", error);
      setError("Gagal memuat data FAQ");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // useEffect untuk fetch data hanya sekali saat component mount
  useEffect(() => {
    handleGetItem();
  }, []); // Empty dependency array - hanya jalankan sekali

  // useEffect terpisah untuk filtering - tidak memanggil handleGetItem lagi
  useEffect(() => {
    const filtered = allData.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, allData]); // Hanya bergantung pada searchTerm dan allData

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (item: QuestionAnswer) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleEdit = (item: QuestionAnswer) => {
    alert(`Edit item dengan ID: ${item.id}`);
  };

  const handleDelete = async (item: QuestionAnswer) => {
    if (confirm(`Yakin ingin menghapus pertanyaan: "${item.question}"?`)) {
      try {
        setLoading(true);
        await axios.delete(`/api/faq?id=${item.id}`);
        
        // Update state lokal tanpa perlu fetch ulang
        setAllData(prevData => prevData.filter(data => data.id !== item.id));
        
        alert(`Item dengan ID ${item.id} berhasil dihapus`);
      } catch (error) {
        console.error("Error deleting item:", error);
        setError("Gagal menghapus item");
      } finally {
        setLoading(false);
      }
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Fungsi untuk refresh data manual jika diperlukan
  const handleRefresh = () => {
    handleGetItem();
  };

  // Fungsi callback setelah berhasil tambah/edit data
  const handleDataUpdate = (newData?: QuestionAnswer) => {
    if (newData) {
      // Jika ada data baru, tambahkan ke state
      setAllData(prevData => [...prevData, newData]);
    } else {
      // Jika tidak ada data baru, refresh data
      handleGetItem();
    }
    setIsDelete(false);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Daftar Pertanyaan & Jawaban
            </h1>
            <p className="text-blue-600 text-lg">
              Kelola dan lihat semua data Q&A yang tersimpan
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              <div className="flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan atau jawaban..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Tampilkan:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-blue-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                
                {/* Refresh Button */}
                <button 
                  onClick={handleRefresh} 
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                >
                  <Database className="w-4 h-4" />
                  {loading ? "Loading..." : "Refresh"}
                </button>
                
                <button 
                  onClick={() => setIsDelete(!isDelete)} 
                  className="inline-flex cursor-pointer items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Baru
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-blue-100">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  Total:{" "}
                  <strong className="text-blue-600">{allData.length}</strong>{" "}
                  item
                </span>
                <span>
                  Ditampilkan:{" "}
                  <strong className="text-blue-600">
                    {currentData.length}
                  </strong>{" "}
                  item
                </span>
                <span>
                  Halaman:{" "}
                  <strong className="text-blue-600">{currentPage}</strong>{" "}
                  dari <strong className="text-blue-600">{totalPages}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Memuat data...</p>
              </div>
            )}
            
            {!loading && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Pertanyaan
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Jawaban
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Tanggal Dibuat
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-blue-50 hover:bg-blue-25 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-800">
                              {truncateText(item?.question, 80)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">
                              {truncateText(item?.answer, 100)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(item?.created_at).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleView(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                disabled={loading}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="text-gray-400">
                            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">
                              Tidak ada data
                            </p>
                            <p className="text-sm">
                              Coba ubah kata kunci pencarian atau tambah data baru
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Menampilkan {startIndex + 1} -{" "}
                    {Math.min(endIndex, filteredData.length)} dari{" "}
                    {filteredData.length} hasil
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 3 ||
                        page === currentPage + 3
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Detail */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                <h3 className="text-xl font-bold">
                  Detail Pertanyaan & Jawaban
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    PERTANYAAN:
                  </h4>
                  <p className="text-gray-800 bg-blue-50 p-4 rounded-xl">
                    {selectedItem.question}
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    JAWABAN:
                  </h4>
                  <p className="text-gray-800 bg-blue-50 p-4 rounded-xl">
                    {selectedItem.answer}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-gray-500">Dibuat:</span>
                    <p className="text-gray-800 font-medium">
                      {new Date(selectedItem.created_at).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(selectedItem)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="absolute right-0 left-0 top-20">
        {isDelete && (
          <FormFaq 
            cancel={() => setIsDelete(!isDelete)}
          />
        )}
      </div>
    </AdminLayout>
  );
}