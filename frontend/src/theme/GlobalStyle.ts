import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    transition: all 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
  }

  button {
    font-family: inherit;
  }

  a {
    color: ${(props) => props.theme.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  /* Center all heading elements by default */
  h1, h2, h3, h4, h5, h6 {
    text-align: center;
  }
`;

export default GlobalStyle;
