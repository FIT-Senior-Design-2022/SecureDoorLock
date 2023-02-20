import React from 'react';
import DocumentLayout from "../../Components/DocumentLayout";

export const MileStone4 = () => {
  return (
    <DocumentLayout documentlist={[
        {name:"Progress Evaluation",target:"Milestone4Report.pdf"},
        {name:"Milestone Presentation",target:"Milestone4Presentation.pdf"},
    ]}/>
  );
}

export default MileStone4;
