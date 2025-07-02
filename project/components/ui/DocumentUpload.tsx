import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    // Lógica para subir el archivo
    console.log('Subiendo archivo:', selectedFile.name);
    // Resetear el estado después de la subida
    setSelectedFile(null);
  };

  return (
    <div className="p-4 border rounded-md">
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!selectedFile} className="mt-2">
        Subir Documento
      </Button>
    </div>
  );
} 