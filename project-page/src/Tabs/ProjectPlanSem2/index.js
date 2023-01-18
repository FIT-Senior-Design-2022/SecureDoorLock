import React from 'react';
import DocumentLayout from "../../Components/DocumentLayout";

export const ProjectPlanSem2 = () => {
  return (
    <DocumentLayout documentlist={[
      {name:"Project Plan",target:"ProjectPlan2.pdf"},
      {name:"Project Presentation",target:"PlanPresentation2.pdf"}
    ]}/>
  );
}

export default ProjectPlanSem2;
