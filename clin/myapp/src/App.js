import logo from "./logo.svg";
import "./App.css";
import { DataStore } from "@aws-amplify/datastore";
import { Lab } from "./models";
import { Post } from "./models";
import { useEffect } from "react";
function App() {
  const createPOST = async () => {
    const post = {
      title: window.prompt("blog post title"),
      content: window.prompt("blog post content"),
    };

    const newPost = await DataStore.save(new Post(post));
    console.log(newPost);
  };
  return (
    <div className="App">
      <button onClick={createPOST}>Create POST</button>
      <h1>Test</h1>
    </div>
  );
}

export default App;
