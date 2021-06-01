import React from 'react';
import { Card } from 'react-bootstrap';
import { Announcement } from './interfaces';

interface AnnouncementPostProps {
    announcement: Announcement;
}

function AnnouncementPost(props: AnnouncementPostProps) {

    // Format the announcement date
    //@ts-ignore
    let date = new Date(Date.parse(props.announcement.date));
    let formatted_date = date.toLocaleString("en-US");
    
    return (
        <Card bg="secondary" text="white" style={{width: "95%", marginTop: "2vh", marginBottom: "2vh"}}>
            <Card.Header>
                <h3>{props.announcement.title}</h3>
            </Card.Header>
            <Card.Body>
              <span>{props.announcement.body}</span>
            </Card.Body>
            <Card.Footer style={{color: "rgba(255,255,255, .6)"}}>
                {formatted_date}
            </Card.Footer>
        </Card>
    );
}

export default AnnouncementPost;