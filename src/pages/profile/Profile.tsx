import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, User, MapPin, Calendar, Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

const Profile = () => {
  const { user } = useAuth();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <PageHeader 
        title="Profil Saya"
        description="Informasi dan data pribadi Anda"
        action={
          <Link
            to="/profile/edit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profil
          </Link>
        }
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <div className="md:flex md:items-center">
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              {user?.foto_url ? (
                <img
                  src={user.foto_url}
                  alt={user.nama}
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-md">
                  <User className="h-16 w-16 text-primary-600" />
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.nama}</h2>
              <p className="text-md text-gray-500">{user?.email}</p>
              <p className="mt-1 text-sm text-primary-600 bg-primary-50 rounded-full px-3 py-1 inline-block">
                {user?.role === 'pencari kerja' ? 'Pencari Kerja' : 
                 user?.role === 'recruiter' ? 'Recruiter' : 'Admin'}
              </p>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  Alamat
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.alamat || '-'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  Tanggal Lahir
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(user?.tanggal_lahir)}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="mr-2 h-4 w-4 text-gray-400" />
                  Jenis Kelamin
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user?.jenis_kelamin === 'L' ? 'Laki-laki' : 
                   user?.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
                </dd>
              </div>
            </dl>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;