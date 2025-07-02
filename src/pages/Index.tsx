
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { InsertSource } from '@/components/InsertSource';
import { ViewReport } from '@/components/ViewReport';
import { ReportAnalysis } from '@/components/ReportAnalysis';
import { ExportReport } from '@/components/ExportReport';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const renderMainContent = () => {
    switch (activeSection) {
      case 'home':
        return <Dashboard />;
      case 'insert-source':
        return <InsertSource />;
      case 'view-report':
        return <ViewReport />;
      case 'report-analysis':
        return <ReportAnalysis />;
      case 'export-report':
        return <ExportReport />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-8">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
