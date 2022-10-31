import React from 'react';
import DocumentLayout from "../../Components/DocumentLayout";

export const MileStone2 = () => {
  return (
    <DocumentLayout documentlist={[
        {name:"Progress Evaluation",target:"SecureDoorOpenerMilestone2.pdf"},
        {name:"Milestone Presentation",target:"Design-SecureDoorLock.pdf"},
    ]}/>
  );
}

export default MileStone2;
