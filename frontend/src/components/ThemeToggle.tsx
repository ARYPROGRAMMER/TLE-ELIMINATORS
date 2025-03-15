import React from "react";
import styled from "styled-components";

const ToggleButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  cursor: pointer;
  z-index: 100;
  font-size: 1.2rem;
`;

interface Props {
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeToggle: React.FC<Props> = ({ toggleTheme, isDark }) => (
  <ToggleButton onClick={toggleTheme}>{isDark ? "☀️" : "🌙"}</ToggleButton>
);

export default ThemeToggle;
