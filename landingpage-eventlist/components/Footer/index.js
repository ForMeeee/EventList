/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function Footer() {
  return (
    <footer className="footer bg-navy">
      <div className="container">
        <a href="index.html">
          <img src="/images/logo.svg" alt="EventList" />
        </a>
        <div className="mt-3 d-flex flex-row flex-wrap footer-content align-items-baseline">
          <p className="paragraph">
            EventList adalah tempat di mana <br className="d-md-block d-none" />{" "}
            anda dapat mencari event sesuai <br className="d-md-block d-none" />{" "}
            dengan minat & terdekat.
          </p>
          <div className="d-flex flex-column footer-links">
            <div className="title-links mb-3">Our Services</div>
            <a href="#">Event Management</a>
            <a href="#">Online Ticketing</a>
            <a href="#">Merchant</a>
            <a href="#">Tickets</a>
          </div>
          <div className="d-flex flex-column footer-links">
            <div className="title-links mb-3">Partner With Us</div>
            <a href="#">Submit Event</a>
            <a href="#">Official Partner</a>
            <a href="#">Press</a>
            <a href="#">Sitemap</a>
          </div>
          <div className="d-flex flex-column footer-links">
            <div className="title-links mb-3">Support</div>
            <a href="#">Guidebook</a>
            <a href="#">Contact Us</a>
            <a href="#">Community</a>
            <a href="#">Terms & Condition</a>
          </div>
        </div>
        <div className="d-flex justify-content-center paragraph all-rights">
          All Rights Reserved. EventList © 2023.
        </div>
      </div>
    </footer>
  );
}