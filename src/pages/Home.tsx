
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { ArrowRight } from 'lucide-react';

interface HomeProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Home: React.FC<HomeProps> = ({ isDarkMode, onThemeToggle }) => {
  return (
    <div className={`w-full min-h-screen relative overflow-x-hidden bg-bg-primary ${!isDarkMode ? 'light' : ''}`}>
      <Header isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} />

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl">
          <h1 className="text-text-primary text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-8 leading-tight">
            Begin Your<br />
            Tokenization Journey
          </h1>
          <p className="text-text-secondary text-lg md:text-xl lg:text-2xl font-normal max-w-3xl mx-auto leading-relaxed">
            Professional tools for token minting, compliance, legal structuring, and<br />
            exchange listing — tailored for the digital age
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-20">
          <Link
            to="/knightsbridge"
            className="group px-8 py-4 border border-text-secondary rounded-lg text-text-primary text-lg font-medium hover:border-text-primary transition-all duration-200 flex items-center justify-center gap-3 min-w-[200px]"
          >
            Knightsbridge
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            to="/decentralized"
            className="group px-8 py-4 border border-text-secondary rounded-lg text-text-primary text-lg font-medium hover:border-text-primary transition-all duration-200 flex items-center justify-center gap-3 min-w-[200px]"
          >
            Decentralized
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Steps Section */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Step 01 */}
          <div className="text-left">
            <h3 className="text-text-primary text-xl md:text-2xl font-medium mb-4">
              STEP 01: <br />CHOOSE PATH
            </h3>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed h-20 md:h-24">
              Select between the Knightsbridge Approved route or the fully Decentralized launch.
            </p>
            <div className="w-full h-px bg-text-secondary mt-8"></div>
          </div>

          {/* Step 02 */}
          <div className="text-left">
            <h3 className="text-text-primary text-xl md:text-2xl font-medium mb-4">
              STEP 02: <br />CUSTOMIZE
            </h3>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed h-20 md:h-24">
              Add token details, select optional services (whitepaper, legal docs, listings), and upload required documents.
            </p>
            <div className="w-full h-px bg-text-secondary mt-8"></div>
          </div>

          {/* Step 03 */}
          <div className="text-left">
            <h3 className="text-text-primary text-xl md:text-2xl font-medium mb-4">
              STEP 03: <br />CHECKOUT
            </h3>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed h-20 md:h-24">
              Choose your payment method — Stripe, USDT, or Bitcoin.
            </p>
            <div className="w-full h-px bg-text-secondary mt-8"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
