import React, {useState} from "react";
import IanCard from "./IanCard";
import "./cardcollection.css";
import {CardDeck, Button, ButtonGroup, ToggleButton, ButtonToolbar} from "react-bootstrap";
// @ts-ignore
import {UserCollectionQty, Card} from "interfaces.ts";

interface CardCollectionProps {
    visible: Boolean;
    cardCollection: UserCollectionQty[];
    updateCallback: Function;
}

function CardCollection(props: CardCollectionProps) {
    // eslint-disable-next-line
    const [currentSort, setCurrentSort] = useState<string>("name");
    const [currentDirection, setCurrentDirection] = useState<string>("desc");

    const sorts = [
        {name: 'Name', value: 'name'},
        {name: 'Quantity', value: 'quantity'},
        {name: 'Acquire Date', value: 'acquire_ts'},
        {name: 'Rarity', value: 'rarity'}
    ];

    // Helper functions
    //https://morioh.com/p/9caf3015e0c0
    function compareValues(key:string, order = 'asc') {
        return function innerSort(a: Card, b: Card) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }
        
            let comparison = 0;
            if (a[key] > b[key]) {
                comparison = 1;
            } else if (a[key] < b[key]) {
                comparison = -1;
            }
            return (
                (order === 'desc') ? (comparison * -1) : comparison
            );
        };
    }

    function sortCards(cards : Card[]): Card[]
    {
        return cards.sort(compareValues(currentSort, currentDirection));
    }

    // Organize data
    var cards = new Array<Card>();
    if(props.cardCollection.length)
    {
        props.cardCollection.forEach((cur_item: UserCollectionQty) => {
            cards.push({
                ...cur_item.card, quantity: cur_item.quantity, 
                acquire_ts: cur_item.acquire_ts
            });
        });
        cards = sortCards(cards);
    }

    // Set up display
    var cardDecks = new Array<any>();
    var numCards = cards.length;
    var userCards = cards.map((data: Card, idx: number) => 
        <IanCard key={idx} card={data}  />
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

    return (
        <div className={props.visible ? "card-collection" : "hidden"}>
            <div style={{height: "10vh", width: "100vw", padding: "0 20vw"}}>
                <ButtonGroup style={{marginTop: "2vh", marginBottom: "2vh", float: "left"}}>
                    <Button variant="primary" onClick={() => props.updateCallback()}>Refresh Collection</Button>
                </ButtonGroup>
                <div style={{float: "right", display:"flex", alignItems: "center"}}>
                    <span style={{color: "black", fontSize: "20px"}}>Sort By:&nbsp;</span>
                    <ButtonToolbar aria-label="Sorting Config" style={{marginTop: "2vh", marginBottom: "2vh"}}>
                        <ButtonGroup toggle aria-label="Sort Property" style={{marginRight: "1vw"}}>
                            {sorts.map((radio, idx) => (
                                <ToggleButton key={idx} type="radio" variant="primary" name="property"
                                            value={radio.value} checked={currentSort === radio.value}
                                            onChange={(e) => setCurrentSort(e.currentTarget.value)}>
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                        <ButtonGroup toggle aria-label="Sort Direction">
                            <ToggleButton type="radio" variant="primary" name="direction"
                                          value="desc" checked={currentDirection === "desc"}
                                          onChange={(e) => setCurrentDirection(e.currentTarget.value)}>
                                Descending
                            </ToggleButton>
                            <ToggleButton type="radio" variant="primary" name="direction"
                                          value="asc" checked={currentDirection === "asc"}
                                          onChange={(e) => setCurrentDirection(e.currentTarget.value)}>
                                Ascending
                            </ToggleButton>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
            </div>
            <div style={{width: "100vw", minHeight: "95vh"}}>
                {cardDecks}
            </div>
        </div>
    )
}

export default CardCollection;