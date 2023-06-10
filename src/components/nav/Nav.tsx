import React from "react";

interface NavProps {
  links: {
    title: string;
    url: string;
  }[];
}

const Nav: React.FC<NavProps> = ({ links }) => {
  return (
    <nav className='bg-gray-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex-shrink-0'>
            <h1 className='text-white'>Logo</h1>
          </div>
          <div className='flex'>
            <ul className='flex space-x-4'>
              {links.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className='text-white hover:text-gray-300'>
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
