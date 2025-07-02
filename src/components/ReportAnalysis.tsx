
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Brain, Code, Filter, FileText, Lightbulb } from 'lucide-react';

export const ReportAnalysis = () => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');

  const vulnerabilities = [
    {
      id: 1,
      title: 'Hardcoded API Key in Dockerfile',
      severity: 'critical',
      fileType: 'docker',
      fileName: 'Dockerfile',
      lineNumber: 15,
      description: 'API key found in environment variable declaration',
      aiSuggestion: 'Use Docker secrets or environment variables from external sources. Never hardcode sensitive information in Dockerfiles.',
      codeSnippet: 'ENV API_KEY=sk-1234567890abcdef',
      fixSuggestion: 'ENV API_KEY=${API_KEY}'
    },
    {
      id: 2,
      title: 'Insecure Registry in CI Pipeline',
      severity: 'high',
      fileType: 'ci',
      fileName: '.github/workflows/deploy.yml',
      lineNumber: 23,
      description: 'Using HTTP instead of HTTPS for container registry',
      aiSuggestion: 'Always use HTTPS for container registries to prevent man-in-the-middle attacks.',
      codeSnippet: 'registry: http://registry.company.com',
      fixSuggestion: 'registry: https://registry.company.com'
    },
    {
      id: 3,
      title: 'Privileged Container Configuration',
      severity: 'high',
      fileType: 'kubernetes',
      fileName: 'deployment.yaml',
      lineNumber: 34,
      description: 'Container running with privileged access',
      aiSuggestion: 'Remove privileged access unless absolutely necessary. Use security contexts to limit container capabilities.',
      codeSnippet: 'privileged: true',
      fixSuggestion: 'Add securityContext with specific capabilities'
    },
    {
      id: 4,
      title: 'Weak Password Policy in Script',
      severity: 'medium',
      fileType: 'python',
      fileName: 'setup.py',
      lineNumber: 45,
      description: 'Password validation allows weak passwords',
      aiSuggestion: 'Implement stronger password requirements including minimum length, special characters, and complexity checks.',
      codeSnippet: 'min_length = 6',
      fixSuggestion: 'min_length = 12 with complexity requirements'
    }
  ];

  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const severityMatch = selectedSeverity === 'all' || vuln.severity === selectedSeverity;
    const fileTypeMatch = selectedFileType === 'all' || vuln.fileType === selectedFileType;
    return severityMatch && fileTypeMatch;
  });

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
        <h1 className="text-3xl font-bold text-white">AI-Powered Report Analysis</h1>
        <p className="text-slate-400">Detailed analysis and AI-generated recommendations for security improvements</p>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-300 block mb-2">Severity Level</label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-300 block mb-2">File Type</label>
              <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All File Types</SelectItem>
                  <SelectItem value="docker">Docker</SelectItem>
                  <SelectItem value="ci">CI/CD</SelectItem>
                  <SelectItem value="kubernetes">Kubernetes</SelectItem>
                  <SelectItem value="terraform">Terraform</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerability List */}
      <div className="space-y-4">
        {filteredVulnerabilities.map((vuln) => (
          <Card key={vuln.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span>{vuln.title}</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Badge className={`${getSeverityColor(vuln.severity)} text-white`}>
                    {vuln.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {vuln.fileType}
                  </Badge>
                </div>
              </div>
              <div className="text-slate-400 text-sm">
                <FileText className="h-4 w-4 inline mr-1" />
                {vuln.fileName} (Line {vuln.lineNumber})
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="ai-suggestion">AI Suggestion</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-slate-300">{vuln.description}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                        <Code className="h-4 w-4 mr-1" />
                        Vulnerable Code:
                      </h4>
                      <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                        <code className="text-red-300 text-sm">{vuln.codeSnippet}</code>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                        <Code className="h-4 w-4 mr-1" />
                        Suggested Fix:
                      </h4>
                      <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                        <code className="text-green-300 text-sm">{vuln.fixSuggestion}</code>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ai-suggestion" className="mt-4">
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Brain className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-blue-300 font-medium mb-2">AI Recommendation:</h4>
                        <p className="text-slate-300">{vuln.aiSuggestion}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Mark as Fixed
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Get More Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVulnerabilities.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No vulnerabilities found</h3>
            <p className="text-slate-400">Try adjusting your filters or run a new scan.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
