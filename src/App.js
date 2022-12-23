import axios from "axios";
import { useEffect, useState } from "react";
import Imgix from "react-imgix";

import "./App.css";

function App() {
  const [pic, setPic] = useState();
  const [sessionSourceId, setSessionSourceId] = useState(
    "no session. Please choose a file"
  ); //Used to check status.
  const [sessionStatus, setSessionStatus] = useState("No Status");
  const [sessionFilename, setSessionFilename] = useState("");
  const [searchArray, setSearchArray] = useState([]);

  useEffect(() => {
    //Used to set PENDING to CLOSED
    if (sessionStatus === "PENDING") {
      checkIfClosed();
    }
    //Use to set CLOSED status to COMPLETE
    if (sessionStatus === "CLOSED") {
      const interval = setInterval(() => {
        console.log("This will run every 7 seconds!");
        imgixHandleCheckStatus();
      }, 7000);
      return () => clearInterval(interval);
    }
    if (sessionStatus === "COMPLETE") {
      console.log("USEEFFECT SET TO COMPLETE");
      console.log(sessionFilename);
      setSearchArray(sessionFilename);
    }
  }, [sessionStatus]);

  //Used to set PENDING status to CLOSED.
  const checkIfClosed = async (e) => {
    console.log("checkIfClosed function");
    console.log("session status is: " + sessionStatus);

    if (sessionStatus === "PENDING") {
      const valueData = { grabbedSessionSourceID: sessionSourceId };

      //Set session to CLOSED.
      const sessionStatusForAxios = await axios
        .post(
          "https://backend-sessions-demo.vercel.app/checkImgixCloseSession",
          valueData
        )
        .then(console.log("Client - CLOSE imgix session"))
        .catch((error) => console.log(error.message));

      setSessionStatus(sessionStatusForAxios.data.data.attributes.status);
    }
  };

  //IMGIX EXAMPLES: STARTING SESSION
  const imgixHandleSubmitForSessionStarting = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pic", pic);
    // "https://backend-sessions-demo.vercel.app/startImgixSession",

    const retrievedBackendData = await axios
      .post(
        "https://backend-sessions-demo.vercel.app/startImgixSession",
        formData
      )
      .then(console.log("starting imgix session"))
      .catch((error) => console.log(error.message));

    let tempFilename = retrievedBackendData.data.sessionFilenameBackend;
    let myArrayForFilename = tempFilename.split();
    setSessionSourceId(retrievedBackendData.data.sessionIdBackend);
    setSessionStatus(retrievedBackendData.data.sessionStatusBackend);
    setSessionFilename(myArrayForFilename);
  };
  const imgixHandleChangeForSessionStarting = (e) => {
    setPic(e.target.files[0]);
  };

  //IMGIX EXAMPLE: CHECK SESSION STATUS
  const imgixHandleCheckStatus = async () => {
    const value = { grabbedSessionSourceID: sessionSourceId };

    const sessionStatusForAxios = await axios
      .post(
        "https://backend-sessions-demo.vercel.app/checkImgixSessionStatus",
        value
      )
      .then(console.log("Session status was checked."))
      .catch((error) => console.log(error.message));

    setSessionStatus(sessionStatusForAxios.data.data.attributes.status);
  };

  return (
    <div className='app'>
      <form className='form' onSubmit={imgixHandleSubmitForSessionStarting}>
        <input type='file' onChange={imgixHandleChangeForSessionStarting} />
        <br />
        <button>Upload Image</button>
      </form>
      <br />
      <h3>The Session Status is: {sessionStatus}</h3>
      <div>{searchArray.length === 0 && <h2>No image uploaded</h2>}</div>
      <div className='container'>
        {searchArray.map((value, index) => (
          <Imgix
            src={"https://sourcerer.imgix.net/" + value}
            width={200}
            height={200}
            key={index}
            imgixParams={{ auto: "format,compress,enhance", fit: "crop" }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
