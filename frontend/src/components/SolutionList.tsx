import React from 'react';
import styled from 'styled-components';
import { Contest } from '../../../shared/types/contest';
import ContestCard from './ContestCard';

const Container = styled.div`
  width: 100%;
  padding: 1rem 0;

  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
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
  margin: 1rem 0;
  color: ${(props) => props.theme.primary};
  font-size: 1.75rem;
  text-align: center;
  width: 100%;
  
  .solution-count {
    font-size: 1rem;
    background: ${props => props.theme.primary};
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-left: 0.5rem;
    vertical-align: middle;
  }
`;

const PlatformSection = styled.div`
  margin: 2rem 0;
`;

const PlatformTitle = styled.h3`
  color: ${props => props.theme.secondary};
  margin: 1rem 0;
  font-size: 1.25rem;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => props.theme.secondary};
  font-style: italic;
  background: ${(props) => props.theme.card};
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
`;

interface Props {
  contests: Contest[];
  onBookmark: (id: string) => void;
}

const SolutionList: React.FC<Props> = ({ contests, onBookmark }) => {
  // Filter contests that have solutions and sort by date
  const solutionsContests = contests
    .filter(contest => contest.solutionUrl)
    .sort((a, b) => {
      const dateA = a.solutionDetails?.publishedAt ? new Date(a.solutionDetails.publishedAt) : new Date(0);
      const dateB = b.solutionDetails?.publishedAt ? new Date(b.solutionDetails.publishedAt) : new Date(0);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });

  // Group solutions by platform and date
  const recentSolutions = solutionsContests.slice(0, 6); // Latest 6 solutions
  const platformSolutions = {
    Codeforces: solutionsContests.filter(c => c.platform === 'Codeforces'),
    CodeChef: solutionsContests.filter(c => c.platform === 'CodeChef'),
    LeetCode: solutionsContests.filter(c => c.platform === 'LeetCode'),
  };

  return (
    <Container>
      {recentSolutions.length > 0 && (
        <>
          <SectionTitle>
            Latest Solutions
            <span className="solution-count">{recentSolutions.length}</span>
          </SectionTitle>
          <Grid>
            {recentSolutions.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                onBookmark={onBookmark}
                showSolutionFirst={true}
              />
            ))}
          </Grid>
        </>
      )}

      <SectionTitle>
        Video Solutions
        <span className="solution-count">{solutionsContests.length}</span>
      </SectionTitle>
      
      {solutionsContests.length > 0 ? (
        <>
          {Object.entries(platformSolutions).map(([platform, platformContests]) => 
            platformContests.length > 0 && (
              <PlatformSection key={platform}>
                <PlatformTitle>{platform} Solutions</PlatformTitle>
                <Grid>
                  {platformContests.map((contest) => (
                    <ContestCard
                      key={contest.id}
                      contest={contest}
                      onBookmark={onBookmark}
                      showSolutionFirst={true}
                    />
                  ))}
                </Grid>
              </PlatformSection>
            )
          )}
        </>
      ) : (
        <EmptyState>
          No video solutions available yet. Check back later for expert solutions to recent contests.
        </EmptyState>
      )}
    </Container>
  );
};

export default SolutionList;
