import styles from "@/assets/scss/public-layout.module.scss";
import PublicContext from "@/contexts/public-context";
import INews from "@/types/i-news";
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const context = React.useContext(PublicContext);
  const newsList: INews[] =
    context && context.newsData && context.newsData.length > 0 ? context.newsData : [];
  React.useEffect(() => {
    console.log("abc");
  }, []);
  return (
    <React.Fragment>
      <div className={styles.newsBox}>
        {newsList && newsList.length > 0 ? (
          <React.Fragment>
            {newsList.map((val, idx) => {
              return (
                <div className={styles.itemNews} key={`news-item-${idx}`}>
                  <Link to="/">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URI}/images/${val.news_img}`}
                      width={350}
                      className={styles.newsImg}
                    />
                  </Link>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.titleCategory}>{val.category_news_name}</h3>
                    <h2 className={styles.titleNews}>
                      <Link to="/">{val.news_title}</Link>
                    </h2>
                    <div className={styles.introNews}>{val.news_intro}</div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ) : (
          <React.Fragment></React.Fragment>
        )}
      </div>
      <div className={styles.pagination}>
        <button className={styles.page}>1</button>
        <button className={styles.page}>2</button>
        <button className={styles.page}>3</button>
        <button className={styles.page}>4</button>
      </div>
    </React.Fragment>
  );
};

export default HomePage;
