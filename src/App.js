import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pic, setPic] = useState();
  const [sessionSourceId, setSessionSourceId] = useState(
    "no session. Please choose a file"
  ); //Used to check status.
  const [sessionStatus, setSessionStatus] = useState("No Status");
  const [sessionPresignedUrl, setSessionPresignedUrl] =
    useState("No session URL"); //Long amazon url
  useEffect(() => {}, []);

  //IMGIX EXAMPLES: STARTING SESSION
  const imgixHandleSubmitForSessionStarting = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pic", pic);
    //"https://backend-sessions-demo.vercel.app/startImgixSession",

    const retrievedBackendData = await axios
      .post(
        "https://backend-sessions-demo.vercel.app/startImgixSession",
        formData
      )
      .then(console.log("starting imgix session"))
      .catch((error) => console.log(error.message));

    //console.log(test.data.theFileType);

    console.log(retrievedBackendData.data);

    setSessionSourceId(retrievedBackendData.data.sessionIdBackend);
    setSessionStatus(retrievedBackendData.data.sessionStatusBackend);
    setSessionPresignedUrl(
      retrievedBackendData.data.sessionPresignedUrlBackend
    );
  };
  const imgixHandleChangeForSessionStarting = (e) => {
    setPic(e.target.files[0]);
  };

  //IMGIX EXAMPLE: CHECK SESSION STATUS
  const imgixHandleCheckStatus = async (e) => {
    e.preventDefault();
    const value = { grabbedSessionSourceID: sessionSourceId };

    //check session
    const sessionStatusForAxios = await axios
      .post(
        "https://backend-sessions-demo.vercel.app/checkImgixSessionStatus",
        value
      )
      .then(console.log("Check imgix session"))
      .catch((error) => console.log(error.message));

    setSessionStatus(
      "Checked: " + sessionStatusForAxios.data.data.attributes.status
    );
  };

  //IMGIX EXAMPLE: CLOSE SESSION
  const imgixHandleCloseSession = async (e) => {
    e.preventDefault();
    const valueData = { grabbedSessionSourceID: sessionSourceId };

    //close session
    const sessionStatusForAxios = await axios
      .post(
        "https://backend-sessions-demo.vercel.app/checkImgixCloseSession",
        valueData
      )
      .then(console.log("Client - CLOSE imgix session"))
      .catch((error) => console.log(error.message));

    setSessionStatus(
      "Checked: " + sessionStatusForAxios.data.data.attributes.status
    );
  };

  return (
    <div className='app'>
      <form className='form' onSubmit={imgixHandleSubmitForSessionStarting}>
        <input type='file' onChange={imgixHandleChangeForSessionStarting} />
        <br />
        <button>Starting a session</button>
      </form>
      <button onClick={imgixHandleCloseSession}>Close Session</button>
      <br />
      <button onClick={imgixHandleCheckStatus}>Check session status</button>

      <br />
      <h3>The sessionSourceId is: {sessionSourceId}</h3>
      <h3>The sessionStatus is: {sessionStatus}</h3>
      <h3>The sessionPresignedUrl is: {sessionPresignedUrl}</h3>
    </div>
  );
}

export default App;
