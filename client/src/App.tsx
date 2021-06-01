import {useEffect, useState} from 'react';
// @ts-ignore
import {Card, UserCollectionQty, Series, OrderedSeries} from 'interfaces.ts';
import {Navbar, Nav, CardDeck} from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';
import logo from "./logo.svg";
import gachapon from "./gachapon.png";
import './App.css';
import CardCollection from "./cardcollection";
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import IanCard from './IanCard';
import HomePage from './HomePage';

function App() {
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [gettingCard, setGettingCard] = useState<boolean>(false);
  const [activeApp, setActiveApp] = useState<string>("0");
  const [series, setSeries] = useState<OrderedSeries>({});
  const [cardCollection, setCardCollection] = useState<UserCollectionQty[]>([]);
  const [gachaponWobble, setGachaponWobble] = useState<number>(0);
  const [loadingCollection, setLoadingCollection] = useState<boolean>(true);
  const [loadingSeries, setLoadingSeries] = useState<boolean>(true);

  // Some functions
  function getRandomCard()
  {
    axios.get('/api/card/random').then((resp: AxiosResponse) => {
      // Add the card
      var user_id = Cookies.get("user_id");
      var newCard = resp.data;
      setCurrentCards([newCard, ...currentCards].slice(0,21));

      // Check that we have this series
      if(!(newCard.series in series))
      {
        setLoadingSeries(true);
        getSeries();
      }

      axios.post('/api/collection/' + user_id + '/update', {
        user_id: user_id,
        card_id: newCard.id,
        quantity: 1
      }).then((resp: AxiosResponse) => {
        setGettingCard(false);
        getCollection();
      }).catch((resp: AxiosResponse) => {
        setGettingCard(false);
        console.log(resp);
      });
    }).catch((resp: AxiosResponse) => {
      setGettingCard(false);
      console.log(resp);
    });
  }

  // Get a series
  function getSeries()
  {
    axios.get("/api/series").then((resp: AxiosResponse) => {
      // Add this series
      const data : Series[] = resp.data;
      let series_data : OrderedSeries = {};
      data.forEach((value, idx) => {
        series_data[value.id] = value;
      });
      setSeries(series_data);
      setLoadingSeries(false);
    }).catch((resp: AxiosResponse) => {
      // If we get any error besides 404, try again after a second or two
      if(resp.status !== 404)
      {
        setTimeout(() => {getSeries()}, 1000);
      }
    });
  }

  // Get the user's collection
  function getCollection()
  {
    var user_id = Cookies.get("user_id");
    axios.get("/api/collection/" + user_id + "/cards").then((resp) => {
      setCardCollection(resp.data);
      setLoadingCollection(false);
    }).catch((resp) => {
      console.log(resp);
    });
  }

  useEffect(() => {
    getCollection();
    getSeries();
    // eslint-disable-next-line
  }, [])

  // Whenever we click the gachapon, we should try to get a card
  useEffect(() => {
    if(gachaponWobble === 1)
    {
      if(!gettingCard)
      {
        setGettingCard(true);
        getRandomCard();
      }
    }
    // eslint-disable-next-line
  }, [gachaponWobble])

  // Check for a user
  if(Cookies.get('user_id') === undefined)
  {
    var id = uuidv4();
    Cookies.set('user_id', id, {expires: 3650});
    axios.post("/api/user/new", {id: id, username: ""}).then((resp) => {
      console.log(resp);
    }).catch((resp) => {
      console.log(resp);
    });
  }

  // Set up display
  var cardDecks = new Array<any>();
  var numCards = currentCards.length;
  var userCards = currentCards.map((data: Card, idx: number) => 
      <IanCard key={idx} card={data} card_back={series[data.series].card_back} />
  );

  for(var jj = 0; jj < numCards; jj += 3)
  {
      cardDecks.push(
          <CardDeck key={jj} style={{justifyContent: "center"}}>
              {jj < numCards ? userCards[jj] : <div/> }
              {jj+1 < numCards ? userCards[jj+1] : <div/> }
              {jj+2 < numCards ? userCards[jj+2] : <div/> }
          </CardDeck>
      );
  }

  if(loadingCollection || loadingSeries)
  {
    return (
      <div className="loading-contain">
        <h1>Loading...</h1>
        <img src={logo} alt="logo"/>
      </div>
    )
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" sticky="top" collapseOnSelect  expand="md">
        <Navbar.Brand>
          <img alt="" src={logo} width="30" className="d-inline-block align-top" />
          &nbsp;Ian Card
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" activeKey={activeApp} onSelect={(selectedKey) => setActiveApp(selectedKey === null ? "0" : selectedKey)}>
            <Nav.Link eventKey="0">Home</Nav.Link>
            <Nav.Link eventKey="1">Collection</Nav.Link>
            <Nav.Link eventKey="2">Get Cards</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <HomePage visible={activeApp === "0" ? true : false}></HomePage>
      <CardCollection updateCallback={getCollection} visible={activeApp === "1" ? true : false} cardCollection={cardCollection} series={series} />
      <header className={activeApp === "2" ? "App-header" : "hidden"}>
        <div style={{height: "30vh", width: "100vw", padding: "2vh 20vw", textAlign: "center"}}>
          <img alt="" style={{height: "100%"}} src={gachapon} 
                data-wobble={gachaponWobble} onClick={() => setGachaponWobble(1)}
                onAnimationEnd={() => setGachaponWobble(0)} />
        </div>
        <div style={{minHeight: "70vh", width: "100vw"}}>
          {cardDecks}
        </div>
      </header>
    </div>
  );
}

export default App;
