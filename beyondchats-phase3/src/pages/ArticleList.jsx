import { useEffect, useState } from "react";
import { fetchArticles } from "../services/articleService";
import ArticleCard from "../components/ArticleCard";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await fetchArticles();
      setArticles(data.data); // pagination structure
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="container">
      <h1>BeyondChats Articles</h1>

      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
