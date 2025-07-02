'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DocumentUpload from '@/components/ui/DocumentUpload';

interface Document {
  id: string;
  name: string;
  url: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Documento1.pdf', url: '#' },
    { id: '2', name: 'Documento2.pdf', url: '#' },
  ]);

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Documentos</h1>
      <DocumentUpload />
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Documentos Subidos</h2>
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="flex justify-between items-center p-2 border rounded-md">
              <span>{doc.name}</span>
              <div className="space-x-2">
                <a
                  href={doc.url}
                  download
                  className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
                >
                  Descargar
                </a>
                <Button onClick={() => handleDelete(doc.id)} className="bg-red-500 text-white">
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 