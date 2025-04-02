
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DisclaimerBanner = () => {
  return (
    <Alert className="bg-muted border-festive-300 mb-8">
      <AlertCircle className="h-4 w-4 text-festive-600" />
      <AlertDescription className="text-sm text-muted-foreground">
        <span className="font-semibold">Disclaimer:</span> This website is entirely satirical and meant for entertainment purposes only.
        No actual dowry calculations, financial advice, or serious implications are intended. Just laugh and enjoy!
      </AlertDescription>
    </Alert>
  );
};

export default DisclaimerBanner;
