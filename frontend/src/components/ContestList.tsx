import React, { useState, useEffect } from "react";
import styled from "styled-components";

import ContestCard from "./ContestCard";
import { Contest, ContestFilter } from "../../../shared/types/contest";

const Container = styled.div`
  width: 100%;
  padding: 1rem 0;

  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 0.5rem;
  }
`;

const SectionTitle = styled.h2`
  margin: 2rem 0 1rem;
  color: ${(props) => props.theme.primary};
  font-size: 1.5rem;
  text-align: center;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin: 1rem 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => props.theme.secondary};
  font-style: italic;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${(props) => props.active ? props.theme.primary : 'transparent'};
  color: ${(props) => props.active ? 'white' : props.theme.text};
  border: 1px solid ${(props) => props.theme.primary};
  border-radius: ${(props) => props.active ? '4px' : '4px'};
  font-weight: ${(props) => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  margin: 0 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.active ? props.theme.primary : props.theme.background};
    transform: translateY(-2px);
  }
`;

interface Props {
  contests: Contest[];
  filter: ContestFilter;
  onBookmark: (id: string) => void;
}

const ContestList: React.FC<Props> = ({ contests, filter, onBookmark }) => {
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [savedContests, setSavedContests] = useState<Contest[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

  useEffect(() => {
    const filtered = contests.filter((contest) => {
      const matchesPlatform =
        filter.platforms.length === 0 ||
        filter.platforms.includes(contest.platform);
      const matchesStatus =
        filter.status === "all" ||
        (filter.status === "upcoming" &&
          new Date(contest.startTime) > new Date()) ||
        (filter.status === "past" && new Date(contest.startTime) <= new Date());
      return matchesPlatform && matchesStatus;
    });
    
    setFilteredContests(filtered);
    
    // Filter saved contests
    setSavedContests(contests.filter((contest) => contest.isBookmarked));
  }, [contests, filter]);

  return (
    <Container>
      <TabsContainer>
        <Tab 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          All Contests
        </Tab>
        <Tab 
          active={activeTab === 'saved'} 
          onClick={() => setActiveTab('saved')}
        >
          Saved Contests ({savedContests.length})
        </Tab>
      </TabsContainer>

      {activeTab === 'all' ? (
        <>
          <SectionTitle>Contests</SectionTitle>
          <FilterContainer>{/* Add filter UI components here */}</FilterContainer>
          
          {filteredContests.length > 0 ? (
            <Grid>
              {filteredContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  onBookmark={onBookmark}
                />
              ))}
            </Grid>
          ) : (
            <EmptyState>No contests found matching your filters.</EmptyState>
          )}
        </>
      ) : (
        <>
          <SectionTitle>Saved Contests</SectionTitle>
          {savedContests.length > 0 ? (
            <Grid>
              {savedContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  onBookmark={onBookmark}
                />
              ))}
            </Grid>
          ) : (
            <EmptyState>
              You haven't saved any contests yet. Click the "Save" button on any contest card to add it here.
            </EmptyState>
          )}
        </>
      )}
    </Container>
  );
};

export default ContestList;
