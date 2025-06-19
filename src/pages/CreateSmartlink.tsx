// src/pages/CreateSmartlink.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SmartlinkForm } from '@/components/SmartlinkForm';
import { Smartlink, SmartlinkFormData } from '@/types/smartlink';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://smartlinks-backend-production.up.railway.app/api';

export default function CreateSmartlink() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: SmartlinkFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/smartlinks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du smartlink');
      }

      const smartlink = await response.json();
      
      toast({
        title: "Smartlink créé !",
        description: "Votre smartlink a été créé avec succès.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du smartlink.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Créer un nouveau smartlink
            </h1>
            <p className="text-slate-600">
              Configurez votre smartlink pour partager votre musique sur toutes les plateformes
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <SmartlinkForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

