import { Route, Routes } from 'react-router-dom';
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider }  from "@apollo/client";



import SiteHeader from './components/SiteHeader';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import Page from './pages/Page';
import Article from './pages/Article';
import NotFound from './pages/NotFound';
import { backendUrl } from './helpers';

//apollo client
const client = new ApolloClient({
  uri: backendUrl+'/graphql',
  cache:  new InMemoryCache()
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="app">
      <SiteHeader />
      <Routes>
          <Route exact path ="/" element={<Homepage/>}/>
          <Route path ="/:slug" element={<Page/>}/>
          <Route path="/uutiset/:slug" element={<Article/>}/>
          <Route path ="*" element={<NotFound/>}/>
          
      </Routes>

      <Footer/>

    </div>

    </ApolloProvider>
    
    
  );
  
}
  

      
export default App;