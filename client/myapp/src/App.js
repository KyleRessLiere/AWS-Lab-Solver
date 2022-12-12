import logo from "./logo.svg";
import "@aws-amplify/ui-react/styles.css";
import { DataStore } from "@aws-amplify/datastore";
import { Lab } from "./models";
import { Post } from "./models";
import { useEffect, useState } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Storage } from "@aws-amplify/storage";
import { Auth } from "aws-amplify";

function App() {
  const [user, setUser] = useState({
    bastionAddress: "",
    region: "",
    user1AccessKey: "",
    user1SecretKey: "",
    user2AccessKey: "",
    user2SecretKey: "",
    user3AccessKey: "",
    user3SecretKey: "",
    labHostId: "",
  });
  const [selectedFile, setSelectedFile] = useState();

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    labOnePost(user, selectedFile);
    console.log("user created", user, selectedFile);
  };
  const labOnePost = async (user) => {
    const labData = {
      pemname: selectedFile,
      address: user.bastionAddress,
      region: user.region,
      user1AccessKey: user.user1AccessKey,
      user1SecretKey: user.user1SecretKey,
      user2AccessKey: user.user2AccessKey,
      user2SecretKey: user.user2SecretKey,
      user3AccessKey: user.user3AccessKey,
      user3SecretKey: user.user3SecretKey,
      labHostId: user.labHostId,
    };

    fetch(
      "https://kt5mwprxge.execute-api.us-east-1.amazonaws.com/default/lab1Solver",
      {
        method: "POST",
        header: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(labData),
      }
    )
      .then((response) => response.text())
      .then((data) => {
        console.log("Success:", data);
        const fileData = JSON.stringify(data);
        const blob = new Blob([fileData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "user-info.json";
        link.href = url;
        link.click();
        deleteFile(labData.pemname);
      });
  };
  async function deleteFile(fileName) {
    await Storage.remove(fileName);
    console.log(fileName);
  }
  async function onChange(e) {
    const file = e.target.files[0];
    let fileName = (Math.random() + 1).toString(36).substring(7) + ".pem";
    console.log(fileName);
    setSelectedFile(fileName);

    try {
      await Storage.put(fileName, file, {
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
  return (
    <div className="App">
      <div className="container">
        <h1>Aws Lab Solver Lab1</h1>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="labHostId">Lab Host Id</label>

            <input
              type="text"
              name="labHostId"
              onChange={handleChange}
              required
            />
            <label htmlFor="bastionAddress">Bastion Host</label>

            <input
              type="text"
              name="bastionAddress"
              onChange={handleChange}
              required
            />
            <label htmlFor="region">Region</label>
            <input type="text" name="region" onChange={handleChange} required />
            <label htmlFor="user1AccessKey">user1AccessKey</label>
            <input
              type="text"
              name="user1AccessKey"
              onChange={handleChange}
              required
            />
            <label htmlFor="user1SecretKey">user1SecretKey</label>
            <input
              type="text"
              name="user1SecretKey"
              onChange={handleChange}
              required
            />
            <label htmlFor="user2AccessKey">user2AccessKey</label>
            <input
              type="text"
              name="user2AccessKey"
              onChange={handleChange}
              required
            />
            <label htmlFor="user2SecretKey">user2SecretKey</label>
            <input
              type="text"
              name="user2SecretKey"
              onChange={handleChange}
              required
            />
            <label htmlFor="user3AccessKey">user3AccessKey</label>
            <input
              type="text"
              name="user3AccessKey"
              onChange={handleChange}
              required
            />
            <label htmlFor="user3SecretKey">user3SecretKey</label>
            <input
              type="text"
              name="user3SecretKey"
              onChange={handleChange}
              required
            />

            <hr></hr>
            <label>Upload .pem file for the lab</label>
            <input type="file" onChange={onChange} name="pem" accept=".pem" />
            <div className="submit-btn">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
