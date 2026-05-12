import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/shared/Card';

const AdminPlaceholder = ({ title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-black text-navy mb-1">{title}</h1>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <Card className="min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
          🛠️
        </div>
        <h3 className="text-lg font-bold text-navy mb-2">Under Construction</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          The {title} module is currently being built. Check back soon for updates to the admin portal.
        </p>
      </Card>
    </motion.div>
  );
};

export default AdminPlaceholder;
