
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminSidebarProps {
  activeSection: 'form-submissions' | 'contact-messages';
  onSectionChange: (section: 'form-submissions' | 'contact-messages') => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: 'form-submissions' as const,
      label: 'Form Submissions',
      icon: FileText,
    },
    {
      id: 'contact-messages' as const,
      label: 'Contact Messages',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="w-64 min-h-[calc(100vh-80px)] bg-bg-primary border-r border-border-primary">
      <div className="p-4">
        <h2 className="text-text-primary text-lg font-medium mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
