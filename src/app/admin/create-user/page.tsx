import RegisterForm from "@/components/mycomponents/Register";
import React from "react";

// this page or screen will have forms to create a new user
// the database guys will give the data structure for the user entity
// in the mean time, just create a beautiful form with the following fields (name, indexNumber, student number ) and console.log these
// values when the form is submitted

const page = () => {
  return <div><RegisterForm/></div>;
};

export default page;
