import React, { useState } from "react";
import styled from "styled-components";
import { Contest } from "../../../shared/types/contest";

const Card = styled.div`
  background: ${(props) => props.theme.card};
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;
  border: 1px solid ${(props) => props.theme.border};
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: "TLE";
    position: absolute;
    top: -10px;
    right: 10px;
    background: ${(props) => props.theme.primary};
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.5rem;
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  color: ${(props) => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const PlatformBadge = styled.span<{ platform: string }>`
  background: ${(props) => {
    switch (props.platform) {
      case "Codeforces":
        return "#FF4D4D";
      case "CodeChef":
        return "#4D8AFF";
      case "LeetCode":
        return "#FFC107";
      default:
        return props.theme.primary;
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  display: inline-block;
`;

const TimeInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.secondary};
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.primary};
  background: ${(props) =>
    props.variant === "primary" ? props.theme.primary : "transparent"};
  color: ${(props) =>
    props.variant === "primary" ? "white" : props.theme.primary};
  cursor: pointer;
  flex: 1;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const SolutionPreview = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: ${(props) => props.theme.background};
  border-radius: 8px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 4px;
    transition: transform 0.3s ease;
    cursor: pointer;
    
    &:hover {
      transform: scale(1.05);
    }
  }

  h4 {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    color: ${props => props.theme.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .solution-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: ${props => props.theme.secondary};
    margin-bottom: 0.5rem;
  }

  .tle-watermark {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 0.8rem;
    color: white;
    background: rgba(37, 99, 235, 0.8);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    background: rgba(255, 0, 0, 0.8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    
    &::before {
      content: "";
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 15px solid white;
      margin-left: 3px;
    }
  }
`;

const VideoModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const VideoIframeContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 800px;
  background: ${props => props.theme.background};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
  }
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  
  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover {
      background: rgba(0, 0, 0, 0.8);
      transform: scale(1.1);
    }
  }

  .error-message {
    padding: 2rem;
    text-align: center;
    color: ${props => props.theme.text};
  }
`;

interface Props {
  contest: Contest;
  onBookmark: (id: string) => void;
  showSolutionFirst?: boolean;
}

const ContestCard: React.FC<Props> = ({
  contest,
  onBookmark,
  showSolutionFirst,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  const timeUntilStart = () => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const diff = start.getTime() - now.getTime();

    if (diff < 0) return "Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  };

  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const renderSolution = () =>
    contest.solutionUrl && (
      <SolutionPreview>
        <div onClick={() => setIsVideoOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
          <img
            src={contest.solutionDetails?.thumbnailUrl || 
                `https://img.youtube.com/vi/${getYouTubeVideoId(contest.solutionUrl) || 'jJxKXyZNvO0'}/maxresdefault.jpg`}
            alt={contest.solutionDetails?.title || 'Video solution thumbnail'}
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              const videoId = getYouTubeVideoId(contest.solutionUrl!) || 'jJxKXyZNvO0';
              // Try hqdefault if maxresdefault fails
              img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="play-icon"></div>
        </div>
        <div className="solution-meta">
          <span>TLE Eliminators</span>
          <span>{formatDate(contest.solutionDetails?.publishedAt)}</span>
        </div>
        <h4>{contest.solutionDetails?.title || `${contest.name} Solution`}</h4>
        <Button
          variant="primary"
          onClick={() => setIsVideoOpen(true)}
        >
          📺 Watch Solution
        </Button>
        <div className="tle-watermark">TLE Eliminators Solution</div>
      </SolutionPreview>
    );

  const renderVideoModal = () => {
    if (!isVideoOpen || !contest.solutionUrl) return null;

    const videoId = getYouTubeVideoId(contest.solutionUrl);
    if (!videoId) return null;

    // Use nocookie domain and add more parameters for better performance
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&hl=en&enablejsapi=1&origin=${window.location.origin}`;

    return (
      <VideoModal 
        onClick={() => setIsVideoOpen(false)}
        role="dialog"
        aria-label="Video Solution"
      >
        <VideoIframeContainer onClick={(e) => e.stopPropagation()}>
          <button 
            className="close-button" 
            onClick={() => setIsVideoOpen(false)}
            aria-label="Close video"
          >×</button>
          <div className="video-wrapper">
            <iframe 
              src={embedUrl}
              title={contest.solutionDetails?.title || "Video Solution"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </VideoIframeContainer>
      </VideoModal>
    );
  };

  return (
    <>
      <Card>
        {showSolutionFirst ? (
          <>
            {renderSolution()}
            <PlatformBadge platform={contest.platform}>
              {contest.platform}
            </PlatformBadge>
            <Title>{contest.name}</Title>
          </>
        ) : (
          <>
            <PlatformBadge platform={contest.platform}>
              {contest.platform}
            </PlatformBadge>
            <Title>{contest.name}</Title>
            {renderSolution()}
          </>
        )}
        <TimeInfo>
          <span>🕒 {new Date(contest.startTime).toLocaleString()}</span>
          <span>⏱️ {contest.duration}h</span>
          <span>⏳ {timeUntilStart()}</span>
        </TimeInfo>
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={() => window.open(contest.url, "_blank")}
          >
            Join Contest
          </Button>
          <Button onClick={() => onBookmark(contest.id)}>
            {contest.isBookmarked ? "★ Saved" : "☆ Save"}
          </Button>
        </ButtonGroup>
      </Card>
      
      {renderVideoModal()}
    </>
  );
};

export default ContestCard;
