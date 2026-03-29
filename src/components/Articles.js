import React from "react"
import { HashLink as Link } from 'react-router-hash-link';
import { useQuery, gql } from '@apollo/client';
import ReactMarkdown from "react-markdown";


const ARTICLES = gql`
    query GetArticles {
        uutiset (sort: "createdAt:desc") {
            documentId
            Otsikko
            Osoite
            createdAt
            Tekstiosa
        }
    }
`


const Articles = () => {

    const { loading, error, data } = useQuery(ARTICLES);

    if (loading) return <p className="spinner"></p>

    const truncateText = (text, length) => {
        if (text.length <= length) {
            return text;
        }

        return text.substring(0, length) + '\u2026';
    };

    try {
        return (
            <div className="articles-list">

                {data.uutiset.map(article => (
                    <div key={article.documentId}>
                        <Link to={"/uutiset/"+article.Osoite+"#top"} scroll={(el) => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })} className="article-link-large">{article.Otsikko}</Link>
                        <br></br>
                        <div className="articles-list-date-small">{new Date(Date.parse(article.createdAt)).toLocaleString('fi-FI', {year: 'numeric', month: 'numeric', day: 'numeric'})}</div>
                        <div className="article-preview">
                            {article.Tekstiosa && <ReactMarkdown>{truncateText(article.Tekstiosa, 280)}</ReactMarkdown>}
                        </div>
                    </div>
                ))}
              
            </div>
          )
    } catch {
        return <p>Virhe ladattaessa uutisia.</p>
    }
  
};

export default Articles;
