import React from 'react';
import DocumentLayout from "../../Components/DocumentLayout";

export const MileStone1 = () => {
  return (
    <DocumentLayout documentlist={[
        {name:"Requirements Document",target:"Requirements-SecureDoorLock.pdf"},
        {name:"Design Document",target:"Design-SecureDoorLock.pdf"},
        {name:"Test Plan Document",target:"Test Plan-SecureDoorLock.pdf"},
        {name:"Progress Evaluation",target:"SecureDoorOpenerMilestone1.pdf"},
        {name:"Milestone Presentation",target:"Milestone1Presentation-SecureDoorLock.pdf"}
    ]}/>
  );
}

export default MileStone1;
