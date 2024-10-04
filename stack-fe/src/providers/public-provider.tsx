import React from "react";
import PublicContext from "@/contexts/public-context";
import INews from "@/types/i-news";

const PublicProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [newsData, setNewsData] = React.useState<INews[]>([]);
  const onSetNewsData = (data: INews[]) => {
    setNewsData(data);
  };
  return (
    <PublicContext.Provider value={{ newsData, onSetNewsData }}>{children}</PublicContext.Provider>
  );
};

export default PublicProvider;
