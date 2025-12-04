import React, { useState } from "react";
import { Plus, Trash2, Save, Minus } from "lucide-react";
import axios from "axios";

type Question = {
  id: number;
  field: string;
  value: string;
};
interface Fungsi {
  cancel: () => void;
}

const FormFaq: React.FC<Fungsi> = ({ cancel }) => {
  const [questions, setQuestions] = useState([
    { id: 1, question: "", answer: "" },
  ]);

  const addQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id)) + 1;
    setQuestions([...questions, { id: newId, question: "", answer: "" }]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = ({ id, field, value }: Question) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSave = async () => {
    const validQuestions = questions.filter(
      (q) => q.question.trim() && q.answer.trim()
    );
    try {
      await axios.post("/api/faq", validQuestions);
      window.location.reload()
    } catch (error) {
      console.log(error);
    }
  };

  const clearAll = () => {
    setQuestions([{ id: 1, question: "", answer: "" }]);
  };

  return (
    <div className="">
      <div className="max-w-4xl ml-96">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Formulir Question & Answer
          </h1>
          <p className="text-blue-600 text-lg">
            Buat dan kelola pasangan pertanyaan dan jawaban dengan mudah
          </p>
        </div> */}

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <button
                onClick={cancel}
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-sm"
              >
                <Minus className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={addQuestion}
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Tambah Pertanyaan
              </button>
              <div className="flex gap-3">
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-400 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Bersihkan
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-sm"
                >
                  <Save className="w-5 h-5" />
                  Simpan
                </button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {questions.map((item, index) => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-blue-50 to-blue-25 rounded-2xl p-6 border border-blue-100 relative group"
              >
                {/* Question Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-blue-700 font-semibold">
                      Pertanyaan {index + 1}
                    </span>
                  </div>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Question Input */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pertanyaan
                  </label>
                  <textarea
                    value={item.question}
                    onChange={(e) =>
                      updateQuestion({
                        id: item.id,
                        field: "question",
                        value: e.target.value,
                      })
                    }
                    placeholder="Masukkan pertanyaan di sini..."
                    rows={3}
                    className="w-full p-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors duration-200 bg-white"
                  />
                </div>

                {/* Answer Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jawaban
                  </label>
                  <textarea
                    value={item.answer}
                    onChange={(e) =>
                      updateQuestion({
                        id: item.id,
                        field: "answer",
                        value: e.target.value,
                      })
                    }
                    placeholder="Masukkan jawaban di sini..."
                    rows={4}
                    className="w-full p-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors duration-200 bg-white"
                  />
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <div className="text-center pt-4">
              <button
                onClick={addQuestion}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Tambah Pertanyaan Lainnya
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-blue-600 text-sm">
            Total: {questions.length} pertanyaan • Terisi:{" "}
            {
              questions.filter((q) => q.question.trim() && q.answer.trim())
                .length
            }{" "}
            pasangan lengkap
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormFaq;
