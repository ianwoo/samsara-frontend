import './header_v2.scss';

import { useState } from 'react';

import { NavLink } from 'react-router-dom';

import { SamsaraSVG } from '../header/svgs/samsara';

export enum HeaderBG {
  Black,
  White,
}

enum HeaderDD {
  About,
  Blog,
  Products,
}

type Props = {
  bg: HeaderBG;
};

function HeaderV2(props: Props) {
  const { bg } = props;

  const [selectedDropdown, setSelectedDropdown] = useState<
    HeaderDD | undefined
  >(undefined);

  return (
    <div className="header-v2">
      {SamsaraSVG(bg === HeaderBG.Black ? "white" : "black")}
      <div
        className={"header-menu" + (bg === HeaderBG.Black ? " dark-bg" : "")}
      >
        <NavLink to={"/about"}>
          <button
            className="menu-item about"
            //   onClick={() => setSelectedDropdown(HeaderDD.About)}
          >
            About
          </button>
        </NavLink>
        <NavLink to={"/partners"}>
          <button
            className="menu-item partners"
            //   onClick={() => setSelectedDropdown(HeaderDD.About)}
          >
            Partners
          </button>
        </NavLink>
        <button
          className="menu-item blog"
          onClick={() => setSelectedDropdown(HeaderDD.Blog)}
        >
          Blog
        </button>
        <NavLink to={"/feeds"}>
          <button
            className="menu-item feeds"
            onClick={() => setSelectedDropdown(HeaderDD.Products)}
          >
            Price Feeds
          </button>
        </NavLink>
        <button className="menu-item roadmap">Roadmap</button>
      </div>
    </div>
  );
}

export default HeaderV2;
