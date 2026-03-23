import React from 'react'
import { backendUrl } from '../helpers';
import ReactMarkdown from "react-markdown";
import { HashLink as Link } from 'react-router-hash-link';
import { useQuery, gql } from '@apollo/client';

const HOMEDATA = gql`
    query GetHomepageData {
        etusivu {
          Otsikko
          IsoKuva {
            alternativeText
            url
          }
          Tekstiosa
          Painikkeet {
            id
            Linkki
            Teksti
          }
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


export default function Homepage() {

  const { loading, error, data } = useQuery(HOMEDATA);
  const { loading: articlesLoading, error: articlesError, data: articlesData } = useQuery(ARTICLES);

  if (loading || articlesLoading) return <p>Ladataan...</p>

  console.log(data);

  function HeadingRenderer(props) {
    var children = React.Children.toArray(props.children)
    var text = children.reduce(flatten, '')
    var slug = text.toLowerCase().replace(/\W/g, '-')
    return React.createElement('h' + props.level, {id: 'h' + props.level + '-' + slug}, props.children)
  }
  
  function flatten(text, child) {
    return typeof child === 'string'
      ? text + child
      : React.Children.toArray(child.props.children).reduce(flatten, text)
  }

  var otsikkoKuvaUrl = ""
      otsikkoKuvaUrl = backendUrl+"/uploads/oletustausta_8fb1c4ca45.jpeg"
      if (data.etusivu.IsoKuva) {
          otsikkoKuvaUrl = backendUrl+data.etusivu.IsoKuva.url;
      }

  var buttons = <></>
  var buttonsCount = 0
  data.etusivu.Painikkeet.forEach(button => {
    if (button.Linkki && button.Teksti) {
      buttonsCount += 1
      buttons = <>{buttons}<Link to={button.Linkki} className="frontpage-button">{button.Teksti}</Link></>
      if (data.etusivu.Painikkeet.length == 4 && buttonsCount == 2) { 
        buttons = <>{buttons}<div class="break"></div></>
      }
      if (data.etusivu.Painikkeet.length == 5 && buttonsCount == 2) {
        buttons = <>{buttons}<div class="break"></div></>
      }

      if (data.etusivu.Painikkeet.length == 6 && buttonsCount == 3) {
        buttons = <>{buttons}<div class="break"></div></>
      }
    }
  })
  return (
<>
    <h1 style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url(${otsikkoKuvaUrl})`}} className="frontpage-title">{data.etusivu.Otsikko}</h1>
    <div className={"frontpage-button-container"}>{buttons}</div>
    <div className='page-content'>
      <div className='page-body'>
        
        
        <ReactMarkdown className='richtext richtext-centered' components={{h1: HeadingRenderer, h2: HeadingRenderer, h3: HeadingRenderer, h4: HeadingRenderer, h5: HeadingRenderer, h6: HeadingRenderer}}>{data.etusivu.Tekstiosa}</ReactMarkdown>
        
      </div>

      <div className="articles-list-short">
        <div className="page-body">
          <h4>Viimeisimmät uutiset</h4>
      {articlesData.uutiset.map(art => (
          <Link to={`/uutiset/${art.Osoite}#top`} className="article-link floating" key={art.documentId}>
              <span className="articles-list-date">{new Date(Date.parse(art.createdAt)).toLocaleString('fi-FI', {year: 'numeric', month: 'numeric', day: 'numeric'})}</span><span className="articles-list-title">{art.Otsikko}</span>
          </Link>
      ))}
      <Link to="/uutiset#top" className="article-link floating">Lisää uutisia</Link>
      </div></div>
    </div></>
  )
}
