import * as React from 'react';

import "./App.css";
import ProjectPlan from "./Tabs/ProjectPlan";
import MileStone1 from './Tabs/Milestone1';
import MileStone2 from './Tabs/Milestone2';
import { Box } from "@mui/system";
import { AppBar, Button, Tab, Tabs, Toolbar, Card, CardContent } from "@mui/material";
import MileStone3 from './Tabs/Milestone3';
import { ProfileCard } from './Components/ProfileCard';
import { ProjectPlanSem2 } from './Tabs/ProjectPlan-Sem2';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = React.useState(0);
  const handleOnTabChange = (event , newValue) => {
    setValue(newValue);
  };

  return (
    <div className="root">
      <div className="navBar">
        <AppBar position='sticky'>
          <Toolbar>Secure Door Lock</Toolbar>
        </AppBar>
      </div>

      <div className="whatWeDo">
        <Card>
          <CardContent sx={{
            display: 'flex',
            flexdirection:'column',
            maxWidth: 400
          }}>
            <h3>We strive to bring secure technology right to your front door</h3>
            <Button variant="contained">
              <h3>Go to the App</h3>
            </Button>
          </CardContent>
        </Card>
        

      </div>
      <div className="aboutUs">
        <h1>Who We Are</h1>
        <div className="infoCards"> 
        <Card sx={{minWidth:250,minHeight:200}}>
            <CardContent sx={{
              flexDirection:'column',
              display: 'flex'
            }}>
              <span>Project Advisor</span>
              <span>Dr. Marius Silaghi</span>
              <a href="msilaghi@fit.edu">Email</a>
              <a href='https://www.fit.edu/faculty-profiles/s/silaghi-marius/'>Faculty Profile</a>
            </CardContent>  
          </Card>

          <ProfileCard 
            profilename={"Luke Bucher"}
            profileemail={"lbucher2017@my.fit.edu"}
            profilegithub={"https://github.com/LukeBucher"}
            profilelinkedin={"https://linkedin.com/in/luke-bucher"}
          />

          <ProfileCard
            profilename={"Warren Smith"}
            profileemail={"wsmith2019@my.fit.edu"}
            profilegithub={"https://github.com/warosm"}
            profilelinkedin={"https://www.linkedin.com/in/warren-smith-95396b206/"}
          />

          <ProfileCard
            profilename={"James Pabisz"}
            profileemail={"jpabisz2020@my.fit.edu"}
          />

          <ProfileCard
            profilename={"Chris Kiefer"}
            profileemail={"ckiefer2019@my.fit.edu"}
          />
        </div>
      </div>


    <div className="readerGroup" id="readerGroup">
      <h1>About the Project</h1>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: 5,
        }}
      >
        <CardContent>
          <Box sx={{
            borderBottom:1
          }}>
              <Tabs value={value} onChange={handleOnTabChange}>
                <Tab label = "Project Plan"/>
                <Tab label = "Milestone 1"/>
                <Tab label = "Milestone 2"/>
                <Tab label = "Milestone 3"/>
                <Tab label = "Project Plan Semester 2"/>
                <Tab label = "Milestone 4"/>
                <Tab label = "Milestone 5"/>
                <Tab label = "Milestone 6"/>
              </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <h2>Project Plan - Sep 7</h2>
            <ProjectPlan/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <h2>Milestone 1 - Oct 5</h2>
            <MileStone1/>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <h2>Milestone 2 - Oct 31</h2>
            <MileStone2/>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <h2>Milestone 3 - Nov 28</h2>
            <MileStone3/>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <h2>Project Plan - Jan 18</h2>
            <ProjectPlanSem2/>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <h2>Milestone 4 - Feb 13</h2>
          </TabPanel>
          <TabPanel value={value} index={6}>
            <h2>Milestone 5 - Mar 20</h2>
          </TabPanel>
          <TabPanel value={value} index={7}>
            <h2>Milestone 6 - Apr 17</h2>
          </TabPanel>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

export default App;
