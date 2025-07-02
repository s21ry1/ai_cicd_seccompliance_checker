
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const InsertSource = () => {
  const [openCards, setOpenCards] = useState<string[]>(['python']);

  const toggleCard = (cardId: string) => {
    setOpenCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const fileTypes = [
    {
      id: 'python',
      title: '🐍 Python & Shell Scripts',
      description: 'Upload Python scripts, shell scripts, and related automation files',
      extensions: '.py, .sh, .bash'
    },
    {
      id: 'docker',
      title: '🐳 Dockerfiles',
      description: 'Docker configuration files and container definitions',
      extensions: 'Dockerfile, .dockerignore'
    },
    {
      id: 'ci',
      title: '⚙ CI Pipeline Files',
      description: 'GitHub Actions, GitLab CI, Jenkins, and other CI configurations',
      extensions: '.yml, .yaml, Jenkinsfile'
    },
    {
      id: 'cd',
      title: '🚀 CD Pipeline Files',
      description: 'Continuous deployment and release pipeline configurations',
      extensions: '.yml, .yaml, .json'
    },
    {
      id: 'manifests',
      title: '📝 Manifest Files',
      description: 'Kubernetes manifests, Helm charts, and deployment configurations',
      extensions: '.yaml, .yml, .json'
    },
    {
      id: 'terraform',
      title: '🌍 Terraform Scripts',
      description: 'Infrastructure as Code files and Terraform configurations',
      extensions: '.tf, .tfvars, .hcl'
    },
    {
      id: 'kubernetes',
      title: '☸ Kubernetes Files',
      description: 'Kubernetes deployments, services, and cluster configurations',
      extensions: '.yaml, .yml'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Insert Source Files</h1>
        <p className="text-slate-400">Upload or paste your DevOps files for security analysis</p>
      </div>

      <div className="grid gap-6">
        {fileTypes.map((fileType) => (
          <Collapsible
            key={fileType.id}
            open={openCards.includes(fileType.id)}
            onOpenChange={() => toggleCard(fileType.id)}
          >
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="hover:bg-slate-700/30 transition-colors">
                  <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{fileType.title}</span>
                    </div>
                    {openCards.includes(fileType.id) ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </CardTitle>
                  <div className="text-left space-y-1">
                    <p className="text-slate-400 text-sm">{fileType.description}</p>
                    <p className="text-slate-500 text-xs">Supported: {fileType.extensions}</p>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Upload Section */}
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-300 mb-2">Drag & drop files here or click to browse</p>
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <FileText className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>

                    {/* Text Input Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">
                        Or paste your code directly:
                      </label>
                      <Textarea
                        placeholder={`Paste your ${fileType.title.replace(/[🐍🐳⚙🚀📝🌍☸]/g, '').trim()} content here...`}
                        className="min-h-[200px] bg-slate-900/50 border-slate-700 text-white resize-y"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Add to Scan Queue
                      </Button>
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {/* Scan Queue Summary */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Scan Queue Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">0</p>
              <p className="text-sm text-slate-400">Files Queued</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">0</p>
              <p className="text-sm text-slate-400">Ready to Scan</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">0</p>
              <p className="text-sm text-slate-400">Processing</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-400">0</p>
              <p className="text-sm text-slate-400">Completed</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button className="bg-green-600 hover:bg-green-700 px-8">
              Start Security Scan
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Clear Queue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
