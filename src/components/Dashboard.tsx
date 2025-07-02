
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Clock, Play, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard = () => {
  // Sample data for charts
  const vulnerabilityData = [
    { name: 'Critical', count: 3, color: '#ef4444' },
    { name: 'High', count: 8, color: '#f97316' },
    { name: 'Medium', count: 12, color: '#eab308' },
    { name: 'Low', count: 5, color: '#22c55e' },
  ];

  const fileTypeData = [
    { name: 'Dockerfile', scanned: 15, issues: 8 },
    { name: 'CI/CD', scanned: 12, issues: 6 },
    { name: 'Kubernetes', scanned: 8, issues: 4 },
    { name: 'Terraform', scanned: 6, issues: 2 },
    { name: 'Python', scanned: 20, issues: 8 },
  ];

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-white">AI-Powered CI/CD Security Compliance Checker</h1>
            <p className="text-slate-400 mt-2">Analyze your DevOps files for security vulnerabilities and compliance issues</p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
            <Play className="h-5 w-5 mr-2" />
            Start New Scan
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <FileText className="h-5 w-5 mr-2" />
            Documentation
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Files Scanned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-white">61</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold text-white">28</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold text-white">3</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Last Scan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-white">2 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vulnerability Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Vulnerability Severity Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vulnerabilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {vulnerabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* File Type Analysis */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <BarChart className="h-5 w-5 text-blue-500" />
              <span>Issues by File Type</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fileTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="scanned" fill="#3b82f6" name="Files Scanned" />
                <Bar dataKey="issues" fill="#ef4444" name="Issues Found" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Scan Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { file: 'docker-compose.yml', status: 'Critical Issues Found', time: '2 hours ago', severity: 'critical' },
              { file: '.github/workflows/ci.yml', status: 'Medium Issues Found', time: '4 hours ago', severity: 'medium' },
              { file: 'terraform/main.tf', status: 'No Issues Found', time: '6 hours ago', severity: 'success' },
              { file: 'k8s/deployment.yaml', status: 'Low Issues Found', time: '1 day ago', severity: 'low' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    item.severity === 'critical' ? 'bg-red-500/20' :
                    item.severity === 'medium' ? 'bg-orange-500/20' :
                    item.severity === 'low' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                  }`}>
                    {item.severity === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className={`h-4 w-4 ${
                        item.severity === 'critical' ? 'text-red-500' :
                        item.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                      }`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.file}</p>
                    <p className="text-sm text-slate-400">{item.status}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">{item.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
