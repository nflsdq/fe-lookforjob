import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, BookOpen, GraduationCap as Graduation, Award, User, ArrowRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import { Experience, Education, Skill } from '../types';
import { experienceAPI, educationAPI, skillAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [experiencesRes, educationsRes, skillsRes] = await Promise.all([
          experienceAPI.getAll(),
          educationAPI.getAll(),
          skillAPI.getAll()
        ]);
        
        setExperiences(experiencesRes.data.data);
        setEducations(educationsRes.data.data);
        setSkills(skillsRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title={`Selamat Datang, ${user?.nama || 'Pengguna'}!`}
        description="Kelola profil, CV, dan informasi karir Anda di sini."
      />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card title="Profil Saya">
            <div className="flex items-center space-x-4">
              {user?.foto_url ? (
                <img
                  src={user.foto_url}
                  alt={user.nama}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-600" />
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user?.nama}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                {user?.alamat && (
                  <p className="text-sm text-gray-500 mt-1">{user.alamat}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link
                to="/profile"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
              >
                Lihat Profil Lengkap
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </Card>
        </motion.div>
        
        {/* CV Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card title="CV Saya">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Curriculum Vitae</h3>
                <p className="text-sm text-gray-500">
                  {experiences.length > 0 || educations.length > 0 || skills.length > 0
                    ? 'CV Anda telah memiliki beberapa data'
                    : 'Buat CV profesional Anda sekarang'}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link
                to="/cv"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
              >
                Kelola CV
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </Card>
        </motion.div>
        
        {/* Experience Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card title="Pengalaman Kerja">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-green-100">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {experiences.length} Pengalaman
                </h3>
                <p className="text-sm text-gray-500">
                  {experiences.length > 0
                    ? `Terakhir: ${experiences[0]?.posisi} di ${experiences[0]?.institusi}`
                    : 'Tambahkan pengalaman kerja Anda'}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link
                to="/pengalaman"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
              >
                Kelola Pengalaman
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </Card>
        </motion.div>
        
        {/* Education Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card title="Pendidikan">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-purple-100">
                <Graduation className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {educations.length} Pendidikan
                </h3>
                <p className="text-sm text-gray-500">
                  {educations.length > 0
                    ? `Terakhir: ${educations[0]?.jenjang} di ${educations[0]?.institusi}`
                    : 'Tambahkan riwayat pendidikan Anda'}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link
                to="/pendidikan"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
              >
                Kelola Pendidikan
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </Card>
        </motion.div>
        
        {/* Skills Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card title="Keahlian">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-full bg-yellow-100">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {skills.length} Keahlian
                </h3>
                <p className="text-sm text-gray-500">
                  {skills.length > 0
                    ? 'Keahlian terdaftar dapat meningkatkan peluang karir Anda'
                    : 'Tambahkan keahlian Anda untuk meningkatkan profil'}
                </p>
              </div>
            </div>
            
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {skill.nama_skill}
                    <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-200">
                      {skill.level}
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Belum ada keahlian yang ditambahkan</p>
            )}
            
            <div className="mt-6 flex justify-end">
              <Link
                to="/skills"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
              >
                Kelola Keahlian
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;