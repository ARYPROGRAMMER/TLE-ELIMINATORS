import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const BannerContainer = styled.div<{ isVisible: boolean }>`
  background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.card});
  color: white;
  padding: 0.75rem;
  text-align: center;
  border-radius: 8px;
  margin: 1rem auto;
  max-width: 95%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(-100px)'};
  opacity: ${props => props.isVisible ? '1' : '0'};
  position: relative;
`;

const BannerText = styled.div`
  flex: 1;
  font-weight: 500;
  
  span {
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const BannerButton = styled.button`
  background: white;
  color: ${props => props.theme.primary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

interface AnnouncementBannerProps {
  solutionsCount: number;
  lastUpdated?: Date;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ solutionsCount, lastUpdated }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  
  // Check local storage to see if user dismissed the banner recently
  useEffect(() => {
    const lastDismissed = localStorage.getItem('announcementDismissed');
    if (lastDismissed) {
      const dismissedTime = new Date(lastDismissed).getTime();
      const now = new Date().getTime();
      const hoursSinceDismissal = (now - dismissedTime) / (1000 * 60 * 60);
      
      // Show banner again after 24 hours
      setIsVisible(hoursSinceDismissal > 24);
    }
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('announcementDismissed', new Date().toISOString());
  };
  
  // Only show if there are solutions
  if (solutionsCount <= 0) return null;
  
  const formatDate = (date?: Date) => {
    if (!date) return 'recently';
    return date.toLocaleDateString();
  };
  
  return (
    <BannerContainer isVisible={isVisible}>
      <BannerText>
        <span>🎉 New!</span>
        {solutionsCount} video solution{solutionsCount !== 1 ? 's' : ''} available
        {lastUpdated ? ` (updated ${formatDate(lastUpdated)})` : ''}
      </BannerText>
      <BannerButton onClick={() => navigate('/solutions')}>
        Watch Now
      </BannerButton>
      <CloseButton onClick={handleDismiss}>×</CloseButton>
    </BannerContainer>
  );
};

export default AnnouncementBanner;
