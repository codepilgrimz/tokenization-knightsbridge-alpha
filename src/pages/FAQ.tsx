
import React from 'react';
import { Header } from '../components/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

interface FAQProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const FAQ: React.FC<FAQProps> = ({ isDarkMode, onThemeToggle }) => {
  const faqs = [
    {
      id: "1",
      question: "What is the difference between Decentralized and Knightsbridge routes?",
      answer: "The Decentralized route offers a fully autonomous token launch process, while the Knightsbridge Approved route provides additional compliance, legal structuring, and professional vetting services for a more secure and regulated approach."
    },
    {
      id: "2",
      question: "How long does the token creation process take?",
      answer: "For Decentralized launches, tokens can be created within 24-48 hours. Knightsbridge Approved processes typically take 2-4 weeks due to additional compliance and legal review requirements."
    },
    {
      id: "3",
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment methods including Stripe (credit/debit cards), USDT (cryptocurrency), and Bitcoin for maximum flexibility."
    },
    {
      id: "4",
      question: "Do you provide legal documentation?",
      answer: "Yes, both routes offer legal documentation services. The Knightsbridge route includes comprehensive legal structuring, while the Decentralized route offers optional legal document packages."
    },
    {
      id: "5",
      question: "Can you help with exchange listings?",
      answer: "Absolutely! We provide exchange listing services for both centralized and decentralized exchanges, helping you get your token listed on major trading platforms."
    },
    {
      id: "6",
      question: "What blockchain networks do you support?",
      answer: "We support multiple blockchain networks including Ethereum, Binance Smart Chain, Polygon, and other EVM-compatible networks. Custom blockchain requirements can be discussed during consultation."
    },
    {
      id: "7",
      question: "Do you provide ongoing support after token launch?",
      answer: "Yes, we offer post-launch support including technical assistance, marketing guidance, and additional services to help ensure your project's success."
    },
    {
      id: "8",
      question: "What documents do I need to prepare?",
      answer: "Required documents vary by route. Generally, you'll need business plans, KYC documentation, and any relevant legal documents. Our platform will guide you through the specific requirements for your chosen path."
    }
  ];

  return (
    <div className={`w-full min-h-screen relative overflow-x-hidden bg-bg-primary ${!isDarkMode ? 'light' : ''}`}>
      <Header isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} />
      
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-text-primary text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our tokenization services and processes.
          </p>
        </div>

        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-border-primary">
                <AccordionTrigger className="text-left text-text-primary hover:text-blue-400 text-lg font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary text-base leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-text-secondary text-lg mb-4">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Contact Us
          </a>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
