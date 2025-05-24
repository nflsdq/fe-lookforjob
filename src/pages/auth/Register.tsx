import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { RegisterData } from "../../types";
import { motion } from "framer-motion";
import { Loader, Image, ImagePlus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  const password = watch("password");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmit = async (data: RegisterData) => {
    setIsSubmitting(true);

    try {
      // Format date if it exists
      if (data.tanggal_lahir) {
        const date = new Date(data.tanggal_lahir);
        data.tanggal_lahir = date.toISOString().split("T")[0];
      }

      // Log the data being sent
      console.log("Submitting registration data:", {
        ...data,
        foto:
          data.foto instanceof FileList
            ? {
                name: data.foto[0]?.name,
                type: data.foto[0]?.type,
                size: data.foto[0]?.size,
              }
            : data.foto,
      });

      await register(data);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Register error details:", {
        message: error.response?.data?.message,
        errors: error.response?.data?.errors,
        data: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      setIsSubmitting(false);
    }
  };

  // Update file input registration
  const fileInputRegister = registerField("foto", {
    validate: (fileList: FileList | null) => {
      if (!fileList?.length) return true; // Optional field

      const file = fileList[0];
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file.type)) {
        return "File harus berupa gambar (JPG, JPEG, atau PNG)";
      }

      if (file.size > maxSize) {
        return "Ukuran file tidak boleh lebih dari 2MB";
      }

      return true;
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className='py-6'
    >
      <h2 className='text-xl font-bold text-gray-900 mb-6'>Buat Akun Baru</h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div>
          <label
            htmlFor='nama'
            className='block text-sm font-medium text-gray-700'
          >
            Nama Lengkap <span className='text-red-500'>*</span>
          </label>
          <div className='mt-1'>
            <input
              id='nama'
              type='text'
              autoComplete='name'
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              {...registerField("nama", {
                required: "Nama wajib diisi",
              })}
            />
            {errors.nama && (
              <p className='mt-1 text-sm text-red-600'>{errors.nama.message}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Email <span className='text-red-500'>*</span>
          </label>
          <div className='mt-1'>
            <input
              id='email'
              type='email'
              autoComplete='email'
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              {...registerField("email", {
                required: "Email wajib diisi",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email tidak valid",
                },
              })}
            />
            {errors.email && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Password <span className='text-red-500'>*</span>
          </label>
          <div className='mt-1'>
            <input
              id='password'
              type='password'
              autoComplete='new-password'
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              {...registerField("password", {
                required: "Password wajib diisi",
                minLength: {
                  value: 6,
                  message: "Password minimal 6 karakter",
                },
              })}
            />
            {errors.password && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor='password_confirmation'
            className='block text-sm font-medium text-gray-700'
          >
            Konfirmasi Password <span className='text-red-500'>*</span>
          </label>
          <div className='mt-1'>
            <input
              id='password_confirmation'
              type='password'
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              {...registerField("password_confirmation", {
                required: "Konfirmasi password wajib diisi",
                validate: (value) =>
                  value === password || "Password tidak cocok",
              })}
            />
            {errors.password_confirmation && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor='role'
            className='block text-sm font-medium text-gray-700'
          >
            Peran <span className='text-red-500'>*</span>
          </label>
          <div className='mt-1'>
            <select
              id='role'
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              {...registerField("role", {
                required: "Peran wajib dipilih",
              })}
            >
              <option value=''>Pilih Peran</option>
              <option value='pencari kerja'>Pencari Kerja</option>
              <option value='recruiter'>Recruiter</option>
            </select>
            {errors.role && (
              <p className='mt-1 text-sm text-red-600'>{errors.role.message}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor='alamat'
            className='block text-sm font-medium text-gray-700'
          >
            Alamat
          </label>
          <div className='mt-1'>
            <textarea
              id='alamat'
              rows={3}
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              {...registerField("alamat")}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='tanggal_lahir'
            className='block text-sm font-medium text-gray-700'
          >
            Tanggal Lahir
          </label>
          <div className='mt-1'>
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
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Jenis Kelamin
          </label>
          <div className='mt-1 flex items-center space-x-6'>
            <div className='flex items-center'>
              <input
                id='jenis-kelamin-l'
                type='radio'
                value='L'
                className='focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300'
                {...registerField("jenis_kelamin")}
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
                {...registerField("jenis_kelamin")}
              />
              <label
                htmlFor='jenis-kelamin-p'
                className='ml-2 block text-sm text-gray-700'
              >
                Perempuan
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Foto Profil
          </label>
          <div className='mt-1 flex items-center space-x-6'>
            <div className='flex-shrink-0'>
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
                Pilih Foto
              </span>
              <input
                id='foto'
                type='file'
                className='sr-only'
                accept='image/jpeg,image/png,image/jpg'
                onChange={(e) => {
                  fileInputRegister.onChange(e); // Handle form validation
                  handleImageChange(e); // Handle preview
                }}
                ref={fileInputRegister.ref}
                name={fileInputRegister.name}
              />
            </label>
          </div>
        </div>

        <div>
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200'
          >
            {isSubmitting ? (
              <Loader className='h-5 w-5 animate-spin' />
            ) : (
              "Daftar"
            )}
          </button>
        </div>
      </form>

      <div className='mt-6'>
        <p className='text-center text-sm text-gray-600'>
          Sudah memiliki akun?{" "}
          <Link
            to='/login'
            className='font-medium text-primary-600 hover:text-primary-500'
          >
            Masuk sekarang
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
