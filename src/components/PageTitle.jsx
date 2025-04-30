import React from 'react';

const PageTitle = ({ children }) => {
  return (
    <div className="bg-indigo-900 text-white text-3xl font-bold px-8 py-4 rounded-xl shadow-lg mb-6 text-center">
      {children}
    </div>
  );
};

export default PageTitle;
