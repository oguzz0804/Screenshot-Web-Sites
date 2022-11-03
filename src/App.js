import './App.css';
import React, { useState, useEffect } from 'react';
import useDownloader from 'react-use-downloader';
const App = () => {
  const API_KEY = "APP_KEY"
  const dimension = "1920x1080"
  const format = "jpg"
  const [search, setSearch] = useState("https://www.google.com.tr");
  const [img, setImg] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const URL = `https://api.screenshotmachine.com/?key=${API_KEY}&url=${search}&dimension=${dimension}&format=${format}`
  const filename = `${search}.jpg`
  const {
    download
  } = useDownloader();

  function save(e) {
    var file = e.target.files[0] //the file
    var reader = new FileReader() //this for convert to Base64 
    reader.readAsDataURL(e.target.files[0]) //start conversion...
    reader.onload = function (e) { //.. once finished..
      var rawLog = reader.result.split(',')[1]; //extract only thee file data part
      var dataSend = { dataReq: { data: rawLog, name: file.name, type: file.type }, fname: "uploadFilesToGoogleDrive" }; //preapre info to send to API
      fetch('https://script.google.com/macros/s/AKfycbxGhtZZ80heQrJQ8uVOFSddPXwfoYuMLMVW95Vx1U7tlEkQxZPC8fAQETFXk7b33RJeLg/exec', //your AppsScript URL
        { method: "POST", body: JSON.stringify(dataSend) }) //send to Api
        .then(res => res.json()).then((a) => {
          console.log(a) //See response
        }).catch(e => console.log(e)) // Or Error in console
    }
  }
  const getScreenshots = async () => {
    setSearch("");
    setError(false);
    setLoading(true);
    const response = await fetch(URL);
    if (response.ok) {
      setImg(response);
      setLoading(false);
    } else {
      setError(true);
    }
  }

  const searchScreenshots = (e) => {
    e.preventDefault();
    getScreenshots();
  }

  useEffect(() => {
    setSearch("");
    getScreenshots();
  }, []);

  return (
    <div className="App">
      <nav>
        <div className="container">
          <form onSubmit={searchScreenshots}>
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
            <button onClick={() => download(URL, filename)} type="submit">Take Screenshot and Save</button>
          </form>
        </div>
        <div className="container">
          <form onSubmit={searchScreenshots}>
            <input type="file" accept="application/jpg" id="customFile" onChange={(e) => save(e)} />
          </form>
        </div>
      </nav>
      <div className="hero">
        {!loading && !error ? (
          <div classname="container">
            {img && (
              <a href={img.url} target="_blank">
                <img src={img.url} alt="background" /></a>
            )}
          </div>
        ) : !error && !loading ? (
          <div className="loading"></div>
        ) : error ? (
          <div className="container">
            <h2>Please enter a valid url</h2></div>
        ) : (
          ""
        )
        }

      </div>

    </div>
  );
}

export default App;
