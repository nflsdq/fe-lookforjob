import { Briefcase } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-white border-t border-gray-200'>
      <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <div className='flex items-center'>
            <Briefcase className='h-6 w-6 text-primary-600' />
            <span className='ml-2 text-lg font-medium text-gray-900'>
              LookForJob
            </span>
          </div>

          <div className='mt-4 md:mt-0'>
            <p className='text-sm text-gray-500'>
              &copy; {currentYear} LookForJob. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
