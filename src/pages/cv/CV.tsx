import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader, Download, Sparkles, Eye } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import { cvAPI } from "../../services/api";
import { CV as CVType } from "../../types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const CV = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cv, setCV] = useState<CVType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await cvAPI.getCV();
        const cvData = response.data.data;

        if (cvData) {
          setCV(cvData);
          setEditorContent(cvData.isi_cv || "");
        }
      } catch (error) {
        console.error("Error fetching CV:", error);
        // It's okay if CV doesn't exist yet
      } finally {
        setIsLoading(false);
      }
    };

    fetchCV();
  }, []);

  // Cleanup effect for PDF URL
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const saveCV = async () => {
    if (!editorContent.trim()) {
      toast.error("Isi CV tidak boleh kosong");
      return;
    }

    setIsSaving(true);

    try {
      const response = await cvAPI.updateCV(editorContent);
      setCV(response.data.data);
      toast.success("CV berhasil disimpan");
    } catch (error) {
      console.error("Error saving CV:", error);
      toast.error("Gagal menyimpan CV");
    } finally {
      setIsSaving(false);
    }
  };

  const generateCV = async () => {
    setIsGenerating(true);

    try {
      const response = await cvAPI.generateCV();
      const generatedCV = response.data.data;

      setCV(generatedCV);
      setEditorContent(generatedCV.isi_cv);
      toast.success("CV berhasil digenerate dengan AI");
    } catch (error) {
      console.error("Error generating CV:", error);
      toast.error("Gagal generate CV dengan AI");
    } finally {
      setIsGenerating(false);
    }
  };

  const exportCV = async () => {
    setIsExporting(true);

    try {
      const response = await cvAPI.exportCV();

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `CV_${user?.nama || "User"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success("CV berhasil diexport ke PDF");
    } catch (error) {
      console.error("Error exporting CV:", error);
      toast.error("Gagal export CV ke PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const previewCV = async () => {
    setIsPreviewing(true);

    try {
      const response = await cvAPI.previewCV();
      const url = URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      setPdfUrl(url);
      setShowPreviewModal(true);
      toast.success("Preview CV berhasil dimuat");
    } catch (error) {
      console.error("Error previewing CV:", error);
      toast.error("Gagal memuat preview CV");
    } finally {
      setIsPreviewing(false);
    }
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600'></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title='Curriculum Vitae'
        description='Buat dan kelola CV profesional Anda'
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='grid grid-cols-1 lg:grid-cols-2 gap-6'
      >
        {/* CV Editor */}
        <Card title='Edit CV'>
          <form onSubmit={handleSubmit(saveCV)}>
            <div className='mb-4'>
              <ReactQuill
                theme='snow'
                value={editorContent}
                onChange={handleEditorChange}
                placeholder='Mulai tulis CV Anda di sini...'
                className='h-96'
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ align: [] }],
                    ["link"],
                    ["clean"],
                  ],
                }}
              />
            </div>

            <div className='flex flex-wrap gap-3 mt-8 justify-between'>
              <button
                type='button'
                onClick={generateCV}
                disabled={isGenerating}
                className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-70 disabled:cursor-not-allowed'
              >
                {isGenerating ? (
                  <Loader className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Sparkles className='mr-2 h-4 w-4' />
                )}
                Generate dengan AI
              </button>

              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={previewCV}
                  disabled={isPreviewing || !cv}
                  className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed'
                >
                  {isPreviewing ? (
                    <Loader className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Eye className='mr-2 h-4 w-4' />
                  )}
                  Preview PDF
                </button>

                <button
                  type='button'
                  onClick={exportCV}
                  disabled={isExporting || !cv}
                  className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed'
                >
                  {isExporting ? (
                    <Loader className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Download className='mr-2 h-4 w-4' />
                  )}
                  Export ke PDF
                </button>

                <button
                  type='submit'
                  disabled={isSaving}
                  className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed'
                >
                  {isSaving ? (
                    <Loader className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    "Simpan CV"
                  )}
                </button>
              </div>
            </div>
          </form>
        </Card>

        {/* CV Preview */}
        <Card title='Preview CV'>
          <div className='bg-white border border-gray-200 rounded-lg p-6 h-[500px] overflow-y-auto'>
            {editorContent ? (
              <div
                className='prose max-w-none'
                dangerouslySetInnerHTML={{ __html: editorContent }}
              />
            ) : (
              <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                <p className='text-center'>CV Anda masih kosong.</p>
                <p className='text-center mt-2'>
                  Mulai edit CV di panel sebelah kiri atau gunakan fitur
                  Generate dengan AI.
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* PDF Preview Modal */}
      {showPreviewModal && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity'
              aria-hidden='true'
            >
              <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
            </div>

            <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full'>
              <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='sm:flex sm:items-start'>
                  <div className='mt-3 text-center sm:mt-0 sm:text-left w-full'>
                    <div className='flex justify-between items-center mb-4'>
                      <h3 className='text-lg leading-6 font-medium text-gray-900'>
                        Preview CV
                      </h3>
                      <button
                        onClick={closePreviewModal}
                        className='text-gray-400 hover:text-gray-500'
                      >
                        <span className='sr-only'>Close</span>
                        <svg
                          className='h-6 w-6'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>
                    </div>
                    <div className='mt-2'>
                      {pdfUrl && (
                        <iframe
                          src={pdfUrl}
                          className='w-full h-[calc(100vh-200px)]'
                          title='CV Preview'
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CV;
