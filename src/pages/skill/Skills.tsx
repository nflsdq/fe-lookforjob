import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Award, Download } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { skillAPI } from '../../services/api';
import { Skill } from '../../types';
import toast from 'react-hot-toast';

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-blue-100 text-blue-800';
    case 'Intermediate':
      return 'bg-green-100 text-green-800';
    case 'Advanced':
      return 'bg-purple-100 text-purple-800';
    case 'Expert':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillAPI.getAll();
      setSkills(response.data.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Gagal memuat data keahlian');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setIsDeleting(true);
    
    try {
      await skillAPI.delete(id);
      setSkills(skills.filter(skill => skill.id !== id));
      toast.success('Keahlian berhasil dihapus');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Gagal menghapus keahlian');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
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
        title="Keahlian"
        description="Kelola daftar keahlian dan kompetensi Anda"
        action={
          <Link
            to="/skills/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Keahlian
          </Link>
        }
      />
      
      <AnimatePresence>
        {skills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="text-center py-8">
                <Award className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada keahlian</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tambahkan keahlian Anda untuk meningkatkan daya tarik CV.
                </p>
                <div className="mt-6">
                  <Link
                    to="/skills/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Keahlian
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Award className="mr-2 h-5 w-5 text-primary-600" />
                        {skill.nama_skill}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                    
                    {skill.sertifikasi && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="flex items-center">
                          <Download className="h-4 w-4 text-gray-400 mr-2" />
                          <a
                            href={`http://localhost:8000/storage/${skill.sertifikasi}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-500"
                          >
                            Lihat Sertifikasi
                          </a>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end">
                      <Link
                        to={`/skills/${skill.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-2"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        disabled={isDeleting && deleteId === skill.id}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-error-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isDeleting && deleteId === skill.id ? (
                          <div className="h-4 w-4 mr-1 border-t-2 border-b-2 border-error-500 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Hapus
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Skills;