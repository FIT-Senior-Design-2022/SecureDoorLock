import React from 'react';
import DocumentLayout from "../../Components/DocumentLayout";

export const ProjectPlan = () => {
  return (
    <DocumentLayout documentlist={[
      {name:"Project Plan",target:"SeniorProjectPlan.pdf"},
      {name:"Project Presentation",target:"ProjectPlanSecureDoorLock.pdf"}
    ]}/>
  );
}

export default ProjectPlan;
