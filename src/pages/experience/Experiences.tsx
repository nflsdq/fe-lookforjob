import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, MapPin, Briefcase, Building } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { experienceAPI } from '../../services/api';
import { Experience } from '../../types';
import toast from 'react-hot-toast';

const Experiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await experienceAPI.getAll();
      setExperiences(response.data.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast.error('Gagal memuat data pengalaman');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setIsDeleting(true);
    
    try {
      await experienceAPI.delete(id);
      setExperiences(experiences.filter(exp => exp.id !== id));
      toast.success('Pengalaman berhasil dihapus');
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Gagal menghapus pengalaman');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sekarang';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Pengalaman Kerja"
        description="Kelola riwayat pengalaman kerja Anda"
        action={
          <Link
            to="/pengalaman/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pengalaman
          </Link>
        }
      />
      
      <AnimatePresence>
        {experiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="text-center py-8">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada pengalaman</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tambahkan pengalaman kerja Anda untuk melengkapi CV.
                </p>
                <div className="mt-6">
                  <Link
                    to="/pengalaman/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Pengalaman
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Briefcase className="mr-2 h-5 w-5 text-primary-600" />
                        {experience.posisi}
                      </h3>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {experience.institusi}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {experience.lokasi}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {formatDate(experience.tanggal_mulai)} - {formatDate(experience.tanggal_akhir)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-shrink-0 sm:mt-0 sm:ml-5">
                      <Link
                        to={`/pengalaman/${experience.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-2"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(experience.id)}
                        disabled={isDeleting && deleteId === experience.id}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-error-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isDeleting && deleteId === experience.id ? (
                          <div className="h-4 w-4 mr-1 border-t-2 border-b-2 border-error-500 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Hapus
                      </button>
                    </div>
                  </div>
                  
                  {experience.deskripsi && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {experience.deskripsi}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Experiences;