import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useQuery, gql } from "@apollo/client";

const query = gql`
  query getalltodo {
    gettodos {
      title
      id
      user {
        name
        email
        phone
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(query);
  const [count, setCount] = useState(0);

  if (loading) return <p>Loading...</p>;
  return (
    <>
      <div className="App">
      {JSON.stringify(data)}
      </div>
    </>
  );
}

export default App;
