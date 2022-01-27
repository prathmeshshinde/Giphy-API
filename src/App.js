import { useState, useEffect } from "react";
import "./App.css";

const apiKey = "Y91ewjUZzc3XOPm5POgmaemTbzcdtD1G";

function App() {
  const [data, setData] = useState("");
  const [sms, setSms] = useState([]);
  const [gif, setGif] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [gifList, setGifList] = useState([]);
  const [selectedGif, setSelectedGif] = useState(null);

  const getGif = async (e) => {
    e.preventDefault();
    const result = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&limit=10&q=${searchText}`
    );

    const finalData = await result.json();

    console.log(finalData);

    setGifList(finalData.data);
    setSearchText("");
  };

  const showGif = () => {
    setGif(!gif);
    if (gif) {
      setGifList([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);

    const newSms = {
      message: data,
      url: selectedGif?.images.preview_gif.url ?? null,
    };

    if (!!data.length) {
      setSms([...sms, newSms]);
      console.log([...sms, newSms]);
      setData("");
      setSelectedGif(null);
    }
  };

  useEffect(() => {
    const local = localStorage.getItem("my-gif-list");
    if (local) {
      setSms(JSON.parse(local));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("my-gif-list", JSON.stringify(sms));
  });

  const selectGif = (gif) => {
    setSelectedGif(gif);
    setGif(false);
    setGifList([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <form>
          <div className="search">
            <input
              className="searchBar"
              type="text"
              placeholder="Write something"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />

            <input
              className="submitSms"
              onClick={handleSubmit}
              type="submit"
              value="Submit "
            />
          </div>
        </form>

        <div className="gif">
          <img
            style={{ width: 200 }}
            src={selectedGif?.images.preview_gif.url}
          />
        </div>

        <div className="gifButton">
          <button className="addGif" onClick={showGif}>
            Add GIF
          </button>
        </div>

        {gif && (
          <form>
            <div className="gifSearch">
              <input
                className="gifSearchBar"
                placeholder="Search GIF"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <input
                type="submit"
                className="gifSearchButton"
                value="Search"
                onClick={getGif}
              />
            </div>
          </form>
        )}
      </header>

      <div className="gifList">
        <div className="gifMap">
          {gifList.map((gif, index) => {
            return (
              <img
                style={{ width: 200 }}
                className="gifListImg"
                key={index}
                src={gif.images.preview_gif.url}
                onClick={() => selectGif(gif)}
              />
            );
          })}
        </div>
      </div>

      <div className="postSms">
        {sms.map((sms, index) => {
          return (
            <div className="postImg" key={index}>
              {!!sms.url?.length && (
                <img style={{ width: 200 }} src={sms.url} />
              )}
              <p>{sms.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
