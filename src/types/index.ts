// User types
export interface User {
  id: number;
  nama: string;
  email: string;
  role: 'pencari kerja' | 'recruiter' | 'admin';
  alamat: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: 'L' | 'P' | null;
  foto: string | null;
  foto_url: string | null;
  created_at: string;
  updated_at: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nama: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'pencari kerja' | 'recruiter' | 'admin';
  alamat?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: 'L' | 'P';
  foto?: File;
}

export interface ProfileUpdateData {
  nama?: string;
  alamat?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: 'L' | 'P';
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
  foto?: File;
}

// CV types
export interface CV {
  id: number;
  user_id: number;
  isi_cv: string;
  created_at: string;
  updated_at: string;
}

// Experience types
export interface Experience {
  id: number;
  user_id: number;
  institusi: string;
  posisi: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_akhir: string | null;
  deskripsi: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExperienceFormData {
  institusi: string;
  posisi: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_akhir?: string | null;
  deskripsi?: string;
}

// Education types
export interface Education {
  id: number;
  user_id: number;
  institusi: string;
  jenjang: 'SD' | 'SMP' | 'SMA/SMK' | 'D1' | 'D2' | 'D3' | 'D4' | 'S1' | 'S2' | 'S3';
  jurusan: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_akhir: string | null;
  ipk: number | null;
  deskripsi: string | null;
  created_at: string;
  updated_at: string;
}

export interface EducationFormData {
  institusi: string;
  jenjang: 'SD' | 'SMP' | 'SMA/SMK' | 'D1' | 'D2' | 'D3' | 'D4' | 'S1' | 'S2' | 'S3';
  jurusan: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_akhir?: string | null;
  ipk?: number | null;
  deskripsi?: string;
}

// Skill types
export interface Skill {
  id: number;
  user_id: number;
  nama_skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  sertifikasi: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillFormData {
  nama_skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  sertifikasi?: File;
}

// API Response types
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}