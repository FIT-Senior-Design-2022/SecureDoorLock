import * as React from 'react';

import "./App.css";
import ProjectPlan from "./Tabs/ProjectPlan";
import MileStone1 from './Tabs/Milestone1';
import { Box } from "@mui/system";
import { AppBar, Button, Tab, Tabs, Toolbar, Card, CardContent } from "@mui/material";

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
        <span>We strive to bring secure technologoy right to your front door</span>
        <Button 
        varient="contained"
        >Go to the App</Button>
      </div>
      <div className="aboutUs">
        <h1>Who We Are</h1>
        <div className="infoCards">
        <Card sx={{minWidth:250,minHeight:200}}>
            <CardContent sx={{
              flexDirection:'column',
              display: 'flex'
            }}>
              <span>Project Advisor-</span>
              <span>Dr. Marius Silaghi</span>
              <a href="msilaghi@fit.edu">msilaghi@fit.edu</a>
            </CardContent>  
          </Card>
          <Card sx={{minWidth:250,minHeight:200}}>
            <CardContent sx={{
              flexDirection:'column',
              display: 'flex'
            }}>
              <span>Luke Bucher</span>
              <a href="lbucher2017@my.fit.edu">lbucher2017@fit.edu</a>
              <a href="https://github.com/LukeBucher">Github</a>
              <a href="www.linkedin.com/in/luke-bucher">LinkedIn</a>


            </CardContent>  
          </Card>
          <Card sx={{minWidth:200,minHeight:200}}>
          <CardContent sx={{
              flexDirection:'column',
              display: 'flex'
            }}>
          <span>Warren Smith</span>
              <a href="wsmith2019@my.fit.edu">wsmith2019@fit.edu</a>
              <a href="https://github.com/warosm">Github</a>
              <a href="https://www.linkedin.com/in/warren-smith-95396b206/">LinkedIn</a>
          </CardContent>
          </Card>

          <Card sx={{minWidth:200,minHeight:200}}>
          <CardContent sx={{
              flexDirection:'column',
              display: 'flex'
            }}>
          <span>James Pabisz</span>
              <a href="jpabisz2020@my.fit.edu">jpabisz2020@fit.edu</a>
          </CardContent>
          </Card>
          <Card sx={{minWidth:200,minHeight:200}}>
          <CardContent sx={{
              flexDirection:'column',
              display: 'flex'
            }}>
          <span>Chris Kiefer</span>
              <a href="ckiefer2019@my.fit.edu">ckiefer2019@fit.edu</a>
          </CardContent>
          </Card>
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
                <Tab disabled label = "Milestone 2"/>
                <Tab disabled label = "Milestone 3"/>
                <Tab disabled label = "Project Plan Semester 2"/>
                <Tab disabled label = "Milestone 4"/>
                <Tab disabled label = "Milestone 5"/>
                <Tab disabled label = "Milestone 6"/>
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
          </TabPanel>
          <TabPanel value={value} index={3}>
            <h2>Milestone 3 - Nov 28</h2>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <h2>Project Plan - Jan 16</h2>
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
