import Image from "next/image";
import { useState, useEffect } from "react";
import Layout from "../components/layout";
import Track from "../components/track/track";
import styles from "../styles/Login.module.css";
import config from "@/components/config";

const TrackWrapper = (props) => {
  const [selectedType, setSelectedType] = useState(null);
  if (selectedType) {
    return (
      <Layout>
        <Track type={selectedType.type}></Track>
      </Layout>
    );
  }

  return (
    <Layout>
      <>
        <h2 className="text-center">Track &#47; ट्रैक</h2>
        <div className={`${styles.grid} ${styles["grid-two"]}`}>
          {config.trackCards.map((card, index) => (
            <div
              onClick={() => {
                setSelectedType(card);
              }}
              key={index}
              className={`card`}
            >
              <span
                className={`material-icons ${styles.icon} ${
                  styles[card.colour]
                }`}
              >
                {card.icon}
              </span>
              <h2>
                {" "}
                {card.title.en} &#47;
                <br /> {card.title.hi} &#10230;
              </h2>
            </div>
          ))}
        </div>
      </>
    </Layout>
  );
};

export default TrackWrapper;
