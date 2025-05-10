import { useState } from "react";
import footer from "/footer-bg.webp";
import logo from "/logo.webp";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerData] = useState([
    {
      title: "APPLICATIONS",
      links: ["Apparel", "Automotive", "Filtration", "Customised Nonwoven"],
    },
    {
      title: "COMPANY",
      links: ["Who We Are", "Global Competency", "Innovation", "ESG Impact"],
    },
    {
      title: "MORE",
      links: ["Contact Us", "Careers"],
    },
    {
      title: "FOLLOW US",
      links: ["LinkedIn"],
    },
  ]);

  return (
    <footer
      className="bg-cover bg-center text-gray-700 py-20 px-6 md:px-20"
      style={{ backgroundImage: `url(${footer})` }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-start mb-6">
          <img src={logo} alt="Supreme Group" className="w-32" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-2 gap-6 text-center md:text-left">
          {footerData.map((section, index) => (
            <div key={index} className="text-left">
              <h3 className="font-bold mb-2">{section.title}</h3>
              <ul className="space-y-1">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-15 text-sm lg:flex lg:items-center lg:justify-between">
          <p>©{currentYear}. All Rights Reserved.</p>
          <p className="hidden lg:block">
            Supreme House, 110, 16th Road, Chembur, Mumbai – 400071.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
