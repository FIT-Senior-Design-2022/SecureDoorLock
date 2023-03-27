import React from 'react';
import DocumentLayout from "../../Components/DocumentLayout";

export const MileStone5 = () => {
  return (
    <DocumentLayout documentlist={[
        {name:"Progress Evaluation",target:"Milestone5SecureDoorLock.pdf"},
        {name:"Milestone Presentation",target:"Milestone5Presentation.pdf"},
        {name:"Ebook",target:"Showcase_Spring2023_Ebook_CS_DoorLock.docx.pdf"},
        {name:"Poster",target:"poster_design_template.pptx.pdf"},
    ]}/>
  );
}

export default MileStone5;
