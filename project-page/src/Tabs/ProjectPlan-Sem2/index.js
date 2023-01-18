import React from 'react';
import DocumentLayout from "../../Components/DocumentLayout";

export const ProjectPlanSem2 = () => {
  return (
    <DocumentLayout documentlist={[
      {name:"Project Plan",target:"ProjectPlan-2.pdf"},
      {name:"Project Presentation",target:"PlanPresentation 2.pdf"}
    ]}/>
  );
}

export default ProjectPlan;
