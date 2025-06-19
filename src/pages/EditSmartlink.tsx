// src/pages/EditSmartlink.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SmartlinkForm } from '@/components/SmartlinkForm';
import { storage } from '@/lib/storage';
import { Smartlink, SmartlinkFormData } from '@/types/smartlink';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function EditSmartlink() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [smartlink, setSmartlink] = useState<Smartlink | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const link = storage.getSmartlinkById(id);
      if (link) {
        setSmartlink(link);
      } else {
        toast({
          title: "Smartlink introuvable",
          description: "Le smartlink que vous cherchez n'existe pas.",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [id, navigate, toast]);

  const handleSubmit = async (formData: SmartlinkFormData) => {
    if (!smartlink) return;
    
    setIsLoading(true);
    
    try {
      const updatedSmartlink: Smartlink = {
        ...smartlink,
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      storage.saveSmartlink(updatedSmartlink);
      
      toast({
        title: "Smartlink mis à jour !",
        description: "Votre smartlink a été modifié avec succès.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du smartlink.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!smartlink) return;
    
    setIsDeleting(true);
    
    try {
      storage.deleteSmartlink(smartlink.id);
      
      toast({
        title: "Smartlink supprimé",
        description: "Le smartlink a été supprimé avec succès.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!smartlink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Chargement...</h2>
          <p className="text-slate-600">Chargement des données du smartlink</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer le smartlink "{smartlink.title}" ? 
                    Cette action est irréversible et toutes les statistiques associées seront perdues.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Suppression...' : 'Supprimer'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Modifier "{smartlink.title}"
            </h1>
            <p className="text-slate-600">
              Modifiez les paramètres de votre smartlink
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <SmartlinkForm 
            initialData={smartlink}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}