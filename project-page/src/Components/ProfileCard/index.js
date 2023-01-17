import { Card, CardContent } from "@mui/material";
import React from "react";


export const ProfileCard = ({profilename,profileemail,profilegithub,profilelinkedin}) => {
return(
    <Card sx={{minWidth:250,minHeight:200}}>
        <CardContent sx={{
            flexDirection:'column',
            display: 'flex'
        }}>
        <span>{profilename}</span>
              <a href={profileemail}>Email</a>
              <a href={profilegithub}>Github</a>
              <a href={profilelinkedin}>LinkedIn</a>
        </CardContent>
    </Card>
);
}





