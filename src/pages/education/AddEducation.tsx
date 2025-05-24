import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import FormField from '../../components/ui/FormField';
import { educationAPI } from '../../services/api';
import { EducationFormData } from '../../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

const AddEducation = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    control,
    watch,
    setValue,
    formState: { errors } 
  } = useForm<EducationFormData>();
  
  const isCurrentEducation = watch('tanggal_akhir') === null;

  const toggleCurrentEducation = () => {
    if (isCurrentEducation) {
      setValue('tanggal_akhir', '');
    } else {
      setValue('tanggal_akhir', null);
    }
  };

  const onSubmit = async (data: EducationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Format dates
      if (data.tanggal_mulai instanceof Date) {
        data.tanggal_mulai = data.tanggal_mulai.toISOString().split('T')[0];
      }
      
      if (data.tanggal_akhir instanceof Date) {
        data.tanggal_akhir = data.tanggal_akhir.toISOString().split('T')[0];
      }
      
      await educationAPI.create(data);
      toast.success('Pendidikan berhasil ditambahkan');
      navigate('/pendidikan');
    } catch (error) {
      console.error('Error adding education:', error);
      toast.error('Gagal menambahkan pendidikan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Tambah Pendidikan"
        description="Tambahkan riwayat pendidikan Anda"
        action={
          <button
            onClick={() => navigate('/pendidikan')}
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
                label="Institusi/Sekolah" 
                htmlFor="institusi" 
                required={true}
                error={errors.institusi?.message}
              >
                <input
                  id="institusi"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Nama institusi/sekolah"
                  {...register('institusi', { 
                    required: 'Nama institusi/sekolah wajib diisi'
                  })}
                />
              </FormField>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField 
                  label="Jenjang" 
                  htmlFor="jenjang" 
                  required={true}
                  error={errors.jenjang?.message}
                >
                  <select
                    id="jenjang"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    {...register('jenjang', { 
                      required: 'Jenjang pendidikan wajib dipilih'
                    })}
                  >
                    <option value="">Pilih Jenjang</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA/SMK">SMA/SMK</option>
                    <option value="D1">D1</option>
                    <option value="D2">D2</option>
                    <option value="D3">D3</option>
                    <option value="D4">D4</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </FormField>
                
                <FormField 
                  label="Jurusan" 
                  htmlFor="jurusan" 
                  required={true}
                  error={errors.jurusan?.message}
                >
                  <input
                    id="jurusan"
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Jurusan/program studi"
                    {...register('jurusan', { 
                      required: 'Jurusan wajib diisi'
                    })}
                  />
                </FormField>
              </div>
              
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
                          disabled={isCurrentEducation}
                        />
                      )}
                    />
                  </FormField>
                  
                  <div className="mt-2">
                    <div className="flex items-center">
                      <input
                        id="current-education"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={isCurrentEducation}
                        onChange={toggleCurrentEducation}
                      />
                      <label htmlFor="current-education" className="ml-2 block text-sm text-gray-700">
                        Saya masih bersekolah di sini
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <FormField 
                label="IPK/Nilai" 
                htmlFor="ipk" 
                error={errors.ipk?.message}
              >
                <input
                  id="ipk"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Contoh: 3.50"
                  {...register('ipk', {
                    valueAsNumber: true,
                    validate: value => {
                      if (value === undefined) return true;
                      return (value >= 0 && value <= 4) || 'IPK harus antara 0 dan 4';
                    }
                  })}
                />
              </FormField>
              
              <FormField 
                label="Deskripsi" 
                htmlFor="deskripsi" 
                error={errors.deskripsi?.message}
              >
                <textarea
                  id="deskripsi"
                  rows={4}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Deskripsikan pendidikan, prestasi, atau kegiatan penting Anda"
                  {...register('deskripsi')}
                />
              </FormField>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/pendidikan')}
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

export default AddEducation;