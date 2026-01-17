import React from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { User } from '@/types';

interface UserActionsProps {
  user: User;
  onToggleStatus: (userId: string, newStatus: 'active' | 'inactive') => void;
  isUpdating?: boolean;
}

/**
 * UserActions Component
 *
 * Renders action buttons for a user row.
 * Shows activate / deactivate toggle.
 */
export const UserActions: React.FC<UserActionsProps> = ({
  user,
  onToggleStatus,
  isUpdating = false,
}) => {
  const handleToggle = () => {
    /**
     * STEP 7.1 — Confirmation before deactivation
     */
    if (
      user.status === 'active' &&
      !window.confirm('Deactivate this user?')
    ) {
      return;
    }

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    onToggleStatus(user.userId, newStatus);
  };

  if (isUpdating) {
    return <CircularProgress size={20} />;
  }

  return (
    <Tooltip
      title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
    >
      <IconButton
        onClick={handleToggle}
        color={user.status === 'active' ? 'error' : 'success'}
        size="small"
        aria-label={
          user.status === 'active' ? 'Deactivate user' : 'Activate user'
        }
      >
        {user.status === 'active' ? <CancelIcon /> : <CheckCircleIcon />}
      </IconButton>
    </Tooltip>
  );
};
