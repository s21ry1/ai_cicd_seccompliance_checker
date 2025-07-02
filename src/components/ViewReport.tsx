
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Trash2, RefreshCcw, AlertTriangle, FileText, Clock } from 'lucide-react';

export const ViewReport = () => {
  const reports = [
    {
      id: 1,
      name: 'Production CI/CD Pipeline Scan',
      date: '2024-01-15',
      time: '14:30',
      filesScanned: 24,
      issuesFound: 8,
      severity: 'high',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Docker Configuration Analysis',
      date: '2024-01-14',
      time: '09:15',
      filesScanned: 12,
      issuesFound: 3,
      severity: 'medium',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Kubernetes Deployment Check',
      date: '2024-01-13',
      time: '16:45',
      filesScanned: 18,
      issuesFound: 15,
      severity: 'critical',
      status: 'completed'
    },
    {
      id: 4,
      name: 'Terraform Infrastructure Scan',
      date: '2024-01-12',
      time: '11:20',
      filesScanned: 6,
      issuesFound: 2,
      severity: 'low',
      status: 'completed'
    },
    {
      id: 5,
      name: 'Full Stack Security Audit',
      date: '2024-01-11',
      time: '13:00',
      filesScanned: 45,
      issuesFound: 0,
      severity: 'none',
      status: 'completed'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      case 'none': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityText = (severity: string) => {
    return severity === 'none' ? 'No Issues' : severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Security Scan Reports</h1>
        <p className="text-slate-400">View and manage your previous security analysis reports</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-white">{reports.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Critical Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold text-white">
                {reports.filter(r => r.severity === 'critical').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Files Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-white">
                {reports.reduce((sum, report) => sum + report.filesScanned, 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Last Scan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-white">Today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{report.name}</h3>
                    <Badge className={`${getSeverityColor(report.severity)} text-white`}>
                      {getSeverityText(report.severity)}
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {report.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Scan Date</p>
                      <p className="text-white font-medium">{report.date} at {report.time}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Files Scanned</p>
                      <p className="text-white font-medium">{report.filesScanned}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Issues Found</p>
                      <p className={`font-medium ${report.issuesFound === 0 ? 'text-green-400' : 'text-orange-400'}`}>
                        {report.issuesFound}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Compliance Score</p>
                      <p className="text-white font-medium">
                        {report.issuesFound === 0 ? '100%' : `${Math.max(0, 100 - (report.issuesFound * 5))}%`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <RefreshCcw className="h-4 w-4 mr-1" />
                    Rescan
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Previous
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">1</Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            2
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
