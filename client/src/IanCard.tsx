import React, {useState} from "react";
import {Card} from "react-bootstrap";
import BrushIcon from '@material-ui/icons/Brush';
import common from './c.svg';
import uncommon from './u.svg';
import rare from './r.svg';
import srare from './sr.svg';
import ssrare from './ssr.svg';
import './IanCard.css';
// @ts-ignore
import {Card as CardInterface, Rarity} from "./interfaces.ts";

interface IanCardProps {
    card: CardInterface;
    card_back: string;
    flipped?: boolean;
}

function IanCard(props: IanCardProps) {
    const [flip, setFlip] = useState<boolean>(props.flipped !== undefined ? props.flipped : false);

    var rarity = common;
    switch(props.card.rarity){
        case Rarity.ssr:
            rarity = ssrare;
            break;
        case Rarity.sr:
            rarity = srare;
            break;
        case Rarity.r:
            rarity = rare;
            break;
        case Rarity.u:
            rarity = uncommon;
            break;
        case Rarity.c:
        default:
            rarity = common;
            break;
    }

    return(
        <div className="card-contain" onClick={()=>{setFlip(!flip)}}>
            <div className={flip ? "card-inner flip" : "card-inner"}>
                <div className="card-front">
                    <Card bg={props.card.color} text={props.card.color === "light" ? "dark" : "light"}
                          className={(flip ? "" : "active") + " " + (props.card.shiny ? "shiny" : "")}>
                        <Card.Img variant="top" src={props.card.img} />
                        <Card.Header>{props.card.name}</Card.Header>
                        <Card.Body>
                            <Card.Text>{props.card.description}</Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            <div style={{width: "50%", float: "left", textAlign: "left"}}>
                                <BrushIcon />&nbsp;{props.card.artist}
                            </div>
                            <div style={{width: "50%", float: "right", textAlign: "right"}}>
                                <img alt="" src={rarity} height="24" />
                            </div>
                        </Card.Footer>
                    </Card>
                </div>
                <div className="card-back">
                    <img src={props.card_back} alt="Card Back" />
                </div>
            </div>
        </div>  
    );
}

export default IanCard;