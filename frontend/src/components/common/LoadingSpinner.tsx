import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid ${props => props.theme.border};
    border-top-color: ${props => props.theme.primary};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
  
  .text {
    margin-top: 1rem;
    color: ${props => props.theme.secondary};
    font-size: 0.9rem;
  }
`;

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...' }) => (
  <SpinnerContainer>
    <div className="spinner" />
    <div className="text">{text}</div>
  </SpinnerContainer>
);

export default LoadingSpinner;
