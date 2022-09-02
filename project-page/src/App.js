import "./App.css";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function App() {
  return (

    <div class = 'root'>
      <div class='aboutUs'>
        <h1>About Us</h1>
        <div class = 'infoCards'>
          <Card sx={{minWidth:250,minHeight:200}}>
            <CardContent sx={{
              flexDirection:'column',
              display: 'flex'
            }}>
              <text>Luke Bucher</text>
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
    <div class='readerGroup' id="readerGroup">
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
          <div>
            <ButtonGroup>
              <Button>Project Plan</Button>
              <Button disabled>Milestone 1</Button>
              <Button disabled>Milestone 2</Button>
              <Button disabled>Milestone 3</Button>
            </ButtonGroup>
          </div>
          <div>
              <a href="./assets/SeniorProjectPlan.pdf">Project Plan</a>
              <iframe srcDoc="./assets/SeniorProjectPlan.pdf" title="Projet Plan"></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

export default App;
