// src/components/SmartlinkCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartlink } from '@/types/smartlink';
import { Edit, ExternalLink, Eye, MousePointer, Calendar, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartlinkCardProps {
  smartlink: Smartlink;
  onEdit: (id: string) => void;
}

export const SmartlinkCard: React.FC<SmartlinkCardProps> = ({ smartlink, onEdit }) => {
  const { toast } = useToast();
  
  const smartlinkUrl = `${window.location.origin}/smartlink/${smartlink.id}`;
  const totalClicks = Object.values(smartlink.clicks).reduce((sum, clicks) => sum + clicks, 0);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(smartlinkUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien du smartlink a été copié dans le presse-papiers.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  const openSmartlink = () => {
    window.open(smartlinkUrl, '_blank');
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{smartlink.title}</h3>
            <p className="text-sm text-muted-foreground">{smartlink.artist}</p>
            {smartlink.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {smartlink.description}
              </p>
            )}
          </div>
          {smartlink.coverImage && (
            <img 
              src={smartlink.coverImage} 
              alt={smartlink.title}
              className="w-16 h-16 object-cover rounded-lg ml-4"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{smartlink.views} vues</span>
          </div>
          <div className="flex items-center gap-1">
            <MousePointer className="h-4 w-4" />
            <span>{totalClicks} clics</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(smartlink.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {smartlink.platforms.slice(0, 4).map(platform => (
            <Badge key={platform.id} variant="secondary" className="text-xs">
              <span className="mr-1">{platform.icon}</span>
              {platform.name}
            </Badge>
          ))}
          {smartlink.platforms.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{smartlink.platforms.length - 4} autres
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(smartlink.id)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openSmartlink}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};