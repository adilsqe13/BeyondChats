export default function ArticleCard({ article }) {
    return (
      <div className="card">
        <h2>{article.title}</h2>
  
        <p className="meta">
          <a href={article.url} target="_blank">
            Original Article
          </a>
        </p>
  
        <p className="content">
          {article.content}
        </p>
      </div>
    );
  }
  