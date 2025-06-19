// src/components/ImageUpload.tsx
import React, { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, onRemove }) => {
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Erreur",
        description: "Le fichier est trop volumineux. Taille maximale : 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  if (value) {
    return (
      <div className="relative">
        <img
          src={value}
          alt="Uploaded cover"
          className="w-full h-48 object-cover rounded-lg"
        />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card 
      className={`border-2 border-dashed transition-colors ${
        isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 p-4 bg-gray-100 rounded-full">
          {isDragOver ? (
            <Upload className="h-8 w-8 text-blue-500" />
          ) : (
            <ImageIcon className="h-8 w-8 text-gray-500" />
          )}
        </div>
        
        <div className="text-center mb-4">
          <p className="text-lg font-medium text-gray-900">
            {isDragOver ? 'Déposez votre image ici' : 'Glissez-déposez votre image de couverture'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            ou cliquez pour sélectionner (JPG, PNG, GIF - Max 5MB)
          </p>
        </div>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Sélectionner une image
        </Button>
      </CardContent>
    </Card>
  );
};