import React from "react";
import TermsAndConditions from "./TermsAndConditions";

// Privacy policy page reuses the same legal content as Terms & Conditions.
// This keeps the copy in sync while still exposing a dedicated /privacy route.
const PrivacyPolicy: React.FC = () => {
  return <TermsAndConditions />;
};

export default PrivacyPolicy;

