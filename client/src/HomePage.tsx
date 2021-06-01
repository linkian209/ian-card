import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AnnouncementPost from './AnnouncementPost';
// @ts-ignore
import { Announcement } from './interfaces';
import './HomePage.css';

interface HomePageProps {
    visible: Boolean;
}

function HomePage(props: HomePageProps) {
    const [announcements, setAnnouncements] = useState([]);

    // Get All announcements
    useEffect(() => {
        axios.get('/api/announcement').then((resp) => {
           setAnnouncements(resp.data);
        })
        // eslint-disable-next-line
    }, []);

    // Get announcements ready
    var posts = announcements.map((data: Announcement, idx: number) => {
        return(<AnnouncementPost key={idx} announcement={data} />);
    });

    var display = (<></>);
    if(posts.length)
    {
      display = (
        <div className="announcements">
            <div style={{width: "95%"}}>
                <h3>Announcements</h3>
                <br/>
                <hr className="border border-light"/>
            </div>
            {posts}
        </div>
      );
    }

    return (
        <div className={props.visible ? "home-page" : "hidden"}>
            <div className="welcome">Welcome to Ian Card</div>
            {display}
        </div>
    );
}

export default HomePage;