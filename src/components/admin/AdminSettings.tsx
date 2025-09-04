
import React, { useState } from 'react';
import { Settings, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { AdminCredentialsModal } from './AdminCredentialsModal';

interface AdminSettingsProps {
  onLogout: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onLogout }) => {
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setShowCredentialsModal(true)}>
            <User className="mr-2 h-4 w-4" />
            Update Credentials
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AdminCredentialsModal 
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
      />
    </>
  );
};
