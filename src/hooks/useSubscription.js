// hooks/useSubscription.js
import { useState, useEffect } from 'react';
import { useAuth } from '../config/AuthContext';

export const useSubscription = () => {
  const { user } = useAuth();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!user) {
      setHasActiveSubscription(false);
      setLoading(false);
      return;
    }

    const checkSubscription = async () => {
      try {
        const response = await fetch(`/api/check-subscription?userId=${user.id}`);
        const data = await response.json();
        
        if (response.ok) {
          setHasActiveSubscription(data.hasActiveSubscription);
          setDaysRemaining(data.daysRemaining || 0);
          setSubscription(data.subscription);
        } else {
          setHasActiveSubscription(false);
        }
      } catch (error) {
        console.error('Erro ao verificar assinatura:', error);
        setHasActiveSubscription(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  return { hasActiveSubscription, loading, daysRemaining, subscription };
};