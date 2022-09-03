import React from 'react';
import { ListItem,List, ListItemButton, ListItemText, Skeleton } from '@mui/material';
import "./index.css"
export const DocumentLayout = ({documentlist}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [selectedTarget, setSelectedTarget] = React.useState("");
  const handleListItemClick = (event, index, target) => {
    setSelectedIndex(index);
    setSelectedTarget(target);
  };
  return (
    <div className="DocumentListContainer">
      <div className="Documents">
        <List>
        {documentlist.map((documentInfo,index)=>{
          return(
            <ListItem key={index}>
              <ListItemButton selected={selectedIndex === index} onClick={(event) => handleListItemClick(event, index, documentInfo.target)}>
                <ListItemText primary={documentInfo.name}/>
              </ListItemButton>
            </ListItem>
          )
        })}
        </List>
      </div>
      <div className="Document">
        {selectedIndex === -1 ? 
        <Skeleton variant="rounded" height={200} width={600} animation="wave"/>
        : <iframe title="Document" src={`./assets/${selectedTarget}`}/>}
      </div>
    </div>
  );
}

export default DocumentLayout;
