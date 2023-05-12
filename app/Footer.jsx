import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white w-full py-4 flex justify-center items-center fixed bottom-0">
      <p className="text-center">
        &copy; {new Date().getFullYear()} Jabronis Inc.
      </p>
    </footer>
  );
};

export default Footer;
