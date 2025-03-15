import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const NavContainer = styled.nav`
  width: 100%;
  background: ${props => props.theme.primary};
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 99;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled(Link)`
  color: white;
  font-weight: bold;
  font-size: 1.4rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  span:first-child {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: white;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  
  .count {
    background: white;
    color: ${props => props.theme.primary};
    padding: 0.1rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

interface NavigationProps {
  savedContestsCount: number;
  solutionsCount: number;
}

const Navigation: React.FC<NavigationProps> = ({ savedContestsCount, solutionsCount }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <NavContainer>
      <NavContent>
        <Logo to="/">
          <span>TLE</span>
          <span>Contest Tracker</span>
        </Logo>
        <NavLinks>
          <NavLink to="/" active={isActive('/')}>All Contests</NavLink>
          <NavLink to="/saved" active={isActive('/saved')}>
            Saved <span className="count">({savedContestsCount})</span>
          </NavLink>
          <NavLink to="/solutions" active={isActive('/solutions')}>
            Solutions <span className="count">({solutionsCount})</span>
          </NavLink>
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navigation;
