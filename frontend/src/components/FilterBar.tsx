import React from "react";
import styled from "styled-components";

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) => props.theme.card};
  border-radius: 8px;
  margin: 1rem auto;
  width: 100%;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.5rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) =>
    props.active ? props.theme.primary : props.theme.card};
  color: ${(props) => (props.active ? "white" : props.theme.text)};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.primary};
    color: white;
  }
`;

interface Props {
  platforms: string[];
  status: string;
  onPlatformChange: (platform: string) => void;
  onStatusChange: (status: string) => void;
}

const FilterBar: React.FC<Props> = ({
  platforms,
  status,
  onPlatformChange,
  onStatusChange,
}) => (
  <FilterContainer>
    <FilterGroup>
      {["Codeforces", "CodeChef", "LeetCode"].map((platform) => (
        <FilterButton
          key={platform}
          active={platforms.includes(platform)}
          onClick={() => onPlatformChange(platform)}
        >
          {platform}
        </FilterButton>
      ))}
    </FilterGroup>
    <FilterGroup>
      {["all", "upcoming", "past"].map((statusType) => (
        <FilterButton
          key={statusType}
          active={status === statusType}
          onClick={() => onStatusChange(statusType)}
        >
          {statusType.charAt(0).toUpperCase() + statusType.slice(1)}
        </FilterButton>
      ))}
    </FilterGroup>
  </FilterContainer>
);

export default FilterBar;
