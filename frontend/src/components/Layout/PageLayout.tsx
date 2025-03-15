import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Header = styled.header`
  text-align: center;
  margin: 2rem 0 3rem;
  
  h1 {
    font-size: 2.5rem;
    color: ${props => props.theme.primary};
    margin-bottom: 0.5rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  .subtitle {
    color: ${props => props.theme.secondary};
    font-size: 1.1rem;
    max-width: 600px;
    margin: 1rem auto;
  }
`;

const Content = styled.main`
  min-height: calc(100vh - 300px);
`;

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <Container>
      {(title || subtitle) && (
        <Header>
          {title && <h1>{title}</h1>}
          {subtitle && <div className="subtitle">{subtitle}</div>}
        </Header>
      )}
      <Content>
        {children}
      </Content>
    </Container>
  );
};

export default PageLayout;
