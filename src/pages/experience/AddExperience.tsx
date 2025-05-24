import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import FormField from '../../components/ui/FormField';
import { experienceAPI } from '../../services/api';
import { ExperienceFormData } from '../../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

const AddExperience = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    control,
    watch,
    setValue,
    formState: { errors } 
  } = useForm<ExperienceFormData>();
  
  const isCurrentJob = watch('tanggal_akhir') === null;

  const toggleCurrentJob = () => {
    if (isCurrentJob) {
      setValue('tanggal_akhir', '');
    } else {
      setValue('tanggal_akhir', null);
    }
  };

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    
    try {
      // Format dates
      if (data.tanggal_mulai instanceof Date) {
        data.tanggal_mulai = data.tanggal_mulai.toISOString().split('T')[0];
      }
      
      if (data.tanggal_akhir instanceof Date) {
        data.tanggal_akhir = data.tanggal_akhir.toISOString().split('T')[0];
      }
      
      await experienceAPI.create(data);
      toast.success('Pengalaman kerja berhasil ditambahkan');
      navigate('/pengalaman');
    } catch (error) {
      console.error('Error adding experience:', error);
      toast.error('Gagal menambahkan pengalaman kerja');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Tambah Pengalaman Kerja"
        description="Tambahkan riwayat pengalaman kerja Anda"
        action={
          <button
            onClick={() => navigate('/pengalaman')}
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
                label="Perusahaan/Institusi" 
                htmlFor="institusi" 
                required={true}
                error={errors.institusi?.message}
              >
                <input
                  id="institusi"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Nama perusahaan/institusi"
                  {...register('institusi', { 
                    required: 'Nama perusahaan/institusi wajib diisi'
                  })}
                />
              </FormField>
              
              <FormField 
                label="Posisi/Jabatan" 
                htmlFor="posisi" 
                required={true}
                error={errors.posisi?.message}
              >
                <input
                  id="posisi"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Posisi/jabatan Anda"
                  {...register('posisi', { 
                    required: 'Posisi/jabatan wajib diisi'
                  })}
                />
              </FormField>
              
              <FormField 
                label="Lokasi" 
                htmlFor="lokasi" 
                required={true}
                error={errors.lokasi?.message}
              >
                <input
                  id="lokasi"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Kota, Negara"
                  {...register('lokasi', { 
                    required: 'Lokasi wajib diisi'
                  })}
                />
              </FormField>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField 
                  label="Tanggal Mulai" 
                  htmlFor="tanggal_mulai" 
                  required={true}
                  error={errors.tanggal_mulai?.message}
                >
                  <Controller
                    control={control}
                    name="tanggal_mulai"
                    rules={{ required: 'Tanggal mulai wajib diisi' }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="yyyy-MM-dd"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholderText="YYYY-MM-DD"
                      />
                    )}
                  />
                </FormField>
                
                <div>
                  <FormField 
                    label="Tanggal Selesai" 
                    htmlFor="tanggal_akhir" 
                    error={errors.tanggal_akhir?.message}
                  >
                    <Controller
                      control={control}
                      name="tanggal_akhir"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => field.onChange(date)}
                          dateFormat="yyyy-MM-dd"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholderText="YYYY-MM-DD"
                          disabled={isCurrentJob}
                        />
                      )}
                    />
                  </FormField>
                  
                  <div className="mt-2">
                    <div className="flex items-center">
                      <input
                        id="current-job"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={isCurrentJob}
                        onChange={toggleCurrentJob}
                      />
                      <label htmlFor="current-job" className="ml-2 block text-sm text-gray-700">
                        Saya masih bekerja di sini
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <FormField 
                label="Deskripsi" 
                htmlFor="deskripsi" 
                error={errors.deskripsi?.message}
              >
                <textarea
                  id="deskripsi"
                  rows={4}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Deskripsikan pekerjaan dan tanggung jawab Anda"
                  {...register('deskripsi')}
                />
              </FormField>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/pengalaman')}
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

export default AddExperience;