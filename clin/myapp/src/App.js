import logo from "./logo.svg";
import "@aws-amplify/ui-react/styles.css";
import { DataStore } from "@aws-amplify/datastore";
import { Lab } from "./models";
import { Post } from "./models";
import { useEffect } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Storage } from "@aws-amplify/storage";
import { Auth } from "aws-amplify";

function App() {
  const labOnePost = async () => {
    const data = {
      pemname: "labsuser.pem",
      address: "44.202.189.244",
      region: "us-east-1",
      user1AccessKey: "AKIAWNBISRYXABLY4Z6M",
      user1SecretKey: "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",
      user2AccessKey: "AKIAWNBISRYXDS7EITNF",
      user2SecretKey: "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",
      user3AccessKey: "AKIAWNBISRYXPBK3DAGI",
      user3SecretKey: "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",
      labHostId: "44.202.189.244",
    };

    console.log(JSON.stringify(data));
    fetch(
      "https://kt5mwprxge.execute-api.us-east-1.amazonaws.com/default/lab1Solver",
      {
        method: "POST",
        header: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.text())
      .then((data) => {
        console.log("Success:", data);
      });
  };
  const createPOST = async () => {
    const post = {
      title: window.prompt("blog post title"),
      content: "post content",
    };
    //await Storage.put("test.txt", "Hello World file");

    //calls the lab1 lambda function
    await labOnePost();
    const newPost = await DataStore.save(new Post(post));
    console.log(newPost);
  };
  return (
    <div className="App">
      <button onClick={labOnePost}>Create POST</button>
      <h1>Test</h1>
    </div>
  );
}

export default withAuthenticator(App);
