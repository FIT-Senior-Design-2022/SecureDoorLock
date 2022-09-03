import * as React from 'react';

import "./App.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ProjectPlan from "./Tabs/ProjectPlan";
import { Box } from "@mui/system";
import { Tab, Tabs } from "@mui/material";


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
      <div className="aboutUs">
        <h1>About Us</h1>
        <div className="infoCards">
          <Card sx={{minWidth:250,minHeight:200}}>
            <CardContent sx={{
              flexDirection:'column',
              display: 'flex'
            }}>
              <span>Luke Bucher</span>
              <a href="lbucher2017@fit.edu">lbucher2017@fit.edu</a>
              <a href="https://github.com/LukeBucher">LukeBucher - Github</a>
              <a href="www.linkedin.com/in/luke-bucher">LukeBucher - LinkedIn</a>


            </CardContent>  
          </Card>
          <Card sx={{minWidth:200,minHeight:200}}>2</Card>
          <Card sx={{minWidth:200,minHeight:200}}>3</Card>
          <Card sx={{minWidth:200,minHeight:200}}>4</Card>

        </div>
      </div>
    <div className="readerGroup" id="readerGroup">
      <h1>About the Project</h1>
      <Card
        sx={{
          minHeight: 300,
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
                <Tab disabled label = "Milestone 1"/>
                <Tab disabled label = "Milestone 2"/>
                <Tab disabled label = "Milestone 3"/>
              </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <h2>Project Plan</h2>
            <ProjectPlan/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <h2>Milestone 1</h2>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <h2>Milestone 2</h2>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <h2>Milestone 3</h2>
          </TabPanel>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

export default App;
