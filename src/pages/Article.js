import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import ReactMarkdown from "react-markdown";
import NotFound from './NotFound';
import { HashLink as Link } from 'react-router-hash-link';

const ARTICLE = gql`
    query GetArticle($slug: String!) {
        uutiset (filters: { Osoite: { eq: $slug } }) {
            Otsikko
            createdAt
            Tekstiosa
        }
    }
`

const ARTICLES = gql`
    query GetArticles {
        uutiset (sort: "createdAt:desc", pagination: { limit: 10 }) {
            documentId
            Otsikko
            Osoite
            createdAt
        }
    }
`

export default function Article() {
    const { slug } = useParams();
    const { loading, error, data } = useQuery(ARTICLE, {
        variables: { slug : slug }
    });

    const { loading: articlesLoading, error: articlesError, data: articlesData } = useQuery(ARTICLES);

    if (loading || articlesLoading) return <div className='page-content'><p className="spinner"></p></div>

    if (data.uutiset.toString() === "") {
        return <NotFound/>
    };

    console.log(error);
    try {
        return (
            <div className="page-content">
                {data.uutiset.map(article => (
                    
                    <>
                    
                    {
                        
                        <>
                        
                        <div className='page-body'>
                            <Link to="/uutiset#top" scroll={(el) => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })} className="return-link">← Uutiset</Link>
                            {/*
                            <div className="articles-list-floating">
                                <h4>Muita uutisia</h4>
                            {articlesData.uutiset.map(art => (
                                <Link to={`/uutiset/${art.Osoite}#top`} className="article-link floating" key={art.documentId}>
                                    <span className="articles-list-date">{new Date(Date.parse(art.createdAt)).toLocaleString('fi-FI', {year: 'numeric', month: 'numeric', day: 'numeric'})}</span><span className="articles-list-title">{art.Otsikko}</span>
                                </Link>
                            ))}</div>*/}
                            <h1 className="article-title">{article.Otsikko}</h1>
                            <p className="article-date">{new Date(Date.parse(article.createdAt)).toLocaleString('fi-FI', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
                            <ReactMarkdown className="richtext">{article.Tekstiosa}</ReactMarkdown>
                        </div></>
                    }
                    
                    </>
                ))}
                
                
                

                    

            </div>
        )
    } catch {
        return <p>Virhe ladattaessa sisältöä.</p>
    }


}