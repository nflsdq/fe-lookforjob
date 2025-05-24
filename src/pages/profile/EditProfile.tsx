import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { ProfileUpdateData } from "../../types";
import { motion } from "framer-motion";
import { Loader, Image, ImagePlus, ArrowLeft } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import FormField from "../../components/ui/FormField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ProfileUpdateData>({
    defaultValues: {
      nama: user?.nama,
      alamat: user?.alamat || "",
      tanggal_lahir: user?.tanggal_lahir || "",
      jenis_kelamin: user?.jenis_kelamin as "L" | "P" | undefined,
    },
  });

  const new_password = watch("new_password");

  useEffect(() => {
    if (user?.foto_url) {
      setPreviewImage(user.foto_url);
    }
  }, [user?.foto_url]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileUpdateData) => {
    setIsSubmitting(true);

    try {
      // Create a new object with only the fields that have values
      const updateData: ProfileUpdateData = {};

      // Only include non-empty string fields
      if (data.nama?.trim()) updateData.nama = data.nama.trim();
      if (data.alamat?.trim()) updateData.alamat = data.alamat.trim();
      if (data.jenis_kelamin) updateData.jenis_kelamin = data.jenis_kelamin;

      // Handle file upload properly
      const fileInput = document.querySelector("#foto") as HTMLInputElement;
      const files = fileInput?.files;
      if (files && files.length > 0) {
        updateData.foto = files[0];
      }

      // Format date if it exists
      if (data.tanggal_lahir) {
        const date = new Date(data.tanggal_lahir);
        if (!isNaN(date.getTime())) {
          updateData.tanggal_lahir = date.toISOString().split("T")[0];
        }
      }

      // Handle password update
      if (showPasswordFields) {
        if (data.new_password) {
          if (!data.current_password) {
            throw new Error("Password saat ini wajib diisi");
          }
          updateData.current_password = data.current_password;
          updateData.new_password = data.new_password;
          updateData.new_password_confirmation = data.new_password_confirmation;
        }
      }

      // Log the data being sent
      console.log("Sending update data:", updateData);

      await updateProfile(updateData);
      navigate("/profile");
    } catch (error: any) {
      console.error("Update profile error:", error);
      // Log the detailed error response if available
      if (error.response) {
        console.error("Error response:", {
          status: error.response.status,
          data: error.response.data,
        });

        // Show validation errors if any
        if (error.response.data?.errors) {
          console.error("Validation errors:", error.response.data.errors);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title='Edit Profil'
        description='Perbarui informasi pribadi Anda'
        action={
          <button
            onClick={() => navigate("/profile")}
            className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
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
            <div className='space-y-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0 mr-6'>
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt='Preview'
                      className='h-24 w-24 rounded-full object-cover'
                    />
                  ) : (
                    <div className='h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center'>
                      <Image className='h-12 w-12 text-gray-400' />
                    </div>
                  )}
                </div>

                <label
                  htmlFor='foto'
                  className='cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                >
                  <span className='flex items-center'>
                    <ImagePlus className='mr-2 h-4 w-4' />
                    Ganti Foto
                  </span>
                  <input
                    id='foto'
                    type='file'
                    className='sr-only'
                    accept='image/*'
                    {...register("foto", {
                      onChange: handleImageChange,
                    })}
                  />
                </label>
              </div>

              <FormField
                label='Nama Lengkap'
                htmlFor='nama'
                error={errors.nama?.message}
              >
                <input
                  id='nama'
                  type='text'
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                  {...register("nama")}
                />
              </FormField>

              <FormField
                label='Alamat'
                htmlFor='alamat'
                error={errors.alamat?.message}
              >
                <textarea
                  id='alamat'
                  rows={3}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                  {...register("alamat")}
                />
              </FormField>

              <FormField
                label='Tanggal Lahir'
                htmlFor='tanggal_lahir'
                error={errors.tanggal_lahir?.message}
              >
                <Controller
                  control={control}
                  name='tanggal_lahir'
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      dateFormat='yyyy-MM-dd'
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                      placeholderText='YYYY-MM-DD'
                    />
                  )}
                />
              </FormField>

              <FormField
                label='Jenis Kelamin'
                htmlFor='jenis_kelamin'
                error={errors.jenis_kelamin?.message}
              >
                <div className='flex items-center space-x-6'>
                  <div className='flex items-center'>
                    <input
                      id='jenis-kelamin-l'
                      type='radio'
                      value='L'
                      className='focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300'
                      {...register("jenis_kelamin")}
                    />
                    <label
                      htmlFor='jenis-kelamin-l'
                      className='ml-2 block text-sm text-gray-700'
                    >
                      Laki-laki
                    </label>
                  </div>
                  <div className='flex items-center'>
                    <input
                      id='jenis-kelamin-p'
                      type='radio'
                      value='P'
                      className='focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300'
                      {...register("jenis_kelamin")}
                    />
                    <label
                      htmlFor='jenis-kelamin-p'
                      className='ml-2 block text-sm text-gray-700'
                    >
                      Perempuan
                    </label>
                  </div>
                </div>
              </FormField>

              <div className='border-t border-gray-200 pt-6'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    Ubah Password
                  </h3>
                  <button
                    type='button'
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    className='text-sm font-medium text-primary-600 hover:text-primary-500'
                  >
                    {showPasswordFields ? "Batal" : "Ubah Password"}
                  </button>
                </div>

                {showPasswordFields && (
                  <div className='mt-4 space-y-4'>
                    <FormField
                      label='Password Saat Ini'
                      htmlFor='current_password'
                      required={true}
                      error={errors.current_password?.message}
                    >
                      <input
                        id='current_password'
                        type='password'
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        {...register("current_password", {
                          required: "Password saat ini wajib diisi",
                        })}
                      />
                    </FormField>

                    <FormField
                      label='Password Baru'
                      htmlFor='new_password'
                      required={true}
                      error={errors.new_password?.message}
                    >
                      <input
                        id='new_password'
                        type='password'
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        {...register("new_password", {
                          required: "Password baru wajib diisi",
                          minLength: {
                            value: 6,
                            message: "Password minimal 6 karakter",
                          },
                        })}
                      />
                    </FormField>

                    <FormField
                      label='Konfirmasi Password Baru'
                      htmlFor='new_password_confirmation'
                      required={true}
                      error={errors.new_password_confirmation?.message}
                    >
                      <input
                        id='new_password_confirmation'
                        type='password'
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                        {...register("new_password_confirmation", {
                          required: "Konfirmasi password wajib diisi",
                          validate: (value) =>
                            value === new_password || "Password tidak cocok",
                        })}
                      />
                    </FormField>
                  </div>
                )}
              </div>
            </div>

            <div className='mt-8 flex justify-end'>
              <button
                type='button'
                onClick={() => navigate("/profile")}
                className='mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              >
                Batal
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed'
              >
                {isSubmitting ? (
                  <Loader className='h-5 w-5 animate-spin' />
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default EditProfile;
