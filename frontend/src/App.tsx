import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lightTheme, darkTheme } from "./theme/theme";
import { ContestList, ThemeToggle } from "./components";
import SolutionList from "./components/SolutionList";
import AnnouncementBanner from "./components/AnnouncementBanner";
import GlobalStyle from "./theme/GlobalStyle";
import FilterBar from "./components/FilterBar";
import Navigation from "./components/Navigation";
import { fetchContests, bookmarkContest } from "./services/api";
import { Contest } from "../../shared/types/contest";
import styled from "styled-components";
import PageLayout from './components/Layout/PageLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

const AppContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
  h1 {
    font-size: 2.5rem;
    color: ${(props) => props.theme.primary};
    margin-bottom: 0.5rem;
  }
  .subtitle {
    color: ${(props) => props.theme.secondary};
    font-size: 1.1rem;
  }
`;

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(
    () => window.localStorage.getItem("theme") === "dark"
  );
  const [contests, setContests] = useState<Contest[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [status, setStatus] = useState<"all" | "upcoming" | "past">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSolutionUpdate, setLastSolutionUpdate] = useState<Date | undefined>();

  useEffect(() => {
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const loadContests = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchContests();
        setContests(data);

        // Find the most recent solution update date
        const solutionContests = data.filter(c => c.solutionUrl);
        if (solutionContests.length > 0) {
          // Find latest published solution
          const latestSolution = solutionContests.reduce((latest, contest) => {
            if (!contest.solutionDetails?.publishedAt) return latest;
            const publishDate = new Date(contest.solutionDetails.publishedAt);
            return !latest || publishDate > latest ? publishDate : latest;
          }, undefined as Date | undefined);
          
          setLastSolutionUpdate(latestSolution);
        }
      } catch (err) {
        setError("Failed to load contests. Please try again later.");
        console.error("Error fetching contests:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadContests();
  }, []);

  const handleBookmark = async (id: string) => {
    try {
      // Optimistically update UI
      setContests(
        contests.map((contest) =>
          contest.id === id
            ? { ...contest, isBookmarked: !contest.isBookmarked }
            : contest
        )
      );

      // Make API call
      const newBookmarkState = await bookmarkContest(id);
      
      // Revert if API call fails
      setContests(
        contests.map((contest) =>
          contest.id === id
            ? { ...contest, isBookmarked: newBookmarkState }
            : contest
        )
      );
    } catch (err) {
      console.error("Error bookmarking contest:", err);
      // Revert on error
      setContests(
        contests.map((contest) =>
          contest.id === id
            ? { ...contest, isBookmarked: !contest.isBookmarked }
            : contest
        )
      );
    }
  };
  
  const savedContestsCount = contests.filter(contest => contest.isBookmarked).length;
  const solutionsCount = contests.filter(contest => contest.solutionUrl).length;

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <BrowserRouter>
        <Navigation savedContestsCount={savedContestsCount} solutionsCount={solutionsCount} />
        <ThemeToggle toggleTheme={() => setIsDark(!isDark)} isDark={isDark} />
        
        <PageLayout>
          <AnnouncementBanner 
            solutionsCount={solutionsCount} 
            lastUpdated={lastSolutionUpdate}
          />
          
          {error ? (
            <div className="error-message">{error}</div>
          ) : isLoading ? (
            <LoadingSpinner text="Loading contests..." />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <PageLayout
                    title="Programming Contests"
                    subtitle="Track and participate in upcoming programming contests"
                  >
                    <FilterBar
                      platforms={platforms}
                      status={status}
                      onPlatformChange={(platform) => {
                        setPlatforms((prev) =>
                          prev.includes(platform)
                            ? prev.filter((p) => p !== platform)
                            : [...prev, platform]
                        );
                      }}
                      onStatusChange={(newStatus: any) => setStatus(newStatus)}
                    />
                    <ContestList
                      contests={contests}
                      filter={{ platforms, status }}
                      onBookmark={handleBookmark}
                    />
                  </PageLayout>
                }
              />
              <Route
                path="/saved"
                element={
                  <ContestList
                    contests={contests.filter(c => c.isBookmarked)}
                    filter={{ platforms, status }}
                    onBookmark={handleBookmark}
                  />
                }
              />
              <Route
                path="/solutions"
                element={
                  <SolutionList
                    contests={contests}
                    onBookmark={handleBookmark}
                  />
                }
              />
            </Routes>
          )}
        </PageLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
