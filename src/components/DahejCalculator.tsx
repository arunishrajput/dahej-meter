import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, ChevronsRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ResultDisplay from './ResultDisplay';

interface FormData {
  education: string;
  profession: string;
  socialMediaFollowers: number;
  land: number; // in acres
  livestock: number;
  govtJob: string;
  cookingSkills: number;
  traditionValues: number;
  ancestralProperty: string;
  relativesInGovernment: number;
  houseServants: number;
  familyBusiness: string;
  snoreLevel: number;
}

const DahejCalculator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    education: 'bachelors',
    profession: 'tech',
    socialMediaFollowers: 500,
    land: 2,
    livestock: 3,
    govtJob: 'no',
    cookingSkills: 60,
    traditionValues: 50,
    ancestralProperty: 'some',
    relativesInGovernment: 0,
    houseServants: 0,
    familyBusiness: 'no',
    snoreLevel: 20,
  });
  const [result, setResult] = useState<number | null>(null);

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateDahej = () => {
    // Purely satirical and exaggerated calculation with MORE HUMOR!
    let baseValue = 100000;
    
    // Education factor (completely satirical)
    const educationMultipliers: Record<string, number> = {
      'high-school': 0.8,
      'bachelors': 1.2, // reduced impact of education
      'masters': 1.5, // reduced from 2.0
      'phd': 1.7, // reduced from 2.5
      'no-degree': 0.9  // increased from 0.7 (being uneducated is less penalized in orthodox thinking!)
    };
    
    // Profession factor (completely satirical)
    const professionMultipliers: Record<string, number> = {
      'tech': 1.5, // reduced from 2.2
      'doctor': 1.7, // reduced from 2.0
      'engineer': 1.6, // reduced from 1.8
      'business': 1.7,
      'government': 2.0, // increased from 1.5 (sarkari job is GOLD!)
      'teacher': 1.2,
      'other': 1.0
    };

    // Government job is a MASSIVE bonus in the orthodox marriage market
    const govtJobMultiplier = formData.govtJob === 'yes' ? 3.0 : 1.0; // increased from 1.8
    
    // Social media calculation (satirical "influence" factor)
    // Less important in orthodox values
    const followerFactor = Math.log10(formData.socialMediaFollowers + 1) * 0.1; // reduced from 0.2
    
    // Land and livestock (traditional satirical factors) - SIGNIFICANTLY MORE VALUABLE
    const landFactor = formData.land * 0.5; // increased from 0.15
    const livestockFactor = formData.livestock * 0.15; // increased from 0.05
    
    // Skills factors (completely made up)
    const cookingFactor = (formData.cookingSkills / 100) * 1.5 + 0.8; // increased importance
    const traditionFactor = (formData.traditionValues / 100) * 1.5 + 0.8; // increased importance
    
    // New factors (absurdly orthodox values)
    let ancestralPropertyMultiplier = 1.0;
    switch(formData.ancestralProperty) {
      case 'none': ancestralPropertyMultiplier = 0.8; break;
      case 'some': ancestralPropertyMultiplier = 1.5; break;
      case 'substantial': ancestralPropertyMultiplier = 2.7; break;
      case 'haveli': ancestralPropertyMultiplier = 4.0; break;
    }
    
    // "Connections" are very valuable
    const relativesBonus = formData.relativesInGovernment * 0.4;
    
    // Servants indicate status
    const servantsBonus = Math.min(formData.houseServants * 0.2, 2.0);
    
    // Family business
    const businessMultiplier = formData.familyBusiness === 'yes' ? 1.8 : 1.0;
    
    // Snoring is a dealbreaker!
    const snorePenalty = Math.max(0.5, 1.0 - (formData.snoreLevel / 100));
    
    // Final calculation with random variance (25% either way) for comedic effect
    const calculatedValue = baseValue * 
      educationMultipliers[formData.education] * 
      professionMultipliers[formData.profession] * 
      govtJobMultiplier *
      (1 + followerFactor) * 
      (1 + landFactor) * 
      (1 + livestockFactor) * 
      cookingFactor * 
      traditionFactor *
      ancestralPropertyMultiplier *
      (1 + relativesBonus) *
      (1 + servantsBonus) *
      businessMultiplier *
      snorePenalty;
      
    // Add randomness for humor
    const randomFactor = 0.75 + (Math.random() * 0.5);
    const finalValue = Math.round(calculatedValue * randomFactor / 1000) * 1000;
    
    return finalValue;
  };

  const handleNextStep = () => {
    if (step < 3) { // Now 3 steps instead of 2
      setStep(step + 1);
    } else {
      // Calculate result
      const dahejValue = calculateDahej();
      setResult(dahejValue);
      toast.success("Your satirical dahej value has been calculated!", {
        description: "Remember, this is purely for entertainment!"
      });
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
  };

  if (result !== null) {
    return <ResultDisplay value={result} onReset={handleReset} formData={formData} />;
  }

  return (
    <Card className="dahej-card w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-festive-700">
              {step === 1 ? 'Personal Details' : 
               step === 2 ? 'Traditional Factors' : 
               'Orthodox Priorities'}
            </h3>
            <p className="text-sm text-gray-500">Step {step} of 3</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-festive-100 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-festive-600" />
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="education">Educational Qualification</Label>
                <Select 
                  value={formData.education} 
                  onValueChange={(value) => handleChange('education', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-degree">No Degree (School Dropout)</SelectItem>
                    <SelectItem value="high-school">High School Graduate</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD / Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Select 
                  value={formData.profession} 
                  onValueChange={(value) => handleChange('profession', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology/IT</SelectItem>
                    <SelectItem value="doctor">Doctor/Medical</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                    <SelectItem value="government">Government Employee</SelectItem>
                    <SelectItem value="teacher">Teacher/Professor</SelectItem>
                    <SelectItem value="other">Other Profession</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Social Media Followers</Label>
                  <span className="text-sm font-medium">{formData.socialMediaFollowers.toLocaleString()}</span>
                </div>
                <Slider
                  value={[formData.socialMediaFollowers]}
                  min={0}
                  max={100000}
                  step={100}
                  onValueChange={(value) => handleChange('socialMediaFollowers', value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 (Traditional Values!)</span>
                  <span>100k (Modern Influencer)</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="govtJob">Sarkari Naukri Status</Label>
                <RadioGroup 
                  value={formData.govtJob} 
                  onValueChange={(value) => handleChange('govtJob', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="govt-yes" />
                    <Label htmlFor="govt-yes" className="cursor-pointer">सरकारी नौकरी (Yes) 🌟</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="govt-no" />
                    <Label htmlFor="govt-no" className="cursor-pointer">Private Job (No) 😔</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Land Ownership (Acres of Zameen)</Label>
                  <span className="text-sm font-medium">{formData.land} acres</span>
                </div>
                <Slider
                  value={[formData.land]}
                  min={0}
                  max={20}
                  step={0.5}
                  onValueChange={(value) => handleChange('land', value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 acres (Landless 😢)</span>
                  <span>20 acres (Zamindar 👑)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Livestock Count (Gaay/Bhains/Bakri)</Label>
                  <span className="text-sm font-medium">{formData.livestock}</span>
                </div>
                <Slider
                  value={[formData.livestock]}
                  min={0}
                  max={15}
                  step={1}
                  onValueChange={(value) => handleChange('livestock', value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 (No animals!)</span>
                  <span>15+ ("Dairy business")</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Cooking Skills</Label>
                  <span className="text-sm font-medium">{formData.cookingSkills}%</span>
                </div>
                <Slider
                  value={[formData.cookingSkills]}
                  min={0}
                  max={100}
                  onValueChange={(value) => handleChange('cookingSkills', value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Burns water</span>
                  <span>MasterChef material</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Traditional Values</Label>
                  <span className="text-sm font-medium">{formData.traditionValues}%</span>
                </div>
                <Slider
                  value={[formData.traditionValues]}
                  min={0}
                  max={100}
                  onValueChange={(value) => handleChange('traditionValues', value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Modern ("Too Western")</span>
                  <span>Sanskari (परंपरागत)</span>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="ancestralProperty">Ancestral Property Status</Label>
                <Select 
                  value={formData.ancestralProperty} 
                  onValueChange={(value) => handleChange('ancestralProperty', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No ancestral property (Dukhad! 😢)</SelectItem>
                    <SelectItem value="some">Some property in village</SelectItem>
                    <SelectItem value="substantial">Substantial lands & buildings</SelectItem>
                    <SelectItem value="haveli">Own a 150-year old Haveli (Wow! 🏰)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyBusiness">Family Business Ownership</Label>
                <RadioGroup 
                  value={formData.familyBusiness} 
                  onValueChange={(value) => handleChange('familyBusiness', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="business-yes" />
                    <Label htmlFor="business-yes" className="cursor-pointer">Yes, "Pushtaini karobaar" 💼</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="business-no" />
                    <Label htmlFor="business-no" className="cursor-pointer">No family business 😔</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Government Relatives (No. of relatives in govt positions)</Label>
                  <span className="text-sm font-medium">{formData.relativesInGovernment}</span>
                </div>
                <Slider
                  value={[formData.relativesInGovernment]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => handleChange('relativesInGovernment', value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 (No "connections" 📞)</span>
                  <span>10+ (Political dynasty 🕴️)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>House Servants Count (Status symbol!)</Label>
                  <span className="text-sm font-medium">{formData.houseServants}</span>
                </div>
                <Slider
                  value={[formData.houseServants]}
                  min={0}
                  max={8}
                  step={1}
                  onValueChange={(value) => handleChange('houseServants', value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 (Self-reliant 🧹)</span>
                  <span>8 (Downton Abbey style 👨‍💼)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Snoring Level (Deal-breaker!)</Label>
                  <span className="text-sm font-medium">{formData.snoreLevel}%</span>
                </div>
                <Slider
                  value={[formData.snoreLevel]}
                  min={0}
                  max={100}
                  onValueChange={(value) => handleChange('snoreLevel', value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Silent sleeper 😇</span>
                  <span>Sawmill competitor 🪚</span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 flex justify-end">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)} 
              className="mr-2"
            >
              Back
            </Button>
          )}
          <Button 
            className="festive-btn"
            onClick={handleNextStep}
          >
            {step === 3 ? 'Calculate Dahej Value Now!' : 'Next Step'}
            <ChevronsRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DahejCalculator;
