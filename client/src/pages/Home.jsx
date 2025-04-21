import React from "react";
import Send_File_Form from "../components/Send_File_Form";
import Receiver from "../components/Receiver";

export default function Home() {
  return (
    <div>
      <Send_File_Form />
      <Receiver />
    </div>
  );
}
