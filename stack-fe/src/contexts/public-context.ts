import React from "react";
import INews from "@/types/i-news";
interface IPublicContext {
  newsData: INews[];
  onSetNewsData: (data: INews[]) => void;
}
const PublicContext = React.createContext<IPublicContext | null>(null);
export default PublicContext;
