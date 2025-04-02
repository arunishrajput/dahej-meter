
import React from 'react';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import DahejCalculator from '@/components/DahejCalculator';
import { Calculator, Gift, Star, Trophy } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-festive-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl fancy-title text-festive-800 mb-2">
              Dahej<span className="text-gold-600">Meter</span>
            </h1>
            <div className="absolute -top-4 -right-4 transform rotate-12">
              <Star className="h-6 w-6 text-gold-500 fill-gold-500" />
            </div>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A satirical calculator for the completely fictional "market value" of your dahej. 
            <span className="font-semibold text-festive-600"> 100% humor, 0% seriousness!</span>
          </p>
        </header>
        
        <DisclaimerBanner />
        
        {/* Calculator Section */}
        <section className="mb-16">
          <DahejCalculator />
        </section>
        
        {/* Features Section */}
        <section className="my-16 text-center">
          <h2 className="text-2xl fancy-title text-festive-700 mb-8">Why This Exists</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="dahej-card">
              <div className="mb-4 w-12 h-12 bg-festive-100 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="h-6 w-6 text-festive-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Satirical Fun</h3>
              <p className="text-gray-600">
                This calculator exists purely for humor and entertainment, poking fun at traditional concepts.
              </p>
            </div>
            
            <div className="dahej-card">
              <div className="mb-4 w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto">
                <Gift className="h-6 w-6 text-gold-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cultural Commentary</h3>
              <p className="text-gray-600">
                A lighthearted way to reflect on outdated customs through the lens of humor and satire.
              </p>
            </div>
            
            <div className="dahej-card">
              <div className="mb-4 w-12 h-12 bg-festive-100 rounded-full flex items-center justify-center mx-auto">
                <Calculator className="h-6 w-6 text-festive-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Just For Laughs</h3>
              <p className="text-gray-600">
                No real calculations, no serious implications—just an absurd take on an absurd concept.
              </p>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} DahejMeter • A Satirical Web Experience
            <br/>
            <span className="text-xs">
              No actual dowries were calculated in the making of this website.
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
