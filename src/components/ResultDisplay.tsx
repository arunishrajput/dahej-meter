
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, Share2, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultDisplayProps {
  value: number;
  onReset: () => void;
  formData: {
    education: string;
    profession: string;
    socialMediaFollowers: number;
    land: number;
    livestock: number;
    govtJob: string;
    cookingSkills: number;
    traditionValues: number;
    ancestralProperty: string;
    relativesInGovernment: number;
    houseServants: number;
    familyBusiness: string;
    snoreLevel: number;
  };
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ value, onReset, formData }) => {
  const [showGif, setShowGif] = useState(false);

  const formatCurrency = (amount: number) => {
    // Format in Indian rupees style with commas
    return '₹ ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getValueDescription = () => {
    if (value < 500000) {
      return "Budget Bargain (चल जाएगा!)";
    } else if (value < 1000000) {
      return "Decent Deal (ठीक है!)";
    } else if (value < 2000000) {
      return "Premium Package (अच्छा है!)";
    } else if (value < 5000000) {
      return "Luxury Level (बहुत बढिया!)";
    } else {
      return "Royal Ransom (राजा बेटा!)";
    }
  };

  const getHumorousComment = () => {
    const comments = [];
    
    // Education-based comments
    if (formData.education === 'phd') {
      comments.push(`PhD? Shaadi ke baad bhi padhai? Rishtedaar judge kar rahe hain... ${formData.govtJob === 'yes' ? 'Chalo, sarkari naukri bachaa rahi hai!' : 'Try adding a government uncle!'}`);
    } else if (formData.education === 'no-degree') {
      comments.push(`No degree? Chalo, kam se kam "ghar basane" ki tayari toh shuru kar sakte ho!`);
    }
    
    // Profession-based comments
    if (formData.profession === 'tech') {
      comments.push(`Tech job? Matlab paisa toh hai, par mummy kehti hain "beta, government job dekh le!"`);
    } else if (formData.profession === 'government') {
      comments.push(`Sarkari naukri? Mubarak ho, aapki shaadi ke baad bhi "government scheme" chalti rahegi!`);
    }
    
    // Land and livestock comments
    if (formData.land > 10) {
      comments.push(`Zameen? Itni zyada? Ladki wale abhi bhi shaadi ki date fix kar rahe hain!`);
    } else if (formData.land === 0) {
      comments.push(`No land? Beta, abhi bhi time hai! Try adding a buffalo at least.`);
    }
    
    if (formData.livestock > 5) {
      comments.push(`Moo-ing assets detected! Aapke dahej ka asli star toh aapki gaay-bhains hain!`);
    }
    
    // Funny combos and Easter Eggs
    if (formData.profession === 'government' && formData.education === 'phd') {
      comments.push(`PhD + Sarkari Naukri? Aapko toh "Dahej Mega Jackpot" mil sakta hai!`);
    }
    
    if (formData.relativesInGovernment === 0) {
      comments.push(`No government relatives? Beta, abhi bhi time hai! Ek sarkari uncle dhoond lo.`);
    }
    
    if (formData.cookingSkills < 30) {
      comments.push(`Cooking skills itni kam? Dahej me private chef add karna padega!`);
    }
    
    if (formData.socialMediaFollowers > 50000) {
      comments.push(`Influencer? Shaadi ke baad bhi daily vlogs aayenge? Future in-laws already scared!`);
    }
    
    // Extra generic comments
    const genericComments = [
      "Mubarak ho! Aapka Dahej Amazon Great Indian Sale se bhi sasta nikla.",
      "Aapka dahej paiso se zyada sanskaaron mein taula ja raha hai!",
      "Agar IAS nahi bane, toh rishtedaar sirf mummy se baat karenge!",
      "Shaadi ka market value badhane ke liye 'sarkari uncle' ka feature add karein!",
      "Aapka dahej ki keemat: 500 kg barfi ya ek iPhone 15 Pro?",
      "Yeh value itni bhi buri nahi… bas shaadi ke time ladki wale bina hasi-chhupaye maan lein!"
    ];
    
    while (comments.length < 3) {
      const randomGeneric = genericComments[Math.floor(Math.random() * genericComments.length)];
      if (!comments.includes(randomGeneric)) {
        comments.push(randomGeneric);
      }
    }
    
    return comments[Math.floor(Math.random() * comments.length)];
  };

  // Trigger confetti effect on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Satirical Dahej Calculator Result',
        text: `According to this hilarious dahej calculator, I'm worth ${formatCurrency(value)}! 😂 Check your own value at DahejMeter.vercel.app`
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(
        `According to this hilarious dahej calculator, I'm worth ${formatCurrency(value)}! 😂 Check your own value at DahejMeter.vercel.app`
      );
      setShowGif(true);
      setTimeout(() => setShowGif(false), 2000);
    }
  };

  return (
    <Card className="dahej-card w-full max-w-3xl mx-auto overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-festive-gradient p-6 text-white">
          <div className="flex justify-between items-center">
            <h3 className="fancy-title text-xl">Your Dahej Value</h3>
            <Trophy className="h-8 w-8 text-gold-300 animate-pulse-scale" />
          </div>
          <p className="text-sm opacity-80 mb-4">100% Satirical • Just For Fun</p>
          <div className="text-center py-6">
            <div className="inline-block bg-white/20 rounded-xl px-6 py-4 backdrop-blur-sm animate-celebrate">
              <span className="text-4xl font-bold text-white">{formatCurrency(value)}</span>
            </div>
            <p className="mt-2 text-xl font-semibold">{getValueDescription()}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-gold-100 border border-gold-300 rounded-lg p-4 text-center">
            <p className="text-gray-700">{getHumorousComment()}</p>
          </div>
          
          <p className="text-sm text-center text-gray-500 italic">
            Remember: This is 100% satirical. Real human value can't be measured in rupees!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Calculate Again
            </Button>
            <Button 
              className="gold-btn flex-1"
              onClick={handleShareClick}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Result
            </Button>
          </div>
          
          {showGif && (
            <div className="text-center text-sm text-green-600 mt-2">
              Copied to clipboard!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
