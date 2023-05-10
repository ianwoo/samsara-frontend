import "./About.scss";

import MBlock from "./svgs/MBlock";

type Props = {};

function About(props: Props) {
  return (
    <div className="about">
      <div className="banner">
        <MBlock />
        <h1>Let's open the gate to Web3</h1>
      </div>
      <div className="content">
        <div className="subcontent left">
          <div className="guy" />
        </div>
        <div className="subcontent right">
          <div className="mountain" />
          <h1 className="about-us">
            About
            <br />
            Us
          </h1>
          <div className="paragraph">
            <span className="pg-header">Inclusivity Maximalists.</span>
            <p>
              We want to create an ecosystem that welcomes everyone, a place that has the power to overcome wealth and
              knowledge barriers. We want to create access: a platform for like-minded individuals like you to
              participate and navigate their own Web3 journey.
            </p>
          </div>
          <div className="paragraph">
            <span className="pg-header">No Compromises for User Experience.</span>
            <p>
              We all have the same 24 hours in a day, but <span className="italic">together</span>, we'll use our time -
              listening to you, and creating products that actually help your DeFi journey - Leave the small things to
              us. Our constant updates will be the result of listening to our community, something we pride ourselves
              in.
            </p>
          </div>
          <div className="paragraph">
            <span className="pg-header">Here for the Possibility.</span>
            <p>
              From DeFi to NFTs, Web3 is the beacon of hope for building a self-governing and sustainable social graph.
              We're here to embrace the uncertainities in the space. We hope you'll join us, and together, be the ones
              at the forefront of identifying the possibilities of what we can achieve.
            </p>
          </div>
        </div>
      </div>
      <div className="team">
        <h1>Team Members</h1>
        <div className="team-container">
          <div className="team-member tom">
            <div className="portrait">
              <div className="portrait-bar">
                <span className="member-name">Tom Cheng</span>
                <div className="icons">
                  <div className="linkedin" />
                  <div className="twitter" />
                </div>
              </div>
            </div>
            <div className="description">
              <span className="member-name-desc">Co-Founder - Tom Cheng</span>
              <span className="desc">
                Seasoned senior management with 10+ years experience in crypto, tech, and basic materials.
              </span>
              {/* ^ leave the oxford comma, Tom */}
            </div>
          </div>
          <div className="team-member duckie">
            <div className="portrait">
              <div className="portrait-bar">
                <span className="member-name">0xDuckie</span>
                <div className="icons"></div>
              </div>
            </div>
            <div className="description">
              <span className="member-name-desc">Co-Founder - 0xDuckie</span>
              <span className="desc">
                Active ETH user since '17, involved contributor to multiple DeFi projects, and lead community groups
                with 60k+ members.
              </span>
              {/* again, ^ leave the oxford comma */}
            </div>
          </div>
          <div className="team-member daoyan">
            <div className="portrait">
              <div className="portrait-bar">
                <span className="member-name">0xDaoyan</span>
                <div className="icons"></div>
              </div>
            </div>
            <div className="description">
              <span className="member-name-desc">Lead Engineer - 0xDaoyan</span>
              <span className="desc">
                Blockchain enthusiast, with years of experience in DeFi, blockchain, and DevOps.
              </span>
              {/* ^ leave the oxford comma */}
            </div>
          </div>
          <div className="team-member yama">
            <div className="portrait">
              <div className="portrait-bar">
                <span className="member-name">0xYama</span>
                <div className="icons"></div>
              </div>
            </div>
            <div className="description">
              <span className="member-name-desc">Full Stack Developer - 0xYama</span>
              <span className="desc">
                10+ years experience as designer and developer in gaming, finance, and crypto.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
