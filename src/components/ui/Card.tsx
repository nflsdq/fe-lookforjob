import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const Card = ({ title, children, footer, className = '' }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 ${className}`}
    >
      {title && (
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
        </div>
      )}
      
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-4 border-t border-gray-200 sm:px-6 bg-gray-50">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default Card;