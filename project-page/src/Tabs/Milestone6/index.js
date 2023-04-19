import React from "react";
import DocumentLayout from "../../Components/DocumentLayout";

export const MileStone6 = () => {
  return (
    <DocumentLayout
      documentlist={[
        {
          name: "Progress Evaluation",
          target: "SecureDoorLockMilestone6ProgressEvulation.pdf",
        },
        {
          name: "Milestone Presentation",
          target: "SecureDoorLockMilestone6Presentation.pdf",
        },
        {
          name: "User Manual",
          target: "SecureDoorLockUser_DeveloperManual.docx.pdf",
        },
      ]}
    />
  );
};

export default MileStone6;
