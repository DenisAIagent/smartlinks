// src/components/AnalyticsConfig.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3, Target } from 'lucide-react';

interface AnalyticsConfigProps {
  gtmId: string;
  ga4Id: string;
  onGtmChange: (value: string) => void;
  onGa4Change: (value: string) => void;
}

export const AnalyticsConfig: React.FC<AnalyticsConfigProps> = ({
  gtmId,
  ga4Id,
  onGtmChange,
  onGa4Change,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Configuration Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gtm-id" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              ID Google Tag Manager
            </Label>
            <Input
              id="gtm-id"
              placeholder="GTM-XXXXXXX"
              value={gtmId}
              onChange={(e) => onGtmChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Format : GTM-XXXXXXX
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ga4-id" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              ID Google Analytics 4
            </Label>
            <Input
              id="ga4-id"
              placeholder="G-XXXXXXXXXX"
              value={ga4Id}
              onChange={(e) => onGa4Change(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Format : G-XXXXXXXXXX
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};