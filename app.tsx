import React, { useState } from 'react';
import { 
  Folder, 
  File, 
  Upload, 
  Download, 
  Trash2, 
  FolderPlus, 
  FilePlus,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const FTPWebApp = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showUploadAlert, setShowUploadAlert] = useState(false);

  // Sample file system data structure
  const [fileSystem, setFileSystem] = useState({
    '/': {
      type: 'folder',
      children: {
        'Documents': {
          type: 'folder',
          children: {
            'report.pdf': { type: 'file', size: '2.5 MB', modified: '2024-01-05' },
            'data.xlsx': { type: 'file', size: '1.8 MB', modified: '2024-01-04' }
          }
        },
        'Images': {
          type: 'folder',
          children: {
            'photo.jpg': { type: 'file', size: '3.2 MB', modified: '2024-01-03' }
          }
        },
        'readme.txt': { type: 'file', size: '12 KB', modified: '2024-01-02' }
      }
    }
  });

  const handleUpload = () => {
    setShowUploadAlert(true);
    setTimeout(() => setShowUploadAlert(false), 3000);
  };

  const getPathContent = (path) => {
    let current = fileSystem;
    const parts = path.split('/').filter(p => p);
    for (const part of parts) {
      current = current[part]?.children;
    }
    return current || {};
  };

  const getCurrentItems = () => {
    const content = getPathContent(currentPath);
    return Object.entries(content).map(([name, data]) => ({
      name,
      ...data
    }));
  };

  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(p => p);
    return ['/', ...parts];
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">FTP Web Interface</h1>
        <div className="flex gap-2">
          <button onClick={handleUpload} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Upload size={16} />
            Upload
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            <Download size={16} />
            Download
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        {getBreadcrumbs().map((part, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight size={16} className="text-gray-400" />}
            <button
              onClick={() => setCurrentPath('/' + getBreadcrumbs().slice(1, index + 1).join('/'))}
              className="hover:text-blue-500"
            >
              {part === '/' ? 'Home' : part}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* File List */}
      <div className="border rounded">
        <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b font-medium">
          <div className="col-span-6">Name</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-4">Modified</div>
        </div>
        <div className="divide-y">
          {getCurrentItems().map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-12 gap-4 p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                if (item.type === 'folder') {
                  setCurrentPath(`${currentPath}${item.name}/`);
                }
              }}
            >
              <div className="col-span-6 flex items-center gap-2">
                {item.type === 'folder' ? (
                  <Folder size={20} className="text-blue-500" />
                ) : (
                  <File size={20} className="text-gray-500" />
                )}
                {item.name}
              </div>
              <div className="col-span-2">{item.size || '--'}</div>
              <div className="col-span-4">{item.modified || '--'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Alert */}
      {showUploadAlert && (
        <div className="fixed bottom-4 right-4">
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>File uploaded successfully!</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default FTPWebApp;