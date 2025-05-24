import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader, File, Upload } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import FormField from '../../components/ui/FormField';
import { skillAPI } from '../../services/api';
import { SkillFormData } from '../../types';
import toast from 'react-hot-toast';

const AddSkill = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { 
    register, 
    handleSubmit,
    formState: { errors } 
  } = useForm<SkillFormData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: SkillFormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('nama_skill', data.nama_skill);
      formData.append('level', data.level);
      
      if (selectedFile) {
        formData.append('sertifikasi', selectedFile);
      }
      
      await skillAPI.create(formData);
      toast.success('Keahlian berhasil ditambahkan');
      navigate('/skills');
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Gagal menambahkan keahlian');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Tambah Keahlian"
        description="Tambahkan keahlian atau kompetensi baru"
        action={
          <button
            onClick={() => navigate('/skills')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </button>
        }
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField 
                label="Nama Keahlian" 
                htmlFor="nama_skill" 
                required={true}
                error={errors.nama_skill?.message}
              >
                <input
                  id="nama_skill"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Contoh: JavaScript, Photoshop, Public Speaking, dll."
                  {...register('nama_skill', { 
                    required: 'Nama keahlian wajib diisi'
                  })}
                />
              </FormField>
              
              <FormField 
                label="Tingkat Kemahiran" 
                htmlFor="level" 
                required={true}
                error={errors.level?.message}
              >
                <select
                  id="level"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  {...register('level', { 
                    required: 'Tingkat kemahiran wajib dipilih'
                  })}
                >
                  <option value="">Pilih Tingkat Kemahiran</option>
                  <option value="Beginner">Pemula (Beginner)</option>
                  <option value="Intermediate">Menengah (Intermediate)</option>
                  <option value="Advanced">Mahir (Advanced)</option>
                  <option value="Expert">Ahli (Expert)</option>
                </select>
              </FormField>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sertifikasi (opsional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {selectedFile ? (
                      <div>
                        <File className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                        <button
                          type="button"
                          className="mt-2 text-sm text-primary-600 hover:text-primary-500"
                          onClick={() => setSelectedFile(null)}
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 mt-2">
                          <label
                            htmlFor="sertifikasi"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Upload sertifikat</span>
                            <input
                              id="sertifikasi"
                              type="file"
                              className="sr-only"
                              {...register('sertifikasi', {
                                onChange: handleFileChange
                              })}
                            />
                          </label>
                          <p className="pl-1">atau seret dan lepas</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, JPG, atau PNG hingga 2MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/skills')}
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  'Simpan'
                )}
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddSkill;