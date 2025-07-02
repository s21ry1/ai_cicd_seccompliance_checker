
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Share, Printer, Mail, Calendar } from 'lucide-react';

export const ExportReport = () => {
  const availableReports = [
    {
      id: 1,
      name: 'Production CI/CD Pipeline Scan',
      date: '2024-01-15',
      issues: 8,
      severity: 'high'
    },
    {
      id: 2,
      name: 'Docker Configuration Analysis',
      date: '2024-01-14',
      issues: 3,
      severity: 'medium'
    },
    {
      id: 3,
      name: 'Kubernetes Deployment Check',
      date: '2024-01-13',
      issues: 15,
      severity: 'critical'
    }
  ];

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Comprehensive formatted report suitable for sharing and printing',
      icon: FileText,
      recommended: true
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Raw data export for integration with other tools and systems',
      icon: Download,
      recommended: false
    },
    {
      id: 'markdown',
      name: 'Markdown',
      description: 'Structured text format perfect for documentation and wikis',
      icon: FileText,
      recommended: false
    },
    {
      id: 'csv',
      name: 'CSV Export',
      description: 'Spreadsheet-compatible format for data analysis',
      icon: Download,
      recommended: false
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Export Security Reports</h1>
        <p className="text-slate-400">Export, share, and distribute your security analysis reports</p>
      </div>

      {/* Report Selection */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Select Reports to Export</CardTitle>
          <p className="text-slate-400 text-sm">Choose which reports you want to include in your export</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableReports.map((report) => (
              <div key={report.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <Checkbox id={`report-${report.id}`} className="border-slate-600" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor={`report-${report.id}`} className="text-white font-medium cursor-pointer">
                      {report.name}
                    </label>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getSeverityColor(report.severity)} text-white text-xs`}>
                        {report.issues} issues
                      </Badge>
                      <span className="text-slate-400 text-sm">{report.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Format Selection */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Choose Export Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exportFormats.map((format) => {
              const Icon = format.icon;
              return (
                <div
                  key={format.id}
                  className="relative p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  {format.recommended && (
                    <Badge className="absolute top-2 right-2 bg-blue-600 text-white text-xs">
                      Recommended
                    </Badge>
                  )}
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{format.name}</h3>
                      <p className="text-slate-400 text-sm mt-1">{format.description}</p>
                    </div>
                    <Checkbox className="border-slate-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-medium">Include in Export:</h3>
              <div className="space-y-3">
                {[
                  'Executive Summary',
                  'Detailed Vulnerability List',
                  'AI Recommendations',
                  'Code Snippets',
                  'Compliance Scoring',
                  'Remediation Timeline'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox id={option} className="border-slate-600" defaultChecked />
                    <label htmlFor={option} className="text-slate-300 cursor-pointer">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-medium">Sharing Options:</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download to Computer
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Send via Email
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Share className="h-4 w-4 mr-2" />
                  Generate Share Link
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Regular Exports
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex justify-center space-x-4">
            <Button className="bg-green-600 hover:bg-green-700 px-8">
              <Download className="h-4 w-4 mr-2" />
              Generate Export
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Printer className="h-4 w-4 mr-2" />
              Print Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Security_Report_2024-01-15.pdf', date: '2024-01-15 14:30', size: '2.4 MB' },
              { name: 'Vulnerability_Data.json', date: '2024-01-14 09:15', size: '156 KB' },
              { name: 'Compliance_Summary.md', date: '2024-01-13 16:45', size: '45 KB' }
            ].map((export_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">{export_.name}</p>
                    <p className="text-slate-400 text-sm">{export_.date} • {export_.size}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
