import { useState } from "react";

function App() {
  const [show, setShow] = useState(false);

  return (
    <main className="app">
      <h1>Show / Hide Paragraph</h1>
      <button type="button" onClick={() => setShow((current) => !current)}>
        {show ? "Hide" : "Show"}
      </button>
      {show && <p>Hello! Welcome to React JS.</p>}
    </main>
  );
}

export default App;
