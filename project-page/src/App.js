import "./App.css";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";




function App() {
  return (
    <div id="readerGroup">
      <Card
        sx={{
          minHeight: 300,
          display: "inline-flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: 5,
        }}
      >
        <CardContent sx={{
          
        }}>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
