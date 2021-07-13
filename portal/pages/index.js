import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout";
import styles from "../styles/Home.module.css";
import config from "@/components/config";

const Home = () => {
  return (
    <Layout>
      <div className={styles.grid}>
        {config.homepageCards.map((card, index) => {
          return (
            <Link key={index} href={card.target} passHref>
              <div className="logo-card">
                <div className="card">
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
              </div>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
};

export default Home;
