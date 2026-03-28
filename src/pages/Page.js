import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import ReactMarkdown from "react-markdown";
import { backendUrl } from '../helpers';
import remarkGfm from 'remark-gfm';


import NotFound from './NotFound';
import Articles from '../components/Articles';

const PAGE = gql`
    query GetPage($slug: String!) {
        sivut(filters: { Osoite: { eq: $slug } }) {
            Otsikko
            OtsikkoKuva {
                url
                alternativeText
            }
            Tekstiosa
            Ominaisuudet {
                ... on ComponentOminaisuudetUutisvirtaKokonainen {
                    __typename
                }
            }
        }
    }
`

export default function Page() {
    const { slug } = useParams();
    const { loading, error, data } = useQuery(PAGE, {
        variables: { slug : slug }
    });

    if (loading) return <div className='page-body'><p class="spinner"></p></div>

    if (data.sivut.toString() === "") {
        return <NotFound/>
    };

    function flatten(text, child) {
        return typeof child === 'string'
          ? text + child
          : React.Children.toArray(child.props.children).reduce(flatten, text)
      }
      
      function HeadingRenderer(props) {
        var children = React.Children.toArray(props.children)
        var text = children.reduce(flatten, '')
        var slug = text.toLowerCase().replace(/\W/g, '-')
        return React.createElement('h' + props.level, {id: 'h' + props.level + '-' + slug}, props.children)
      }
    var otsikkoKuvaUrl = ""
    otsikkoKuvaUrl = backendUrl+"/uploads/oletustausta_8fb1c4ca45.jpeg"
    if (data.sivut[0].OtsikkoKuva) {
        otsikkoKuvaUrl = backendUrl+data.sivut[0].OtsikkoKuva.url
    }
    console.log(error);

    var features = <></>

    data.sivut[0].Ominaisuudet.forEach(feature => {
        if (feature.__typename === "ComponentOminaisuudetUutisvirtaKokonainen") {
            features = <>{features}<Articles/></>
        } else if (feature.__typename === "ComponentOminaisuudetUutisvirtaLyhyt") {
            features = <>{features}<p>placeholder lyhyelle uutisvirralle</p></>
        }
    })

    try {
        return (
            <div className="page-content">
                    <h1 key="1" className='page-title' style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url(${otsikkoKuvaUrl})`}}>{data.sivut[0].Otsikko}</h1>
                    <div className='page-body'>
                        {data.sivut[0].Tekstiosa != null && <ReactMarkdown remarkPlugins={[remarkGfm]} className="richtext" components={{h1: HeadingRenderer, h2: HeadingRenderer, h3: HeadingRenderer, h4: HeadingRenderer, h5: HeadingRenderer, h6: HeadingRenderer}}>{data.sivut[0].Tekstiosa}</ReactMarkdown>}
                        {features}
                    </div>
                    
            </div>
        )
    } catch {
        return <p>Virhe ladattaessa sisältöä.</p>
    }
}
