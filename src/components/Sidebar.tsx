
import { Home, Upload, View, BarChart3, Download, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'insert-source', label: 'Insert Source', icon: Upload },
    { id: 'view-report', label: 'View Report', icon: View },
    { id: 'report-analysis', label: 'Report Analysis', icon: BarChart3 },
    { id: 'export-report', label: 'Export Report', icon: Download },
  ];

  return (
    <div className="w-64 bg-slate-800/50 backdrop-blur-lg border-r border-slate-700 min-h-screen">
      {/* Logo/Branding */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SecureCI</h1>
            <p className="text-xs text-slate-400">Security Compliance</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                activeSection === item.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 text-center">
            AI-Powered Security Analysis
          </p>
          <p className="text-xs text-slate-500 text-center mt-1">
            Offline • Secure • Fast
          </p>
        </div>
      </div>
    </div>
  );
};
