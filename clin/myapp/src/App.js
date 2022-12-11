import { React, useState } from "react";
import { Post } from "./models";
import { Storage } from "@aws-amplify/storage";
import { DataStore } from "@aws-amplify/datastore";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { FaArrowCircleDown, FaArrowCircleUp } from 'react-icons/fa';
import axios from 'axios';
import "@aws-amplify/ui-react/styles.css";
import "./App.css";


function App() {


  const labOnePost = async () => {
    const data = {
      pemname: "caleb1.pem",
      address: "34.238.241.88",
      region: "us-east-1",
      user1AccessKey: "AKIAZJMENSM5QEBU3A72",
      user1SecretKey: "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",
      user2AccessKey: "AKIAZJMENSM5Z6Y7DYEL",
      user2SecretKey: "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",
      user3AccessKey: "AKIAZJMENSM5VEQEBN47",
      user3SecretKey: "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",
      labHostId: "i-06f41f501cd7f1d8a",
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


  async function onChange(e) {
    const file = e.target.files[0];
    try {
      await Storage.put(file.name, file, {
        contentType: "image/png", // contentType is optional
      });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }


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


  const [showScroll, setShowScroll] = useState(true)
  const checkScrollTop = () => {
    console.log("Scroll is called")
    if (showScroll && window.pageYOffset < 400){
      setShowScroll(true)
      console.log("showing")
    } else if (!showScroll && window.pageYOffset <= 400){
      setShowScroll(false)
      console.log("NOT showing")
    }
  };

  const scrollDown = () =>{
    window.scrollTo({top: 1050, behavior: 'smooth'});
  };

  window.addEventListener('scroll', checkScrollTop)


  return (
    <div className="App">
      <div className="Logo">
        <img src="/images/awsCoachIcon.png" alt="AWS Coach"></img>
      </div>
      <div class="directions">
        <h2>To get started: </h2>
        <ol class="List">
          <li>Go to <a href="https://awsacademy.instructure.com/courses/25810/modules/items/2131460" target="_blank" rel="noopener noreferrer">AWS Academy (lab 1 - IAM)</a> and login</li>       
          <li>Select "Start Lab" and wait up to 5 min for the lab to initialize</li>
          <li>Once initialized, select "Details", then "Show"</li>
          <li>Download the "PEM" file</li>
          <li>Retrieve the LabHostId, BastionHost, Region, and the three Access and Secret Keys</li>
          <li>Scroll down and enter details</li>
        </ol>
      </div>
      <FaArrowCircleDown
        className="scrollDown"
        onClick={scrollDown}
        style={{height: 40, display: showScroll ? 'flex' : 'none'}}
      />
      <div className="section1">
        <div className="Form">
          <input type="file" onChange={onChange} />;
        </div>
      </div>
      <div className="section2">
        <h2>Enter details from AWS Academy Lab</h2>
        <form class="form-style-4" action="/lab1" method="get">
          <label for="LabHostId"/>
          <span>LabHostId</span><input name="LabHostId" type="text" required="true" />;
          <label for="BastionHost">
          <span>BastionHost</span><input name="LabHostId" type="text" required="true" />;
          </label>
          <label for="Region">
          <span>Region</span><input name="LabHostId" type="text" required="true" />;
          </label>
          <label for="User1AccessKey">
          <span>User1AccessKey</span><input name="User1AccessKey" type="text" />;
          </label>
          <label for="User1SecretKey">
          <span>User1SecretKey</span><input name="User1SecretKey" type="text"  />;
          </label>
          <label for="User2AccessKey">
          <span>User2AccessKey</span><input name="User2AccessKey" type="text"  />;
          </label>
          <label for="User2SecretKey">
          <span>User2SecretKey</span><input name="User2SecretKey" type="text"  />;
          </label>
          <label for="User3AccessKey">
          <span>User3AccessKey</span><input name="User3AccessKey" type="text"  />;
          </label>
          <label for="User3SecretKey">
          <span>User3SecretKey</span><input name="User3SecretKey" type="text"  />;
          </label>
          <label>
          <span> </span><input type="submit" onSubmit={labOnePost} value="Request to simulate AWS lab" />
          </label>
        </form>
      </div>
      <div className="section3">
        <button onClick={labOnePost}>Create POST</button>
      </div>
    </div>
  );
}

export default withAuthenticator(App);