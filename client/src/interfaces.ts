export interface UserCollection {
    user_id: string;
    card_id: string;
    quantity: number;
}

export interface OrderedSeries {
  [key: number]: Series;
}


export interface CardQty {
    [key: string]: number;
}

export interface CardAcquire {
    [key: string]: string;
}

export enum Rarity {
    c = 1,
    u,
    r,
    sr,
    ssr
}

export interface Series {
    id: number;
    name: string;
    card_back: string;
    create_ts: string;
}

export interface Card {
    id: string;
    name: string;
    description: string;
    img: string;
    rarity: Rarity;
    artist: string;
    shiny: boolean;
    series: number;
    color: string;
    quantity?: number;
    acquire_ts?: string;
}

export interface UserCollectionQty {
    card: Card;
    quantity: number;
    acquire_ts: string;
}

export interface Announcement {
    id: number;
    title: string;
    date: Date;
    body: string;
}