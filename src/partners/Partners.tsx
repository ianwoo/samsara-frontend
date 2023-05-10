import './Partners.scss';

const Partners = () => {
  return (
    <div className="partners-page">
      <div className="wave">
        <div className="bars">
          <div className="ring">
            <div className="astronaut" />
          </div>
        </div>
      </div>
      <div className="partners-inner">
        <div className="first-partners">
          <h1>Partners</h1>
          <div className="first-wrapped">
            <div className="partner-box boba" />
            <div className="partner-box gbv" />
          </div>
        </div>
        <div className="ecosystem-partners">
          <div className="translated-icon" />
          <h2>OolongSwap</h2>
          <span>The leading DEX built on Boba Network.</span>
          <div className="icons">
            <div className="link" />
            <div className="twitter" />
            <div className="telegram" />
            <div className="discord" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
