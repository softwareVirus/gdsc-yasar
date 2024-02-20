import React, { Fragment } from "react";
import { useError } from "../context/errorProvider";

const ErrorBox = () => {
  const { error } = useError();
  return (
    <Fragment>
      {error !== null && <div className="error-message">{error}</div>}
    </Fragment>
  );
};

export default ErrorBox;
