import React from "react";
import { TabView, TabPanel } from "primereact/tabview";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import File_Share_Lottie from "../components/File_Share_Lottie";

export default function Authentication() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1c2c] via-[#928dab] to-[#1f1c2c] text-white flex flex-col justify-center items-center px-4 py-10">
      <h2 className="text-4xl font-extrabold text-center drop-shadow-md mb-10">
        Secure File Sharing System
      </h2>

      <div className="flex flex-col-reverse lg:flex-row-reverse w-full max-w-6xl items-center justify-between gap-8">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 px-4">
          <div className="w-full rounded-xl p-6 bg-white shadow-2xl text-gray-800">
            <TabView className="custom-tabview">
              <TabPanel header="Sign In">
                <SignIn />
              </TabPanel>
              <TabPanel header="Sign Up">
                <SignUp />
              </TabPanel>
            </TabView>
          </div>
        </div>

        {/* Animation Section */}
        <div className="w-full lg:w-1/2 px-4">
          <File_Share_Lottie />
        </div>
      </div>
    </div>
  );
}
