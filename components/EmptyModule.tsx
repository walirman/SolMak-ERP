
import React from 'react';
import { Construction } from 'lucide-react';

interface EmptyModuleProps {
  name: string;
  t: any;
}

const EmptyModule: React.FC<EmptyModuleProps> = ({ name, t }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-full">
        <Construction size={48} className="text-zinc-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">{t.modules[name] || name} {t.common.construction_title}</h2>
        <p className="text-zinc-500 max-w-md mx-auto mt-2">
          {t.common.construction_desc}
        </p>
      </div>
      <button className="bg-zinc-800 hover:bg-zinc-700 px-6 py-2 rounded-lg text-sm transition-colors border border-zinc-700">
        {t.common.back_to_dashboard}
      </button>
    </div>
  );
};

export default EmptyModule;
