import React from "react";
import Lottie from "lottie-react";
import file_share_lottie from "../assets/File_Sharing.json";
export default function File_Share_Lottie() {
  return (
    <div className="w-full">
      <Lottie animationData={file_share_lottie} loop={true} autoplay={true} />
    </div>
  );
}
