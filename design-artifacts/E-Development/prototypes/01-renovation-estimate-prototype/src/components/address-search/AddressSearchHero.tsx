import familyHero from "../../assets/hero/family-renovation.png";
import { AdvancedSearchNotice } from "./AdvancedSearchNotice";
import { AddressCombobox } from "./AddressCombobox";
import "./address-search-hero.css";

export function AddressSearchHero() {
  return (
    <main id="address-search-hero-search" className="address-search-hero">
      <img
        id="address-search-hero-family-image"
        className="address-search-hero__image"
        src={familyHero}
        alt=""
        width="1182"
        height="537"
        loading="eager"
        aria-hidden="true"
      />
      <div className="address-search-hero__scrim" aria-hidden="true" />
      <div className="address-search-hero__content">
        <h1 id="address-search-hero-primary-headline">
          Renovation Calculator Report
        </h1>
        <p id="address-search-hero-address-instruction">
          Please type property address below:
        </p>
        <AddressCombobox />
        <p id="address-search-hero-value-supporting-copy">
          If you&apos;re looking for a new place to call home, we will help you
          know more about it.
        </p>
        <AdvancedSearchNotice />
      </div>
    </main>
  );
}
